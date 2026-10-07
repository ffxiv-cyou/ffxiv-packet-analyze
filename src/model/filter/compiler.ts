import type { Packet } from "overlay-toolkit";
import type { Expr, PathPart, Span } from "./ast";
import { parseFilter } from "./parser";
import { FilterSyntaxError } from "./lexer";
import type { FieldInfo, FilterSymbols, StructInfo } from "./symbols";
import {
    arith,
    compareValues,
    compileRegex,
    constNode,
    isTruthy,
    looseEq,
    packetCtx,
    readDiscriminator,
    readFieldValue,
    type FieldDesc,
    type FilterValue,
    type PacketCtx,
    type RNode,
    type ValueType,
} from "./runtime";

export interface Diagnostic {
    message: string;
    start: number;
    end: number;
    severity: "error" | "warning";
}

export interface CompiledFilter {
    source: string;
    /** No filter at all: every packet matches. */
    empty: boolean;
    /** False when the expression could not be compiled; `predicate` keeps everything. */
    valid: boolean;
    predicate: (packet: Packet) => boolean;
    /** Opcode fast pre-filter, or null when the expression has no opcode constraint. */
    opcodes: number[] | null;
    diagnostics: Diagnostic[];
}

const PSEUDO_ROOTS = new Set(["packet", "hdr", "ipc", "data", "payload"]);

const DIR_SYMBOLS = new Map<string, string>([
    ["c", "c"],
    ["client", "c"],
    ["s", "s"],
    ["server", "s"],
]);

class Compiler {
    private diagnostics: Diagnostic[] = [];

    constructor(private symbols: FilterSymbols, private source: string) {}

    get result(): Diagnostic[] {
        return this.diagnostics;
    }

    private error(message: string, at: Span): void {
        this.diagnostics.push({ message, start: at.start, end: at.end, severity: "error" });
    }

    private warn(message: string, at: Span): void {
        this.diagnostics.push({ message, start: at.start, end: at.end, severity: "warning" });
    }

    private hasError(): boolean {
        return this.diagnostics.some((d) => d.severity === "error");
    }

    resolve(expr: Expr, ctx?: FieldDesc): RNode {
        switch (expr.k) {
            case "num":
                return constNode(expr.value, typeof expr.value === "bigint" ? "bigint" : "number");
            case "str":
                return this.resolveString(expr.value, expr, ctx);
            case "bool":
                return constNode(expr.value, "bool");
            case "ident":
                return this.resolveIdent(expr, ctx);
            case "path":
                return this.resolvePath(expr);
            case "unary":
                return this.resolveUnary(expr);
            case "binary":
                return this.resolveBinary(expr);
            case "in":
                return this.resolveIn(expr);
            case "call":
                return this.resolveCall(expr);
        }
    }

    // -----------------------------------------------------------------------
    // Symbols
    // -----------------------------------------------------------------------

    private resolveIdent(expr: Span & { name: string }, ctx?: FieldDesc): RNode {
        const name = expr.name;

        if (ctx) {
            const symbol = this.lookupSymbol(name, ctx, expr);
            if (symbol) return symbol;

            if (ctx.ipcTypeNames) {
                const struct = this.symbols.struct(name);
                if (struct) return constNode(struct.alias, "string");
            }
            if (ctx.opcodeTypeNames) {
                const resolved = this.symbols.opcodeOfType(name);
                if (resolved) {
                    if (resolved.ambiguous) {
                        this.warn(`"${name}" 在客户端和服务端都存在，请改用 ipc.name == ${name}`, expr);
                    }
                    return constNode(resolved.opcode, "number");
                }
            }

            this.error(`无法解析符号 "${name}"`, expr);
            return constNode(undefined, "any");
        }

        // No comparison context: a bare IPC type name is a type test.
        const struct = this.symbols.struct(name);
        if (struct) {
            return {
                type: "bool",
                isField: false,
                eval: (packet) => packet.struct?.name === struct.name,
            };
        }

        this.error(`未知的类型或符号 "${name}"，字段引用必须带结构体前缀，例如 ${name}.param1`, expr);
        return constNode(undefined, "any");
    }

