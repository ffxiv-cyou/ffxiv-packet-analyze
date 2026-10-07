import { span, type BinOp, type Expr, type PathPart } from "./ast";
import { FilterSyntaxError, isKeyword, tokenize, type Token } from "./lexer";

const CMP_OPS = new Set(["==", "!=", ">", ">=", "<", "<="]);
const WORD_OPS = new Set(["contains", "matches", "startswith", "endswith"]);

class Parser {
    private tokens: Token[];
    private pos = 0;

    constructor(source: string) {
        this.tokens = tokenize(source);
    }

    parse(): Expr {
        const expr = this.parseOr();
        const tok = this.peek();
        if (tok.type !== "eof") {
            throw new FilterSyntaxError(`多余的内容 "${tok.value}"`, span(tok.start, tok.end));
        }
        return expr;
    }

    private peek(offset = 0): Token {
        return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)];
    }

    private next(): Token {
        const tok = this.tokens[this.pos];
        if (tok.type !== "eof") this.pos++;
        return tok;
    }

    private matchOp(...ops: string[]): Token | null {
        const tok = this.peek();
        if (tok.type === "op" && ops.includes(tok.value)) {
            this.pos++;
            return tok;
        }
        return null;
    }

    private expectOp(op: string): Token {
        const tok = this.peek();
        if (tok.type !== "op" || tok.value !== op) {
            throw new FilterSyntaxError(
                `期望 "${op}"，实际是 ${describe(tok)}`,
                span(tok.start, tok.end),
            );
        }
        this.pos++;
        return tok;
    }

    private parseOr(): Expr {
        let lhs = this.parseAnd();
        while (this.matchOp("||") || this.matchKeyword("or")) {
            const rhs = this.parseAnd();
            lhs = { k: "binary", op: "||", lhs, rhs, start: lhs.start, end: rhs.end };
        }
        return lhs;
    }

    private parseAnd(): Expr {
        let lhs = this.parseNot();
        while (this.matchOp("&&") || this.matchKeyword("and")) {
            const rhs = this.parseNot();
            lhs = { k: "binary", op: "&&", lhs, rhs, start: lhs.start, end: rhs.end };
        }
        return lhs;
    }

    private matchKeyword(keyword: string): boolean {
        if (isKeyword(this.peek(), keyword)) {
            this.pos++;
            return true;
        }
        return false;
    }

    private parseNot(): Expr {
        if (this.matchOp("!")) {
            const expr = this.parseNot();
            return { k: "unary", op: "!", expr, start: expr.start, end: expr.end };
        }
        if (isKeyword(this.peek(), "not")) {
            const notTok = this.next();
            const expr = this.parseNot();
            return { k: "unary", op: "!", expr, start: notTok.start, end: expr.end };
        }
        return this.parseCmp();
    }

    private parseCmp(): Expr {
        const lhs = this.parseBit();

        const tok = this.peek();
        if (tok.type === "op" && CMP_OPS.has(tok.value)) {
            this.pos++;
            const rhs = this.parseBit();
            return { k: "binary", op: tok.value as BinOp, lhs, rhs, start: lhs.start, end: rhs.end };
        }
        if (tok.type === "ident" && WORD_OPS.has(tok.value)) {
            this.pos++;
            const rhs = this.parseBit();
            return { k: "binary", op: tok.value as BinOp, lhs, rhs, start: lhs.start, end: rhs.end };
        }
        if (isKeyword(tok, "in")) {
            this.pos++;
            return this.parseSet(lhs, false);
        }
        if (isKeyword(tok, "not") && isKeyword(this.peek(1), "in")) {
            this.pos += 2;
            return this.parseSet(lhs, true);
        }
        return lhs;
    }

    private parseSet(lhs: Expr, negate: boolean): Expr {
        this.expectOp("{");
        const items: Expr[] = [];
        if (!this.matchOp("}")) {
            for (;;) {
                items.push(this.parseOr());
                if (this.matchOp(",")) {
                    if (this.matchOp("}")) break;
                    continue;
                }
                this.expectOp("}");
                break;
            }
        }
        if (items.length === 0) {
            throw new FilterSyntaxError("集合不能为空", span(lhs.start, lhs.end));
        }
        const end = this.tokens[Math.max(0, this.pos - 1)];
        return { k: "in", lhs, items, negate, start: lhs.start, end: end.end };
    }

    private parseBit(): Expr {
        let lhs = this.parseAdd();
        for (;;) {
            const tok = this.matchOp("|", "^", "&");
            if (!tok) break;
            const rhs = this.parseAdd();
            lhs = { k: "binary", op: tok.value as BinOp, lhs, rhs, start: lhs.start, end: rhs.end };
        }
        return lhs;
    }

    private parseAdd(): Expr {
        let lhs = this.parseMul();
        for (;;) {
            const tok = this.matchOp("+", "-");
            if (!tok) break;
            const rhs = this.parseMul();
            lhs = { k: "binary", op: tok.value as BinOp, lhs, rhs, start: lhs.start, end: rhs.end };
        }
        return lhs;
    }

    private parseMul(): Expr {
        let lhs = this.parseUnary();
        for (;;) {
            const tok = this.matchOp("*", "/", "%");
            if (!tok) break;
            const rhs = this.parseUnary();
            lhs = { k: "binary", op: tok.value as BinOp, lhs, rhs, start: lhs.start, end: rhs.end };
        }
        return lhs;
    }

    private parseUnary(): Expr {
        const tok = this.matchOp("-", "~");
        if (tok) {
            const expr = this.parseUnary();
            return { k: "unary", op: tok.value as "-" | "~", expr, start: tok.start, end: expr.end };
        }
        return this.parsePrimary();
    }

    private parsePrimary(): Expr {
        const tok = this.peek();

        if (tok.type === "num") {
            this.pos++;
            return { k: "num", value: tok.num!, raw: tok.value, start: tok.start, end: tok.end };
        }

        if (tok.type === "str") {
            this.pos++;
            return { k: "str", value: tok.value, start: tok.start, end: tok.end };
        }

        if (tok.type === "ident") {
            if (tok.value === "true" || tok.value === "false") {
                this.pos++;
                return { k: "bool", value: tok.value === "true", start: tok.start, end: tok.end };
            }

            // Function call.
            if (this.peek(1).type === "op" && this.peek(1).value === "(") {
                this.pos += 2;
                const args: Expr[] = [];
                if (!this.matchOp(")")) {
                    for (;;) {
                        args.push(this.parseOr());
                        if (this.matchOp(",")) continue;
                        this.expectOp(")");
                        break;
                    }
                }
                const end = this.tokens[this.pos - 1];
                return { k: "call", name: tok.value, args, start: tok.start, end: end.end };
            }

            this.pos++;
            return this.parsePath(tok);
        }

        if (tok.type === "op" && tok.value === "(") {
            this.pos++;
            const expr = this.parseOr();
            const close = this.expectOp(")");
            return { ...expr, start: tok.start, end: close.end };
        }

        throw new FilterSyntaxError(`无法解析 ${describe(tok)}`, span(tok.start, tok.end));
    }

    private parsePath(first: Token): Expr {
        const parts: PathPart[] = [
            { name: first.value, start: first.start, end: first.end },
        ];

        for (;;) {
            if (this.matchOp("[")) {
                const idx = this.expectIndex();
                if (this.matchOp(":")) {
                    const end = this.expectIndex();
                    const close = this.expectOp("]");
                    parts[parts.length - 1].slice = [idx, end];
                    parts[parts.length - 1].end = close.end;
                } else {
                    const close = this.expectOp("]");
                    parts[parts.length - 1].index = idx;
                    parts[parts.length - 1].end = close.end;
                }
                continue;
            }
            if (this.matchOp(".")) {
                const nameTok = this.peek();
                if (nameTok.type !== "ident") {
                    throw new FilterSyntaxError(
                        `"${"."}" 之后需要字段名，实际是 ${describe(nameTok)}`,
                        span(nameTok.start, nameTok.end),
                    );
                }
                this.pos++;
                parts.push({ name: nameTok.value, start: nameTok.start, end: nameTok.end });
                continue;
            }
            break;
        }

        const last = parts[parts.length - 1];
        if (parts.length === 1 && last.index === undefined && last.slice === undefined) {
            return { k: "ident", name: first.value, start: first.start, end: last.end };
        }
        return { k: "path", root: parts[0].name, parts, start: first.start, end: last.end };
    }

    private expectIndex(): number {
        const tok = this.peek();
        if (tok.type !== "num" || typeof tok.num !== "number" || !Number.isInteger(tok.num)) {
            throw new FilterSyntaxError(
                `数组下标必须是整数，实际是 ${describe(tok)}`,
                span(tok.start, tok.end),
            );
        }
        this.pos++;
        return tok.num;
    }
}

function describe(tok: Token): string {
    if (tok.type === "eof") return "表达式结束";
    return `"${tok.value}"`;
}

export function parseFilter(source: string): Expr {
    return new Parser(source).parse();
}
