/** Character range inside the filter text, used for diagnostics. */
export interface Span {
    start: number;
    end: number;
}

export interface PathPart extends Span {
    name: string;
    /** Static array index, e.g. `member[0]`. */
    index?: number;
    /** Byte slice, e.g. `data[16:20]`. */
    slice?: [number, number];
}

export type BinOp =
    | "==" | "!=" | ">" | ">=" | "<" | "<="
    | "contains" | "matches" | "startswith" | "endswith"
    | "&&" | "||"
    | "&" | "|" | "^"
    | "+" | "-" | "*" | "/" | "%";

export type Expr =
    | (Span & { k: "num"; value: number | bigint; raw: string })
    | (Span & { k: "str"; value: string })
    | (Span & { k: "bool"; value: boolean })
    | (Span & { k: "ident"; name: string })
    | (Span & { k: "path"; root: string; parts: PathPart[] })
    | (Span & { k: "unary"; op: "!" | "-" | "~"; expr: Expr })
    | (Span & { k: "binary"; op: BinOp; lhs: Expr; rhs: Expr })
    | (Span & { k: "in"; lhs: Expr; items: Expr[]; negate: boolean })
    | (Span & { k: "call"; name: string; args: Expr[] });

export function span(start: number, end: number): Span {
    return { start, end };
}