    private lookupSymbol(name: string, ctx: FieldDesc, at: Span): RNode | null {
        if (ctx.enumSymbols?.has(name)) return constNode(ctx.enumSymbols.get(name)!, "number");
        if (ctx.dbLookup?.has(name)) {
            if (ctx.dbAmbiguous?.has(name)) {
                this.warn(`"${name}" 对应多个 ID，已取最小值`, at);
            }
            return constNode(ctx.dbLookup.get(name)!, "number");
        }
        if (ctx.stringSymbols?.has(name)) return constNode(ctx.stringSymbols.get(name)!, "string");
        return null;
    }

    private resolveString(value: string, at: Span, ctx?: FieldDesc): RNode {
        if (ctx) {
            const symbol = this.lookupSymbol(value, ctx, at);
            if (symbol) return symbol;

            if (isNumericType(ctx.valueType)) {
                const parsed = parseNumericString(value);
                if (parsed !== null) return constNode(parsed, typeof parsed === "bigint" ? "bigint" : "number");
            }
            if (ctx.ipcTypeNames) {
                const struct = this.symbols.struct(value);
                if (struct) return constNode(struct.alias, "string");
            }
        }
        void at;
        return constNode(value, "string");
    }
    // -----------------------------------------------------------------------
    // Paths
    // -----------------------------------------------------------------------

    private resolvePath(expr: Span & { root: string; parts: PathPart[] }): RNode {
        if (PSEUDO_ROOTS.has(expr.root)) return this.resolvePseudo(expr);

        const struct = this.symbols.struct(expr.root);
        if (!struct) {
            this.error(`未知的 IPC 类型 "${expr.root}"`, expr.parts[0]);
            return constNode(undefined, "any");
        }
        return this.resolveIpcPath(struct, expr);
    }

    private resolvePseudo(expr: Span & { root: string; parts: PathPart[] }): RNode {
        const first = expr.parts[0];

        if (expr.root === "data" || expr.root === "payload") {
            if (expr.parts.length !== 1) {
                this.error(`${expr.root} 只支持字节下标/切片`, expr);
                return constNode(undefined, "any");
            }
            const fromPayload = expr.root === "payload";
            if (first.slice) {
                const [a, b] = first.slice;
                const label = `${expr.root}[${a}:${b}]`;
                return this.node("bytes", undefined, label, (ctx) => {
                    const dw = fromPayload ? ctx.ipcDw : ctx.dw;
                    if (a < 0 || b < a || b > dw.byteLength) return undefined;
                    return new Uint8Array(dw.buffer, dw.byteOffset + a, b - a);
                });
            }
            if (first.index !== undefined) {
                const index = first.index;
                const label = `${expr.root}[${index}]`;
                return this.node("number", undefined, label, (ctx) => {
                    const dw = fromPayload ? ctx.ipcDw : ctx.dw;
                    if (index >= dw.byteLength) return undefined;
                    return dw.getUint8(index);
                });
            }
            this.error(`${expr.root} 需要下标，例如 ${expr.root}[0]`, first);
            return constNode(undefined, "any");
        }

        if (expr.parts.length !== 2 || first.index !== undefined || first.slice) {
            this.error(`${expr.root} 需要一个字段名，例如 ${expr.root}.opcode`, expr);
            return constNode(undefined, "any");
        }

        const field = expr.parts[1];
        const key = `${expr.root}.${field.name}`;

        if (expr.root === "packet") {
            switch (key) {
                case "packet.opcode":
                    return this.node("number", { label: key, valueType: "number", opcodeTypeNames: true }, key, (ctx) => ctx.packet.opcode);
                case "packet.dir":
                    return this.node("string", { label: key, valueType: "string", stringSymbols: DIR_SYMBOLS }, key, (ctx) => (ctx.packet.dir ? "c" : "s"));
                case "packet.len":
                case "packet.length":
                    return this.node("number", { label: key, valueType: "number" }, key, (ctx) => ctx.packet.data.byteLength);
                case "packet.epoch":
                    return this.node("number", { label: key, valueType: "number" }, key, (ctx) => ctx.packet.epoch);
                case "packet.conn":
                    return this.node("string", { label: key, valueType: "string" }, key, (ctx) => ctx.packet.conn);
                case "packet.self":
                    return this.node("bool", { label: key, valueType: "bool" }, key, (ctx) => ctx.self);
            }
            this.error(`未知字段 "${key}"`, field);
            return constNode(undefined, "any");
        }

        if (expr.root === "hdr") {
            switch (key) {
                case "hdr.src":
                case "hdr.source":
                case "hdr.sourceActor":
                    return this.node("number", { label: key, valueType: "number" }, key, (ctx) => ctx.source);
                case "hdr.dst":
                case "hdr.target":
                case "hdr.targetActor":
                    return this.node("number", { label: key, valueType: "number" }, key, (ctx) => ctx.target);
            }
            this.error(`未知字段 "${key}"`, field);
            return constNode(undefined, "any");
        }

        // ipc.*
        switch (key) {
            case "ipc.name":
                return this.node("string", { label: key, valueType: "string", ipcTypeNames: true }, key, (ctx) => ctx.ipcName ?? undefined);
        }
        this.error(`未知字段 "${key}"`, field);
        return constNode(undefined, "any");
    }

