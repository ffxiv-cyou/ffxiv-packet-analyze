import type { FieldDesc, ValueType } from "./runtime";
import { FilterSymbols, resolveFieldPath, type FieldInfo, type StructInfo } from "./symbols";

export interface Completion {
    label: string;
    detail?: string;
    /** Text that replaces the current token. */
    insert: string;
}

export interface CompletionResult {
    items: Completion[];
    start: number;
    end: number;
}

const TOKEN_TAIL = /([\p{L}\p{N}_$]*)$/u;
const PATH_TAIL = /([\p{L}_$][\p{L}\p{N}_$]*(?:\.[\p{L}\p{N}_$]+|\[\d+\])*)$/u;
const COMPARE_TAIL = /(==|!=|>=|<=|>|<|matches|contains|startswith|endswith|in)\s*$/;

const PSEUDO_FIELDS: Record<string, string[]> = {
    packet: ["opcode", "dir", "len", "length", "epoch", "conn", "self"],
    hdr: ["src", "source", "sourceActor", "dst", "target", "targetActor"],
    ipc: ["name"],
};

const MAX_ITEMS = 40;

const DIR_SYMBOLS = new Map<string, string>([
    ["c", "c"],
    ["client", "c"],
    ["s", "s"],
    ["server", "s"],
]);

export function complete(
    text: string,
    caret: number,
    symbols: FilterSymbols | null,
): CompletionResult | null {
    if (!symbols) return null;

    const head = text.slice(0, Math.max(0, Math.min(caret, text.length)));
    const tokenMatch = TOKEN_TAIL.exec(head);
    const token = tokenMatch ? tokenMatch[1] : "";
    const start = head.length - token.length;
    const before = head.slice(0, start).replace(/\s+$/, "");

    // `... .` -> field / sub type names of the preceding path
    if (before.endsWith(".")) {
        const parentText = before.slice(0, -1);
        const parentMatch = PATH_TAIL.exec(parentText);
        if (!parentMatch) return null;
        const parts = parsePathParts(parentMatch[1]);
        if (parts.length === 0) return null;

        if (parts.length === 1 && PSEUDO_FIELDS[parts[0].name]) {
            const names = PSEUDO_FIELDS[parts[0].name];
            return makeResult(names.map((name) => ({ label: name, insert: name })), token, start, caret);
        }

        const struct = resolveStructForParts(symbols, parts);
        if (!struct) return null;
        const items = symbols.memberNames(struct).map((name) => {
            const field = struct.fields.get(name);
            return field
                ? { label: name, detail: describeField(field), insert: name }
                : { label: name, detail: "子类型", insert: name };
        });
        return makeResult(items, token, start, caret);
    }

    // `<lhs> ==` / `... in` -> enum symbols / localized names
    const opMatch = COMPARE_TAIL.exec(before);
    if (opMatch) {
        const lhsText = before.slice(0, opMatch.index).replace(/\s+$/, "");
        const lhsMatch = PATH_TAIL.exec(lhsText);
        if (!lhsMatch) return null;
        const parts = parsePathParts(lhsMatch[1]);
        const desc = fieldDescFor(symbols, parts);
        if (!desc) return null;
        return makeResult(valueCompletions(symbols, desc), token, start, caret);
    }

    // Root position: pseudo roots + IPC types + has()
    if (token.length === 0) return null;
    const items: Completion[] = [
        { label: "packet.", detail: "包头字段", insert: "packet." },
        { label: "hdr.", detail: "32 字节头", insert: "hdr." },
        { label: "ipc.", detail: "IPC 类型", insert: "ipc." },
        { label: "data[", detail: "原始字节", insert: "data[" },
        { label: "payload[", detail: "去掉头的字节", insert: "payload[" },
        { label: "has()", detail: "字段存在性", insert: "has()" },
    ];
    for (const name of symbols.typeNames()) {
        items.push({ label: name, detail: "IPC 类型", insert: name });
    }
    return makeResult(items, token, start, caret);
}

