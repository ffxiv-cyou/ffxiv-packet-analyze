import type { Packet } from "overlay-toolkit";
import type { FieldInfo, FilterSymbols, StructInfo } from "./symbols";

export type ValueType = "number" | "bigint" | "float" | "bool" | "string" | "bytes" | "any";

export type FilterValue = number | bigint | boolean | string | Uint8Array | undefined;

/** Context describing the left hand side of a comparison, used to resolve symbols. */
export interface FieldDesc {
    label: string;
    valueType: ValueType;
    /** enum / extra-enum symbols -> numeric value */
    enumSymbols?: Map<string, number>;
    /** name database reverse lookup (name -> id) */
    dbLookup?: Map<string, number>;
    /** names in `dbLookup` that map to more than one id */
    dbAmbiguous?: Set<string>;
    /** additional string symbols, e.g. packet.dir */
    stringSymbols?: Map<string, string>;
    /** resolve bare identifiers as IPC type names (for `ipc.name == X`) */
    ipcTypeNames?: boolean;
    /** resolve bare identifiers as opcodes (for `opcode == X`) */
    opcodeTypeNames?: boolean;
}

export interface RNode {
    type: ValueType;
    desc?: FieldDesc;
    /** true for nodes that read a field/pseudo field (usable with has()) */
    isField?: boolean;
    eval: (ctx: PacketCtx) => FilterValue;
}

export interface PacketCtx {
    packet: Packet;
    /** full packet view */
    dw: DataView;
    /** view after the 32 byte IPC header */
    ipcDw: DataView;
    ipcName: string | null;
    struct: StructInfo | null;
    source: number | undefined;
    target: number | undefined;
    self: boolean;
}

const EMPTY = new ArrayBuffer(0);

interface CachedCtx {
    symbols: FilterSymbols;
    ctx: PacketCtx;
}

const ctxCache = new WeakMap<Packet, CachedCtx>();

export function packetCtx(packet: Packet, symbols: FilterSymbols): PacketCtx {
    const cached = ctxCache.get(packet);
    if (cached && cached.symbols === symbols) return cached.ctx;

    const dw = new DataView(packet.data.buffer, packet.data.byteOffset, packet.data.byteLength);
    const ipcDw =
        packet.data.byteLength > 32
            ? new DataView(packet.data.buffer, packet.data.byteOffset + 32, packet.data.byteLength - 32)
            : new DataView(EMPTY);

    const ipcName = symbols.opcodeName(packet.opcode, packet.dir) ?? null;
    const struct = ipcName ? symbols.struct(ipcName) ?? null : null;

    const source = dw.byteLength >= 8 ? dw.getUint32(4, true) : undefined;
    const target = dw.byteLength >= 12 ? dw.getUint32(8, true) : undefined;
    const self = source !== undefined && target !== undefined && source === target;

    const ctx: PacketCtx = { packet, dw, ipcDw, ipcName, struct, source, target, self };
    ctxCache.set(packet, { symbols, ctx });
    return ctx;
}

export function readDiscriminator(ctx: PacketCtx, field: FieldInfo): number | undefined {
    return readUnsigned(ctx.ipcDw, field.offset, field.size);
}

function readUnsigned(dw: DataView, offset: number, size: number): number | undefined {
    if (offset < 0 || offset + size > dw.byteLength) return undefined;
    switch (size) {
        case 1: return dw.getUint8(offset);
        case 2: return dw.getUint16(offset, true);
        case 4: return dw.getUint32(offset, true);
        default: return undefined;
    }
}

/**
 * Read a field value. `offset` already includes every nested/array offset.
 */
export function readFieldValue(
    dw: DataView,
    offset: number,
    field: FieldInfo,
    elementIndex: number | null,
): FilterValue {
    if (offset < 0) return undefined;

    if (field.kind === "string") {
        if (elementIndex !== null) return readUnsigned(dw, offset, field.size);
        const length = field.arrayLength || field.size;
        if (offset + length > dw.byteLength) return undefined;
        return decodeString(dw, offset, length);
    }

    if (field.kind === "bytes" || field.kind === "struct") {
        const length = elementIndex !== null ? field.size : (field.arrayLength || 1) * field.size;
        if (offset + length > dw.byteLength) return undefined;
        return new Uint8Array(dw.buffer, dw.byteOffset + offset, length);
    }

    const size = field.size;
    if (offset + size > dw.byteLength) return undefined;

    switch (field.kind) {
        case "number":
        case "enum": {
            switch (size) {
                case 1: return field.signed ? dw.getInt8(offset) : dw.getUint8(offset);
                case 2: return field.signed ? dw.getInt16(offset, true) : dw.getUint16(offset, true);
                case 4: return field.signed ? dw.getInt32(offset, true) : dw.getUint32(offset, true);
                default: return undefined;
            }
        }
        case "bigint":
            if (size !== 8) return undefined;
            return field.signed ? dw.getBigInt64(offset, true) : dw.getBigUint64(offset, true);
        case "float":
            if (size === 4) return dw.getFloat32(offset, true);
            if (size === 8) return dw.getFloat64(offset, true);
            return undefined;
        case "bool":
            return dw.getUint8(offset) !== 0;
        default:
            return undefined;
    }
}

function decodeString(dw: DataView, offset: number, length: number): string {
    let end = offset;
    const limit = offset + length;
    while (end < limit && dw.getUint8(end) !== 0) end++;
    const bytes = new Uint8Array(dw.buffer, dw.byteOffset + offset, end - offset);
    return new TextDecoder().decode(bytes);
}

// ---------------------------------------------------------------------------
// Value semantics
// ---------------------------------------------------------------------------

export function constNode(value: FilterValue, type: ValueType): RNode {
    return { type, eval: () => value };
}