    private resolveIpcPath(
        rootStruct: StructInfo,
        expr: Span & { root: string; parts: PathPart[] },
    ): RNode {
        let cur = rootStruct;
        let offset = 0;
        let subtypeName = "";
        let discCheck: { field: FieldInfo; value: number } | null = null;
        const labels: string[] = [rootStruct.alias];

        for (let i = 1; i < expr.parts.length; i++) {
            const part = expr.parts[i];
            const field = cur.fields.get(part.name);

            if (!field) {
                const disc = cur.discriminator;
                if (
                    disc &&
                    part.index === undefined &&
                    part.slice === undefined &&
                    disc.enumValues.has(part.name)
                ) {
                    subtypeName = part.name;
                    discCheck = { field: disc.info, value: disc.enumValues.get(part.name)! };
                    labels.push(part.name);
                    continue;
                }
                this.error(`类型 ${cur.alias} 没有字段 "${part.name}"`, part);
                return constNode(undefined, "any");
            }

            offset += field.offset;

            if (part.slice) {
                this.error(`字段 "${field.name}" 不支持切片`, part);
                return constNode(undefined, "any");
            }
            if (part.index !== undefined) {
                if (!field.arrayLength) {
                    this.error(`字段 "${field.name}" 不是数组`, part);
                    return constNode(undefined, "any");
                }
                offset += part.index * field.size;
            } else if (field.arrayLength && i < expr.parts.length - 1) {
                this.error(`数组字段 "${field.name}" 需要下标，例如 ${field.name}[0]`, part);
                return constNode(undefined, "any");
            }

            labels.push(part.index !== undefined ? `${field.name}[${part.index}]` : field.name);

            const isLast = i === expr.parts.length - 1;
            if (isLast) {
                return this.buildLeaf(rootStruct, cur, field, offset, part, subtypeName, discCheck, labels.join("."));
            }
            if (field.kind !== "struct" || !field.struct) {
                this.error(`字段 "${field.name}" 不是结构体，无法继续访问`, part);
                return constNode(undefined, "any");
            }
            cur = field.struct;
        }

        this.error("缺少字段名", expr);
        return constNode(undefined, "any");
    }

    private buildLeaf(
        rootStruct: StructInfo,
        owner: StructInfo,
        field: FieldInfo,
        offset: number,
        part: PathPart,
        subtypeName: string,
        discCheck: { field: FieldInfo; value: number } | null,
        label: string,
    ): RNode {
        const valueType = fieldValueType(field);
        const desc: FieldDesc = { label, valueType };

        const aliasKey = this.symbols.aliasKey(owner.name, field.name, subtypeName);
        if (aliasKey) {
            const enumSymbols = this.symbols.symbolsForAliasKey(aliasKey);
            const dbLookup = this.symbols.dbForAliasKey(aliasKey);
            const dbAmbiguous = this.symbols.dbAmbiguousForAliasKey(aliasKey);
            if (enumSymbols) desc.enumSymbols = enumSymbols;
            if (dbLookup) desc.dbLookup = dbLookup;
            if (dbAmbiguous) desc.dbAmbiguous = dbAmbiguous;
        } else if (field.enumValues) {
            desc.enumSymbols = field.enumValues;
        }

        const elementIndex = part.index ?? null;
        const structName = rootStruct.name;
        const evalFn = (ctx: PacketCtx): FilterValue => {
            if (!ctx.struct || ctx.struct.name !== structName) return undefined;
            if (discCheck) {
                const value = readDiscriminator(ctx, discCheck.field);
                if (value !== discCheck.value) return undefined;
            }
            return readFieldValue(ctx.ipcDw, offset, field, elementIndex);
        };

        return { type: valueType, isField: true, desc, eval: evalFn };
    }

