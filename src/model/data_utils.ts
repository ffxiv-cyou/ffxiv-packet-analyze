import type { OpcodeList } from "./opcode";
import opcodes from "../data/opcode.json";
import extraEnums from "../data/ipc_extra_enum.json";
import nameDb from "../data/db.json";

export function padHex(num: number, length: number): string {
    return num.toString(16).padStart(length, "0");
}

export function bytesToString(dw: DataView, offset: number, length: number = 0): string {
    if (length === 0) {
        let term = offset;
        for (; term < dw.byteLength; term++) {
            if (dw.getUint8(term) === 0) break;
        }
        length = term - offset;
    }

    const decoder = new TextDecoder();
    const bytes = new Uint8Array(dw.buffer, dw.byteOffset + offset, length);
    return decoder.decode(bytes);
}

export function epochToTimeString(epoch: number): string {
    const date = new Date(epoch);
    return date.toLocaleTimeString();
}

export function epochToString(epoch: number): string {
    const date = new Date(epoch);
    return date.toLocaleString();
}

export function bytesToHex(data: Uint8Array): string {
    return Array.from(data)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");
}

export function getOpcodeName(opcode: number, dir: boolean): string | null {
    const list = opcodes as OpcodeList[];

    for (const entry of list) {
        if (entry.region !== "CN") continue;

        const l = dir
            ? entry.lists.ClientZoneIpcType
            : entry.lists.ServerZoneIpcType;
        const name = l.find((item) => item.opcode === opcode)?.name;
        if (name) return name;
    }

    return null;
}

const extraEnum = extraEnums as { [key: string]: { [key: number]: string | null } };
const nameDatabase = nameDb as { [key: string]: { [key: number]: string } };

const keyMapping: { [key: string]: string } = {
    "FFXIVIpcActorControl.category": "ActorControlType",
    "FFXIVIpcActorControlSelf.category": "ActorControlType",
    "FFXIVIpcActorControlTarget.category": "ActorControlType",
    "FFXIVIpcClientTrigger.commandId": "ClientTriggerType",
    "FFXIVIpcItemInfo.catalogId": "ItemId",
    "FFXIVIpcCurrencyCrystalInfo.catalogId": "ItemId",
    "FFXIVIpcInventoryTransaction.catalogId": "ItemId",
    "FFXIVIpcInventoryTransaction.targetCatalogId": "ItemId",
    "FFXIVIpcUpdateInventorySlot.catalogId": "ItemId",
    "FFXIVIpcUpdateInventorySlot.glamourCatalogId": "ItemId",
    "MarketBoardRequestItemListings.itemCatalogId": "ItemId",
    "MarketBoardRequestItemListingInfo.catalogId": "ItemId",
    "FFFXIVIpcMarketBoardItemListingCount.catalogId": "ItemId",
    "FFXIVIpcMarketBoardItemListingHistory.itemCatalogId": "ItemId",
    "FFXIVIpcMarketBoardItemListingHistory.itemCatalogId2": "ItemId",
    "MarketListing.itemCatalogId": "ItemId",
    "MarketBoardSearchResult.itemCatalogId": "ItemId",
    "FFXIVIpcExamine.catalogId": "ItemId",
    "FFXIVIpcExamine.appearanceCatalogId": "ItemId",
    "FFXIVIpcSystemLogMessage.messageId": "LogMessage",
    "FFXIVIpcUpdateClassInfo.classId": "ClassJob",
    "FFXIVIpcPlayerClassInfo.classId": "ClassJob",
    "PartyMember.classId": "ClassJob",
    "FFXIVIpcMarketBoardSearch.classJobId": "ClassJob",
    "FFXIVIpcModelEquip.classJobId": "ClassJob",
    "FFXIVIpcActorGauge.classJobId": "ClassJob",
    "FFXIVIpcDuelChallenge.otherClassJobId": "ClassJob",
    "StatusEffect.effect_id": "Status",
};

export function fieldHasAlias(type: string, field: string): boolean {
    switch (field) {
        case "actionId":
            return true;
    }

    const key = type + "." + field;
    if (keyMapping[key])
        return true;

    return false;
}

export function getFieldAlias(type: string, field: string, value: number): string | null {
    switch (field) {
        case "actionId":
            return nameDatabase["Action"][value];
    }

    const key = type + "." + field;
    const mappedKey = keyMapping[key] || key;

    switch (mappedKey) {
        case "ActorControlType":
            return extraEnum["ActorControlType"][value];
        case "ClientTriggerType":
            return extraEnum["ClientTriggerType"][value];
        case "LogMessage":
            return nameDatabase["LogMessage"][value];
        case "ItemId":
            return nameDatabase["Item"][value];
        case "ClassJob":
            return nameDatabase["ClassJob"][value];
        case "Status":
            return nameDatabase["Status"][value];
    }
    return null;
}