export function isTruthy(value: FilterValue): boolean {
    if (value === undefined) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
    if (typeof value === "bigint") return value !== 0n;
    if (typeof value === "string") return value.length > 0;
    return value.length > 0;
}

export function bytesToLE(bytes: Uint8Array): number | bigint {
    let acc = 0n;
    for (let i = bytes.length - 1; i >= 0; i--) {
        acc = (acc << 8n) | BigInt(bytes[i]);
    }
    return acc <= 9007199254740991n ? Number(acc) : acc;
}

function asNumberish(value: FilterValue): number | bigint | null {
    if (typeof value === "number" || typeof value === "bigint") return value;
    if (value instanceof Uint8Array) return bytesToLE(value);
    return null;
}

function cmpNumeric(a: number | bigint, b: number | bigint): number {
    if (typeof a === "bigint" && typeof b === "bigint") {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    if (typeof a === "bigint") {
        if (Number.isInteger(b)) {
            const bi = BigInt(b);
            return a < bi ? -1 : a > bi ? 1 : 0;
        }
        const an = Number(a);
        return an < (b as number) ? -1 : an > (b as number) ? 1 : 0;
    }
    if (typeof b === "bigint") {
        if (Number.isInteger(a)) {
            const bi = BigInt(a);
            return bi < b ? -1 : bi > b ? 1 : 0;
        }
        const bn = Number(b);
        return a < bn ? -1 : a > bn ? 1 : 0;
    }
    return a < b ? -1 : a > b ? 1 : 0;
}

export function looseEq(l: FilterValue, r: FilterValue): boolean {
    if (l === undefined || r === undefined) return false;
    if (typeof l === "string" || typeof r === "string") {
        return typeof l === "string" && typeof r === "string" && l === r;
    }
    if (typeof l === "boolean" || typeof r === "boolean") {
        return typeof l === "boolean" && typeof r === "boolean" && l === r;
    }
    const a = asNumberish(l);
    const b = asNumberish(r);
    if (a === null || b === null) return false;
    return cmpNumeric(a, b) === 0;
}

const regexCache = new Map<string, RegExp>();

export function compileRegex(source: string): RegExp | null {
    const cached = regexCache.get(source);
    if (cached) return cached;
    try {
        const regex = new RegExp(source);
        regexCache.set(source, regex);
        return regex;
    } catch {
        return null;
    }
}

function bytesContains(haystack: Uint8Array, needle: Uint8Array): boolean {
    if (needle.length === 0) return true;
    outer: for (let i = 0; i + needle.length <= haystack.length; i++) {
        for (let j = 0; j < needle.length; j++) {
            if (haystack[i + j] !== needle[j]) continue outer;
        }
        return true;
    }
    return false;
}

export function compareValues(l: FilterValue, r: FilterValue, op: string): boolean {
    // A missing value never satisfies a comparison, not even `!=`.
    if (l === undefined || r === undefined) return false;

    switch (op) {
        case "==":
            return looseEq(l, r);
        case "!=":
            return !looseEq(l, r);
        case "contains":
            if (typeof l === "string" && typeof r === "string") return l.includes(r);
            if (l instanceof Uint8Array && r instanceof Uint8Array) return bytesContains(l, r);
            return false;
        case "startswith":
            return typeof l === "string" && typeof r === "string" && l.startsWith(r);
        case "endswith":
            return typeof l === "string" && typeof r === "string" && l.endsWith(r);
        case "matches": {
            if (typeof l !== "string" || typeof r !== "string") return false;
            const regex = compileRegex(r);
            return regex ? regex.test(l) : false;
        }
        case ">":
        case ">=":
        case "<":
        case "<=": {
            const a = asNumberish(l);
            const b = asNumberish(r);
            if (a === null || b === null) return false;
            const cmp = cmpNumeric(a, b);
            if (op === ">") return cmp > 0;
            if (op === ">=") return cmp >= 0;
            if (op === "<") return cmp < 0;
            return cmp <= 0;
        }
        default:
            return false;
    }
}

export function arith(op: string, l: FilterValue, r: FilterValue): FilterValue {
    if (l === undefined || r === undefined) return undefined;

    if (op === "~") {
        const v = asNumberish(l);
        if (v === null) return undefined;
        return typeof v === "bigint" ? ~v : ~v;
    }
    if (op === "-" && r === undefined) return undefined;

    const a = asNumberish(l);
    const b = asNumberish(r);
    if (a === null || b === null) return undefined;

    const useBigInt = typeof a === "bigint" || typeof b === "bigint";
    if (op === "+" || op === "-" || op === "*" || op === "/" || op === "%") {
        if (useBigInt) {
            if (!Number.isInteger(Number(a)) || !Number.isInteger(Number(b))) {
                return Number(a) + (op === "-" ? -Number(b) : Number(b));
            }
            const x = BigInt(a);
            const y = BigInt(b);
            switch (op) {
                case "+": return x + y;
                case "-": return x - y;
                case "*": return x * y;
                case "/": return y === 0n ? undefined : x / y;
                case "%": return y === 0n ? undefined : x % y;
            }
        }
        const x = Number(a);
        const y = Number(b);
        switch (op) {
            case "+": return x + y;
            case "-": return x - y;
            case "*": return x * y;
            case "/": return x / y;
            case "%": return x % y;
        }
    }

    if (op === "&" || op === "|" || op === "^") {
        if (useBigInt) {
            const x = BigInt(a);
            const y = BigInt(b);
            if (op === "&") return x & y;
            if (op === "|") return x | y;
            return x ^ y;
        }
        const x = Number(a) | 0;
        const y = Number(b) | 0;
        if (op === "&") return x & y;
        if (op === "|") return x | y;
        return x ^ y;
    }

    return undefined;
}