    private node(
        type: ValueType,
        desc: FieldDesc | undefined,
        label: string,
        evalFn: (ctx: PacketCtx) => FilterValue,
    ): RNode {
        void label;
        return { type, isField: true, desc, eval: evalFn };
    }

    // -----------------------------------------------------------------------
    // Operators
    // -----------------------------------------------------------------------

    private resolveUnary(expr: Span & { op: "!" | "-" | "~"; expr: Expr }): RNode {
        const inner = this.resolve(expr.expr);
        if (expr.op === "!") {
            return { type: "bool", eval: (ctx) => !isTruthy(inner.eval(ctx)) };
        }
        if (!isNumericType(inner.type)) {
            this.error(`运算符 "${expr.op}" 需要数字操作数`, expr);
        }
        if (expr.op === "-") {
            return {
                type: inner.type === "bigint" ? "bigint" : "number",
                eval: (ctx) => {
                    const value = inner.eval(ctx);
                    if (typeof value === "bigint") return -value;
                    if (typeof value === "number") return -value;
                    return undefined;
                },
            };
        }
        return {
            type: inner.type === "bigint" ? "bigint" : "number",
            eval: (ctx) => arith("~", inner.eval(ctx), 0),
        };
    }

    private resolveBinary(expr: Span & { op: string; lhs: Expr; rhs: Expr }): RNode {
        const op = expr.op;

        if (op === "&&" || op === "||") {
            const lhs = this.resolve(expr.lhs);
            const rhs = this.resolve(expr.rhs);
            if (op === "&&") {
                return { type: "bool", eval: (ctx) => isTruthy(lhs.eval(ctx)) && isTruthy(rhs.eval(ctx)) };
            }
            return { type: "bool", eval: (ctx) => isTruthy(lhs.eval(ctx)) || isTruthy(rhs.eval(ctx)) };
        }

        const lhs = this.resolve(expr.lhs);
        const rhs = this.resolveOperand(expr.rhs, lhs.desc);
        this.checkCompat(expr, lhs, rhs);

        if (isArithmetic(op)) {
            return {
                type: lhs.type === "bigint" || rhs.type === "bigint" ? "bigint" : "number",
                eval: (ctx) => arith(op, lhs.eval(ctx), rhs.eval(ctx)),
            };
        }

        if (op === "matches" && expr.rhs.k === "str" && compileRegex(expr.rhs.value) === null) {
            this.error(`无效的正则表达式 ${JSON.stringify(expr.rhs.value)}`, expr.rhs);
        }

        return {
            type: "bool",
            eval: (ctx) => compareValues(lhs.eval(ctx), rhs.eval(ctx), op),
        };
    }

    private resolveOperand(expr: Expr, desc: FieldDesc | undefined): RNode {
        if (desc && (expr.k === "ident" || expr.k === "str")) {
            return this.resolve(expr, desc);
        }
        return this.resolve(expr);
    }

    private checkCompat(expr: Span & { op: string; lhs: Expr; rhs: Expr }, lhs: RNode, rhs: RNode): void {
        const op = expr.op;

        if (op === "contains" || op === "matches" || op === "startswith" || op === "endswith") {
            const okL = lhs.type === "string" || lhs.type === "bytes" || lhs.type === "any";
            const okR = rhs.type === "string" || rhs.type === "bytes" || rhs.type === "any";
            if (!okL || !okR) {
                this.error(`运算符 "${op}" 需要字符串操作数`, expr);
            }
            return;
        }

        if (isArithmetic(op)) {
            if (!isNumericType(lhs.type) || !isNumericType(rhs.type)) {
                this.error(`运算符 "${op}" 需要数字操作数`, expr);
            }
            return;
        }

        if (op === "==" || op === "!=") {
            if (isComparable(lhs.type, rhs.type)) return;
            this.error(`无法比较 ${describeType(lhs.type)} 和 ${describeType(rhs.type)}`, expr);
            return;
        }

        if (!isNumericType(lhs.type) || !isNumericType(rhs.type)) {
            this.error(`运算符 "${op}" 需要数字操作数`, expr);
        }
    }

