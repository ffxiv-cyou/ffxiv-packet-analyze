export interface OpcodeList {
    version: string;
    region: string;
    lists: OpcodeCategory;
}

export interface OpcodeListItem {
    name: string;
    opcode: number;
}

export interface OpcodeCategory {
    ServerZoneIpcType: OpcodeListItem[];
    ClientZoneIpcType: OpcodeListItem[];
    ServerLobbyIpcType: OpcodeListItem[];
    ClientLobbyIpcType: OpcodeListItem[];
    ServerChatIpcType: OpcodeListItem[];
    ClientChatIpcType: OpcodeListItem[];
}
