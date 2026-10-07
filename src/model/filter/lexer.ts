import { span, type Span } from "./ast";

export type TokenType = "num" | "str" | "ident" | "op" | "eof";

export interface Token extends Span {
    type: TokenType;
    value: string;
    num?: number | bigint;
}

export class FilterSyntaxError extends Error {
    span: Span;
    constructor(message: string, at: Span) {
        super(message);
        this.name = "FilterSyntaxError";
        this.span = at;
    }
}

const KEYWORDS = new Set([
    "and", "or", "not", "in", "contains", "matches", "startswith", "endswith",
    "true", "false",
]);

const MULTI_OPS = ["==", "!=", "<=", ">=", "&&", "||"];

const IDENT_START = /[\p{L}_$]/u;
const IDENT_PART = /[\p{L}\p{N}_$]/u;

function isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
}

export function tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    const push = (type: TokenType, value: string, start: number, num?: number | bigint) => {
        tokens.push({ type, value, start, end: i, num });
    };

    while (i < source.length) {
        const c = source[i];

        if (c === " " || c === "\t" || c === "\n" || c === "\r") {
            i++;
            continue;
        }

        // Line comment.
        if (c === "#" || (c === "/" && source[i + 1] === "/")) {
            while (i < source.length && source[i] !== "\n") i++;
            continue;
        }

        const start = i;

        if (c === '"' || c === "'") {
            const quote = c;
            i++;
            let value = "";
            let closed = false;
            while (i < source.length) {
                const ch = source[i];
                if (ch === "\\" && i + 1 < source.length) {
                    const next = source[i + 1];
                    switch (next) {
                        case "n": value += "\n"; break;
                        case "t": value += "\t"; break;
                        case "r": value += "\r"; break;
                        case "\\": value += "\\"; break;
                        case '"': value += '"'; break;
                        case "'": value += "'"; break;
                        default: value += next; break;
                    }
                    i += 2;
                    continue;
                }
                if (ch === quote) {
                    i++;
                    closed = true;
                    break;
                }
                value += ch;
                i++;
            }
            if (!closed) {
                throw new FilterSyntaxError("未闭合的字符串字面量", span(start, source.length));
            }
            push("str", value, start);
            continue;
        }

        if (isDigit(c) || (c === "." && isDigit(source[i + 1] ?? ""))) {
            let raw = "";
            let isFloat = false;
            if (c === "0" && (source[i + 1] === "x" || source[i + 1] === "X")) {
                raw = source.slice(i, i + 2);
                i += 2;
                while (i < source.length && /[0-9a-fA-F_]/.test(source[i])) raw += source[i++];
            } else if (c === "0" && (source[i + 1] === "b" || source[i + 1] === "B")) {
                raw = source.slice(i, i + 2);
                i += 2;
                while (i < source.length && /[01_]/.test(source[i])) raw += source[i++];
            } else {
                while (i < source.length && /[0-9_]/.test(source[i])) raw += source[i++];
                if (source[i] === "." && isDigit(source[i + 1] ?? "")) {
                    isFloat = true;
                    raw += source[i++];
                    while (i < source.length && /[0-9_]/.test(source[i])) raw += source[i++];
                } else if (source[i] === "." && !IDENT_START.test(source[i + 1] ?? "")) {
                    isFloat = true;
                    raw += source[i++];
                }
                if (source[i] === "e" || source[i] === "E") {
                    isFloat = true;
                    raw += source[i++];
                    if (source[i] === "+" || source[i] === "-") raw += source[i++];
                    while (i < source.length && isDigit(source[i])) raw += source[i++];
                }
            }

            const clean = raw.replace(/_/g, "");
            if (clean === "" || clean === "0x" || clean === "0b") {
                throw new FilterSyntaxError(`无效的数字字面量 "${raw}"`, span(start, i));
            }

            let num: number | bigint;
            if (isFloat) {
                num = Number(clean);
            } else {
                const bi = BigInt(clean);
                num = bi <= 9007199254740991n ? Number(bi) : bi;
            }
            if (typeof num === "number" && Number.isNaN(num)) {
                throw new FilterSyntaxError(`无效的数字字面量 "${raw}"`, span(start, i));
            }
            push("num", raw, start, num);
            continue;
        }

        if (IDENT_START.test(c)) {
            let name = "";
            while (i < source.length && IDENT_PART.test(source[i])) name += source[i++];
            push("ident", name, start);
            continue;
        }

        const two = source.slice(i, i + 2);
        if (MULTI_OPS.includes(two)) {
            i += 2;
            push("op", two, start);
            continue;
        }

        if ("(){}[],.:!<>=&|^~+-*/%".includes(c)) {
            i++;
            push("op", c, start);
            continue;
        }

        throw new FilterSyntaxError(`无法识别的字符 "${c}"`, span(start, start + 1));
    }

    tokens.push({ type: "eof", value: "", start: source.length, end: source.length });
    return tokens;
}

export function isKeyword(token: Token, keyword: string): boolean {
    return token.type === "ident" && token.value === keyword;
}

export { KEYWORDS };