    private resolveIn(expr: Span & { lhs: Expr; items: Expr[]; negate: boolean }): RNode {
        const lhs = this.resolve(expr.lhs);
        const items = expr.items.map((item) => this.resolveOperand(item, lhs.desc));
        for (const item of items) {
            if (!isComparable(lhs.type, item.type)) {
                this.error(`集合元素类型 ${describeType(item.type)} 与 ${describeType(lhs.type)} 不匹配`, expr);
                break;
            }
        }
        return {
            type: "bool",
            eval: (ctx) => {
                const value = lhs.eval(ctx);
                if (value === undefined) return false;
                const matched = items.some((item) => looseEq(value, item.eval(ctx)));
                return expr.negate ? !matched : matched;
            },
        };
    }

    private resolveCall(expr: Span & { name: string; args: Expr[] }): RNode {
        if (expr.name === "has") {
            if (expr.args.length !== 1) {
                this.error("has() 需要 1 个参数", expr);
                return constNode(undefined, "any");
            }
            const arg = this.resolve(expr.args[0]);
            if (!arg.isField) {
                this.error("has() 的参数必须是字段引用", expr.args[0]);
            }
            return { type: "bool", eval: (ctx) => arg.eval(ctx) !== undefined };
        }
        this.error(`未知函数 "${expr.name}"`, expr);
        return constNode(undefined, "any");
    }

    compile(): { node: RNode; expr: Expr; diagnostics: Diagnostic[] } {
        const expr = parseFilter(this.source);
        const node = this.resolve(expr);
        return { node, expr, diagnostics: this.diagnostics };
    }
}

function fieldValueType(field: FieldInfo): ValueType {
    switch (field.kind) {
        case "number":
        case "enum":
        case "float":
            return "number";
        case "bigint":
            return "bigint";
        case "bool":
            return "bool";
        case "string":
            return "string";
        default:
            return "bytes";
    }
}

function isNumericType(type: ValueType): boolean {
    return type === "number" || type === "bigint" || type === "float" || type === "any";
}

function isComparable(a: ValueType, b: ValueType): boolean {
    if (a === "any" || b === "any") return true;
    if (isNumericType(a) && isNumericType(b)) return true;
    if (a === "bytes" && (isNumericType(b) || b === "bytes")) return true;
    if (b === "bytes" && isNumericType(a)) return true;
    if (a === "string" && b === "string") return true;
    if (a === "bool" && b === "bool") return true;
    return false;
}

function describeType(type: ValueType): string {
    switch (type) {
        case "number": return "数字";
        case "bigint": return "整数";
        case "float": return "浮点数";
        case "string": return "字符串";
        case "bool": return "布尔值";
        case "bytes": return "字节序列";
        default: return "未知类型";
    }
}

function isArithmetic(op: string): boolean {
    return op === "+" || op === "-" || op === "*" || op === "/" || op === "%" || op === "&" || op === "|" || op === "^";
}

function parseNumericString(value: string): number | bigint | null {
    const text = value.trim();
    if (/^[+-]?0[xX][0-9a-fA-F]+$/.test(text)) {
        const negative = text.startsWith("-");
        const digits = text.replace(/^[+-]/, "");
        const big = BigInt(digits);
        const signed = negative ? -big : big;
        return signed <= 9007199254740991n && signed >= -9007199254740991n ? Number(signed) : signed;
    }
    if (/^[+-]?\d+$/.test(text)) {
        const big = BigInt(text);
        return big <= 9007199254740991n && big >= -9007199254740991n ? Number(big) : big;
    }
    return null;
}

// ---------------------------------------------------------------------------
// Opcode fast pre-filter
// ---------------------------------------------------------------------------