function valueCompletions(symbols: FilterSymbols, desc: FieldDesc): Completion[] {
    const items: Completion[] = [];
    const seen = new Set<string>();

    const push = (name: string, detail: string) => {
        if (seen.has(name)) return;
        seen.add(name);
        items.push({ label: name, detail, insert: name });
    };

    if (desc.enumSymbols) {
        const numeric = [...desc.enumSymbols.entries()].sort((a, b) => a[1] - b[1]);
        for (const [name, value] of numeric) push(name, String(value));
    }
    if (desc.stringSymbols) {
        for (const name of desc.stringSymbols.keys()) push(name, "字符串");
    }
    if (desc.dbLookup) {
        for (const name of desc.dbLookup.keys()) push(name, "名称");
    }
    if (desc.opcodeTypeNames) {
        for (const name of symbols.typeNames()) {
            if (symbols.opcodeOfType(name)) push(name, "IPC 类型");
        }
    } else if (desc.ipcTypeNames) {
        for (const name of symbols.typeNames()) push(name, "IPC 类型");
    }
    return items;
}

function makeResult(
    items: Completion[],
    token: string,
    start: number,
    end: number,
): CompletionResult | null {
    const lower = token.toLowerCase();
    const filtered = items.filter((item) => item.label.toLowerCase().startsWith(lower));
    if (filtered.length === 0) return null;
    return { items: filtered.slice(0, MAX_ITEMS), start, end };
}

function parsePathParts(text: string): { name: string }[] {
    const parts: { name: string }[] = [];
    const re = /([\p{L}_$][\p{L}\p{N}_$]*)(?:\[(\d+)\])?/gu;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
        parts.push({ name: match[1] });
    }
    return parts;
}

function resolveStructForParts(
    symbols: FilterSymbols,
    parts: { name: string }[],
): StructInfo | null {
    const first = symbols.struct(parts[0].name);
    if (!first) return null;
    let struct: StructInfo = first;

    for (let i = 1; i < parts.length; i++) {
        const field: FieldInfo | undefined = struct.fields.get(parts[i].name);
        if (!field) {
            if (struct.discriminator?.enumValues.has(parts[i].name)) continue;
            return null;
        }
        if (i === parts.length - 1) {
            return field.kind === "struct" && field.struct ? field.struct : null;
        }
        if (field.kind !== "struct" || !field.struct) return null;
        struct = field.struct;
    }
    return struct;
}

function fieldDescFor(symbols: FilterSymbols, parts: { name: string }[]): FieldDesc | null {
    if (parts.length === 2) {
        const key = `${parts[0].name}.${parts[1].name}`;
        if (key === "packet.opcode") return { label: key, valueType: "number", opcodeTypeNames: true };
        if (key === "ipc.name") return { label: key, valueType: "string", ipcTypeNames: true };
        if (key === "packet.dir") return { label: key, valueType: "string", stringSymbols: DIR_SYMBOLS };
    }

    const resolved = resolveFieldPath(symbols, parts);
    if (!resolved) return null;

    const desc: FieldDesc = { label: "", valueType: valueTypeOf(resolved.field) };
    const aliasKey = symbols.aliasKey(resolved.owner.name, resolved.field.name, resolved.subtypeName);
    if (aliasKey) {
        const enumSymbols = symbols.symbolsForAliasKey(aliasKey);
        const dbLookup = symbols.dbForAliasKey(aliasKey);
        if (enumSymbols) desc.enumSymbols = enumSymbols;
        if (dbLookup) desc.dbLookup = dbLookup;
    } else if (resolved.field.enumValues) {
        desc.enumSymbols = resolved.field.enumValues;
    }
    return desc;
}

function valueTypeOf(field: FieldInfo): ValueType {
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

function describeField(field: FieldInfo): string {
    const base = field.type + (field.arrayLength ? `[${field.arrayLength}]` : "");
    return base;
}
