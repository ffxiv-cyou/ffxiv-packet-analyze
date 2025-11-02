export interface IPCStructField {
    name: string;
    type: string;
    offset: number;
    size: number;
    arrayLength?: number;
    alias?: string;
    fields?: IPCStructField[];
}

export interface IPCStruct {
    name: string;
    ipcName?: string;
    size: number;
    fields: IPCStructField[];
}

export interface IPCStructs {
    [name: string]: IPCStruct;
}

export interface IPCTypeAlias {
    name: string;
    size: number;
    enum: { [key: number]: string | undefined };
}

export interface IPCData {
    structs: IPCStruct[];
    enums: IPCTypeAlias[];
}