function collectOpcodes(expr: Expr, symbols: FilterSymbols): Set<number> | null {
    switch (expr.k) {
        case "num":
        case "str":
        case "bool":
            return null;
        case "ident": {
            const opcodes = symbols.opcodesOfType(expr.name);
            return opcodes ? new Set(opcodes) : null;
        }
        case "path": {
            if (PSEUDO_ROOTS.has(expr.root)) return null;
            const opcodes = symbols.opcodesOfType(expr.root);
            return opcodes ? new Set(opcodes) : null;
        }
        case "call": {
            let acc: Set<number> | null = null;
            for (const arg of expr.args) acc = union(acc, collectOpcodes(arg, symbols));
            return acc;
        }
        case "unary":
            // Negation can be satisfied by a packet that does not contain the type.
            return null;
        case "in": {
            if (expr.negate) {
                let acc = collectPresence(expr.lhs, symbols);
                for (const item of expr.items) acc = union(acc, collectPresence(item, symbols));
                return acc;
            }
            let acc = collectOpcodes(expr.lhs, symbols);
            for (const item of expr.items) acc = union(acc, collectOpcodes(item, symbols));
            return acc;
        }
        case "binary": {
            if (expr.op === "&&") {
                let acc = collectOpcodes(expr.lhs, symbols);
                acc = union(acc, collectOpcodes(expr.rhs, symbols));
                return acc;
            }
            if (expr.op === "!=" ) {
                // A field reference still has to exist for `!=` to be true, but a
                // pseudo field / type name does not constrain the opcode.
                return union(collectPresence(expr.lhs, symbols), collectPresence(expr.rhs, symbols));
            }
            const left = collectOpcodes(expr.lhs, symbols);
            const right = collectOpcodes(expr.rhs, symbols);
            if (expr.op === "||") {
                if (!left || !right) return null;
                return union(left, right);
            }
            return union(left, right);
        }
    }
}

/** Opcodes that are only required because a real IPC field must be present. */
function collectPresence(expr: Expr, symbols: FilterSymbols): Set<number> | null {
    if (expr.k === "path" && !PSEUDO_ROOTS.has(expr.root)) {
        return collectOpcodes(expr, symbols);
    }
    return null;
}

function union(a: Set<number> | null, b: Set<number> | null): Set<number> | null {
    if (!a) return b;
    if (!b) return a;
    for (const value of b) a.add(value);
    return a;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const OPCODE_LIST = /^\s*[\w$]+(\s*,\s*[\w$]+)*\s*$/;

export function compileFilter(source: string, symbols: FilterSymbols): CompiledFilter {
    const text = source.trim();

    if (text === "") {
        return {
            source,
            empty: true,
            valid: true,
            predicate: () => true,
            opcodes: null,
            diagnostics: [],
        };
    }

    const tokens = text.split(",").map((t) => t.trim()).filter(Boolean);
    const looksLikeOpcodeList =
        (text.includes(",") && OPCODE_LIST.test(text)) ||
        (tokens.length === 1 && /^(0[xX][0-9a-fA-F]+|\d+)$/.test(tokens[0]));

    if (looksLikeOpcodeList) {
        const opcodes: number[] = [];
        const diagnostics: Diagnostic[] = [];
        for (const token of tokens) {
            const opcode = parseOpcodeToken(token, symbols);
            if (opcode === undefined) {
                diagnostics.push({
                    message: `无法解析 opcode "${token}"`,
                    start: text.indexOf(token),
                    end: text.indexOf(token) + token.length,
                    severity: "error",
                });
            } else if (!opcodes.includes(opcode)) {
                opcodes.push(opcode);
            }
        }
        const valid = diagnostics.every((d) => d.severity !== "error");
        const set = new Set(opcodes);
        return {
            source,
            empty: false,
            valid,
            predicate: (packet) => set.has(packet.opcode),
            opcodes,
            diagnostics,
        };
    }

    try {
        const compiler = new Compiler(symbols, text);
        const { node, expr, diagnostics } = compiler.compile();
        const valid = diagnostics.every((d) => d.severity !== "error");
        const opcodeSet = valid ? collectOpcodes(expr, symbols) : null;
        return {
            source,
            empty: false,
            valid,
            predicate: valid
                ? (packet) => isTruthy(node.eval(packetCtx(packet, symbols)))
                : () => true,
            opcodes: opcodeSet ? [...opcodeSet] : null,
            diagnostics,
        };
    } catch (err) {
        if (err instanceof FilterSyntaxError) {
            return {
                source,
                empty: false,
                valid: false,
                predicate: () => true,
                opcodes: null,
                diagnostics: [
                    { message: err.message, start: err.span.start, end: err.span.end, severity: "error" },
                ],
            };
        }
        throw err;
    }
}

function parseOpcodeToken(token: string, symbols: FilterSymbols): number | undefined {
    if (/^0[xX][0-9a-fA-F]+$/.test(token)) return parseInt(token.slice(2), 16);
    if (/^\d+$/.test(token)) return parseInt(token, 10);
    const resolved = symbols.opcodeOfType(token);
    return resolved?.opcode;
}
