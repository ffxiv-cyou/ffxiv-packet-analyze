import type { IPCData, IPCStruct, IPCStructField } from "../ipc_struct";
import ipcAlias from "../../data/opcode_alias.json";
import { aliasKeyToDb, extraEnum, fieldAliasKey, keyMapping, subtypeKeys } from "./tables";

export type FieldKind =
    | "number"
    | "bigint"
    | "float"
    | "bool"
    | "enum"
    | "string"
    | "bytes"
    | "struct";

export interface FieldInfo {
    name: string;
    type: string;
    offset: number;
    size: number;
    arrayLength: number;
    kind: FieldKind;
    signed: boolean;
    struct?: StructInfo;
    enumValues?: Map<string, number>;
}

export interface DiscriminatorInfo {
    field: string;
    key: string;
    enumValues: Map<string, number>;
    info: FieldInfo;
}

export interface StructInfo {
    name: string;
    alias: string;
    size: number;
    fields: Map<string, FieldInfo>;
    discriminator?: DiscriminatorInfo;
}

export interface FilterSymbolInput {
    ipc: IPCData;
    db: Record<string, Record<string, string>>;
    opcodeNames: {
        client: Map<number, string>;
        server: Map<number, string>;
    };
}

function enumMap(source: { [key: string]: string | null }): Map<string, number> {
    const map = new Map<string, number>();
    for (const [value, name] of Object.entries(source)) {
        if (name != null) map.set(name, Number(value));
    }
    return map;
}

export class FilterSymbols {
    /** Struct lookup by canonical name, short name (ipcName) and alias. */
    readonly structs = new Map<string, StructInfo>();
    readonly enums = new Map<string, Map<string, number>>();
    readonly dbByName = new Map<string, Map<string, number>>();
    readonly dbAmbiguousByName = new Map<string, Set<string>>();
    /** Alias (ipcName) -> opcodes that can produce it. */
    readonly opcodeIndex = new Map<string, number[]>();
    readonly opcodeAmbiguous = new Set<string>();

    private readonly clientNames: Map<number, string>;
    private readonly serverNames: Map<number, string>;
    private readonly byCanonical = new Map<string, StructInfo>();
    private readonly opcodeNameToValue = new Map<string, number>();

    constructor(input: FilterSymbolInput) {
        this.clientNames = input.opcodeNames.client;
        this.serverNames = input.opcodeNames.server;

        const skeletons = new Map<string, StructInfo>();
        for (const raw of input.ipc.structs) {
            const info: StructInfo = {
                name: raw.name,
                alias: raw.ipcName ?? raw.name,
                size: raw.size,
                fields: new Map(),
            };
            skeletons.set(raw.name, info);
            this.byCanonical.set(raw.name, info);
            this.structs.set(raw.name, info);
            this.structs.set(info.alias, info);
        }

        const aliases = ipcAlias as Record<string, string>;
        for (const alias of Object.keys(aliases)) {
            const target = this.structs.get(aliases[alias]);
            if (target) this.structs.set(alias, target);
        }

        for (const raw of input.ipc.enums) {
            const map = new Map<string, number>();
            for (const [value, name] of Object.entries(raw.enum)) {
                if (name != null) map.set(name, Number(value));
            }
            this.enums.set(raw.name, map);
        }

        for (const raw of input.ipc.structs) {
            this.fillStruct(skeletons.get(raw.name)!, raw);
        }

        for (const [structName, fieldName] of Object.entries(subtypeKeys)) {
            const info = this.byCanonical.get(structName);
            if (!info) continue;
            const key = `${structName}.${fieldName}`;
            const mapped = keyMapping[key];
            const enumValues = mapped ? this.enumForName(mapped) : undefined;
            const field = info.fields.get(fieldName);
            if (enumValues && field) {
                info.discriminator = { field: fieldName, key, enumValues, info: field };
            }
        }

        for (const [category, entries] of Object.entries(input.db)) {
            const map = new Map<string, number>();
            const ambiguous = new Set<string>();
            for (const [id, name] of Object.entries(entries)) {
                if (!name) continue;
                if (map.has(name)) {
                    ambiguous.add(name);
                    const current = map.get(name)!;
                    if (Number(id) < current) map.set(name, Number(id));
                } else {
                    map.set(name, Number(id));
                }
            }
            this.dbByName.set(category, map);
            this.dbAmbiguousByName.set(category, ambiguous);
        }

        for (const names of [this.clientNames, this.serverNames]) {
            for (const [opcode, name] of names) {
                const existing = this.opcodeNameToValue.get(name);
                if (existing !== undefined && existing !== opcode) {
                    this.opcodeAmbiguous.add(name);
                } else {
                    this.opcodeNameToValue.set(name, opcode);
                }
                const list = this.opcodeIndex.get(name) ?? [];
                if (!list.includes(opcode)) list.push(opcode);
                this.opcodeIndex.set(name, list);
            }
        }
    }

    private enumForName(name: string): Map<string, number> | undefined {
        if (extraEnum[name]) return enumMap(extraEnum[name]);
        return this.enums.get(name);
    }

    private fillStruct(info: StructInfo, raw: IPCStruct): void {
        for (const rawField of raw.fields) {
            const field = this.makeField(rawField);
            info.fields.set(field.name, field);
        }
    }

    private makeField(raw: IPCStructField): FieldInfo {
        const arrayLength = raw.arrayLength ?? 0;
        const field: FieldInfo = {
            name: raw.name,
            type: raw.type,
            offset: raw.offset,
            size: raw.size,
            arrayLength,
            kind: "bytes",
            signed: false,
        };

        switch (raw.type) {
            case "uint8":
            case "uint16":
            case "uint32":
                field.kind = "number";
                break;
            case "int8":
            case "int16":
            case "int32":
                field.kind = "number";
                field.signed = true;
                break;
            case "uint64":
            case "int64":
                field.kind = "bigint";
                field.signed = raw.type === "int64";
                break;
            case "float":
            case "double":
                field.kind = "float";
                break;
            case "bool":
                field.kind = "bool";
                break;
            default: {
                const global = this.byCanonical.get(raw.type);
                if (raw.fields && raw.fields.length > 0) {
                    const inline: StructInfo = {
                        name: raw.type,
                        alias: raw.type,
                        size: raw.size,
                        fields: new Map(),
                    };
                    for (const sub of raw.fields) {
                        inline.fields.set(sub.name, this.makeField(sub));
                    }
                    field.kind = "struct";
                    field.struct = inline;
                } else if (global) {
                    field.kind = "struct";
                    field.struct = global;
                } else if (this.enums.has(raw.type)) {
                    field.kind = "enum";
                    field.enumValues = this.enums.get(raw.type);
                } else {
                    field.kind = "bytes";
                }
                break;
            }
        }

        const byteArray = raw.type === "int8" || raw.type === "uint8";
        if (byteArray && arrayLength > 1) {
            field.kind = /name$/i.test(raw.name) ? "string" : "bytes";
        }

        return field;
    }

    struct(name: string): StructInfo | undefined {
        return this.structs.get(name);
    }

    aliasKey(structName: string, fieldName: string, subtypeName: string = ""): string | null {
        return fieldAliasKey(structName, fieldName, subtypeName);
    }

    /** Enum/extra-enum symbol table for an alias key (e.g. "ActorControlType", "InventoryOperation"). */
    symbolsForAliasKey(aliasKey: string): Map<string, number> | undefined {
        return this.enumForName(aliasKey);
    }

    /** db.json reverse lookup table for an alias key (e.g. "ItemId" -> Item names). */
    dbForAliasKey(aliasKey: string): Map<string, number> | undefined {
        const category = aliasKeyToDb[aliasKey];
        if (!category) return undefined;
        return this.dbByName.get(category);
    }

    /** Names that map to more than one id for an alias key. */
    dbAmbiguousForAliasKey(aliasKey: string): Set<string> | undefined {
        const category = aliasKeyToDb[aliasKey];
        if (!category) return undefined;
        return this.dbAmbiguousByName.get(category);
    }

    opcodeName(opcode: number, dir: boolean): string | undefined {
        return dir ? this.clientNames.get(opcode) : this.serverNames.get(opcode);
    }

    /** Resolve an IPC type name to its (single) opcode, if unambiguous. */
    opcodeOfType(name: string): { opcode: number; ambiguous: boolean } | null {
        const struct = this.structs.get(name);
        const key = struct?.alias ?? name;
        const opcode = this.opcodeNameToValue.get(key);
        if (opcode === undefined) return null;
        return { opcode, ambiguous: this.opcodeAmbiguous.has(key) };
    }

    opcodesOfType(name: string): number[] | null {
        const struct = this.structs.get(name);
        const key = struct?.alias ?? name;
        const list = this.opcodeIndex.get(key);
        return list && list.length > 0 ? list : null;
    }

    /** All IPC type names usable as a filter root. */
    typeNames(): string[] {
        const names = new Set<string>();
        for (const info of this.byCanonical.values()) {
            names.add(info.alias);
        }
        return [...names].sort();
    }

    /** All field names (including sub type names) reachable from a struct. */
    memberNames(struct: StructInfo): string[] {
        const names = new Set<string>(struct.fields.keys());
        if (struct.discriminator) {
            for (const name of struct.discriminator.enumValues.keys()) names.add(name);
        }
        return [...names].sort();
    }
}

export interface ResolvedPath {
    root: StructInfo;
    owner: StructInfo;
    field: FieldInfo;
    subtypeName: string;
}

/**
 * Structural (diagnostic free) version of the compiler path walk, used by the
 * completion engine.
 */
export function resolveFieldPath(
    symbols: FilterSymbols,
    parts: { name: string }[],
): ResolvedPath | null {
    if (parts.length < 2) return null;
    const root = symbols.struct(parts[0].name);
    if (!root) return null;

    let cur = root;
    let owner = root;
    let field: FieldInfo | null = null;
    let subtypeName = "";

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const candidate = cur.fields.get(part.name);
        if (!candidate) {
            if (cur.discriminator && cur.discriminator.enumValues.has(part.name)) {
                subtypeName = part.name;
                continue;
            }
            return null;
        }
        owner = cur;
        field = candidate;
        if (i < parts.length - 1) {
            if (candidate.kind !== "struct" || !candidate.struct) return null;
            cur = candidate.struct;
        }
    }

    if (!field) return null;
    return { root, owner, field, subtypeName };
}
