import type { OpcodeList } from "./opcode";
import extraEnums from "../data/ipc_extra_enum.json";
import type { IPCData, IPCStruct } from "./ipc_struct";
import ipcAlias from "../data/opcode_alias.json";
import { createSubscriber } from "svelte/reactivity";

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

interface OpcodeMapping {
    old: number[] | string[];
    new: number[] | string[];
}

export class OpcodeRepo {
    private opcodeClientName: Map<number, string>;
    private opcodeServName: Map<number, string>;

    constructor(region: string, list: OpcodeList[], mappings: OpcodeMapping[] = []) {
        const opcodeMap = new Map<number, number>();
        for (const mapping of mappings) {
            for (let i = 0; i < Math.min(mapping.old.length, mapping.new.length); i++) {
                const oldOpcode = mapping.old[i];
                const newOpcode = mapping.new[i];
                if (typeof oldOpcode === "string" || typeof newOpcode === "string") {
                    opcodeMap.set(parseInt(oldOpcode as string), parseInt(newOpcode as string));
                }
                if (typeof oldOpcode === "number" && typeof newOpcode === "number") {
                    opcodeMap.set(oldOpcode, newOpcode);
                }
            }
        }

        for (const entry of list) {
            if (entry.region !== region)
                continue;

            this.opcodeClientName = new Map<number, string>();
            this.opcodeServName = new Map<number, string>();

            for (const item of entry.lists.ClientZoneIpcType) {
                const mappedOpcode = opcodeMap.get(item.opcode) ?? item.opcode;
                this.opcodeClientName.set(mappedOpcode, item.name);
            }
            for (const item of entry.lists.ServerZoneIpcType) {
                const mappedOpcode = opcodeMap.get(item.opcode) ?? item.opcode;
                this.opcodeServName.set(mappedOpcode, item.name);
            }
            return;
        }

        throw new Error(`Opcode list for region ${region} not found`);
    }

    public getOpcodeName(opcode: number, dir: boolean): string | undefined {
        if (dir) {
            return this.opcodeClientName.get(opcode) || undefined;
        } else {
            return this.opcodeServName.get(opcode) || undefined;
        }
    }

    public getNameOpcode(name: string): number | undefined {
        for (const [opcode, opname] of this.opcodeClientName.entries()) {
            if (opname.localeCompare(name, undefined, { sensitivity: 'base' }) === 0) {
                return opcode;
            }
        }
        for (const [opcode, opname] of this.opcodeServName.entries()) {
            if (opname.localeCompare(name, undefined, { sensitivity: 'base' }) === 0) {
                return opcode;
            }
        }
        return undefined;
    }
}

const extraEnum = extraEnums as { [key: string]: { [key: number]: string | null } };

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
    "FFXIVIpcPlayerSetup.useBaitCatalogId": "ItemId",
    "FFXIVIpcActorControlSelf.FishingMsg.param1": "ItemId",
    "FFXIVIpcActorControlSelf.FishingBaitMsg.param1": "ItemId",
    "FFXIVIpcSystemLogMessage.messageId": "LogMessage",
    "FFXIVIpcActorControl.LogMsg.param1": "LogMessage",
    "FFXIVIpcActorControlSelf.LogMsg.param1": "LogMessage",
    "FFXIVIpcActorControlTarget.LogMsg.param1": "LogMessage",
    "FFXIVIpcUpdateClassInfo.classId": "ClassJob",
    "FFXIVIpcPlayerClassInfo.classId": "ClassJob",
    "PartyMember.classId": "ClassJob",
    "FFXIVIpcMarketBoardSearch.classJobId": "ClassJob",
    "FFXIVIpcModelEquip.classJobId": "ClassJob",
    "FFXIVIpcActorGauge.classJobId": "ClassJob",
    "FFXIVIpcDuelChallenge.otherClassJobId": "ClassJob",
    "StatusEffect.effect_id": "Status",
    "FFXIVIpcActorControl.StatusEffectGain.param1": "Status",
    "FFXIVIpcActorControlSelf.StatusEffectGain.param1": "Status",
    "FFXIVIpcActorControlTarget.StatusEffectGain.param1": "Status",
    "FFXIVIpcActorControl.StatusEffectLose.param1": "Status",
    "FFXIVIpcActorControlSelf.StatusEffectLose.param1": "Status",
    "FFXIVIpcActorControlTarget.StatusEffectLose.param1": "Status",
};

const subtypeKeys: { [key: string]: string } = {
    "FFXIVIpcActorControl": "category",
    "FFXIVIpcActorControlSelf": "category",
    "FFXIVIpcActorControlTarget": "category",
    "FFXIVIpcClientTrigger": "commandId",
};

export class NameDb {
    nameDatabase: { [key: string]: { [key: number]: string } };
    constructor(nameDb: { [key: string]: { [key: number]: string } }) {
        this.nameDatabase = nameDb;
    }

    fieldHasAlias(type: string, field: string, subKey: string = "", subType: number = 0): boolean {
        if (subKey) {
            const subKeyType = type + "." + subKey;
            const subTypeName = this.getAliasValue(subKeyType, subType);
            if (subTypeName) {
                const key = type + "." + subTypeName + "." + field;
                if (keyMapping[key])
                    return true;
            }
        }

        switch (field) {
            case "actionId":
                return true;
        }

        const key = type + "." + field;
        if (keyMapping[key])
            return true;

        return false;
    }

    getFieldAlias(type: string, field: string, value: number, subKey: string = "", subType: number = 0): string | null {
        if (subKey) {
            const subKeyType = type + "." + subKey;
            const subTypeName = this.getAliasValue(subKeyType, subType);
            if (subTypeName) {
                const key = type + "." + subTypeName + "." + field;
                const val = this.getAliasValue(key, value);
                if (val !== null) {
                    return val;
                }
                console.log(`Alias not found for key: ${key} value: ${value}`);
            }
        }

        switch (field) {
            case "actionId":
                return this.nameDatabase["Action"][value];
        }

        const key = type + "." + field;
        return this.getAliasValue(key, value);
    }

    getAliasValue(key: string, value: number) {
        const mappedKey = keyMapping[key] || key;

        switch (mappedKey) {
            case "ActorControlType":
                return extraEnum["ActorControlType"][value];
            case "ClientTriggerType":
                return extraEnum["ClientTriggerType"][value];
            case "LogMessage":
                return this.nameDatabase["LogMessage"][value];
            case "ItemId":
                return this.nameDatabase["Item"][value];
            case "ClassJob":
                return this.nameDatabase["ClassJob"][value];
            case "Status":
                return this.nameDatabase["Status"][value];
        }
        return null;
    }
}

export function subTypeKey(type: string): string {
    return subtypeKeys[type] || "";
}

interface VersionInfo {
    version: string;
    based_on?: string;
    opcode_diff?: boolean;
}

const ipcNameAlias: Record<string, string> = ipcAlias as Record<string, string>;

export class DataLoader {
    versions: Map<string, VersionInfo> = new Map();
    currentVer: string = "";
    opcode: OpcodeRepo | null = null;
    name: NameDb | null = null;
    ipc: IPCData | null = null;

    #subscribe;
    private update: () => void = () => { };

    constructor() {
        this.#subscribe = createSubscriber((update) => {
            this.update = update;
        });
    }

    get versionList(): string[] {
        this.#subscribe();
        return Array.from(this.versions.keys()).sort();
    }

    get version(): string {
        this.#subscribe();
        return this.currentVer;
    }

    async loadVersions(): Promise<void> {
        const versionFetch = await fetch("/data/version.json");
        const versions = await versionFetch.json();

        for (const v of versions) {
            this.versions.set(v.version, v);
        }
        this.update();
    }

    async loadVersion(version: string): Promise<void> {
        // Opcode
        const vinfo = this.versions.get(version);
        if (!vinfo) {
            throw new Error(`Version ${version} not found`);
        }

        let ver = vinfo.version;
        let opcodeVer = ver;
        const diffs: OpcodeMapping[] = [];
        if (vinfo.based_on) {
            if (vinfo.opcode_diff) {
                const opcodeDiff = await fetch(`/data/${ver}/opcode.diff.json`);
                diffs.push(...await opcodeDiff.json());
                opcodeVer = vinfo.based_on;
            } 
            ver = vinfo.based_on;
        }

        const opcodeFetch = await fetch(`/data/${opcodeVer}/opcode.json`);
        const opcodeData = await opcodeFetch.json();
        this.opcode = new OpcodeRepo("CN", opcodeData, diffs);

        // Name Database
        const nameDbFetch = await fetch(`/data/${ver}/db.json`);
        const nameDbData = await nameDbFetch.json();
        this.name = new NameDb(nameDbData);

        // Ipc structs
        const ipcStructsFetch = await fetch(`/data/${ver}/ipc_structs.json`);
        const ipcStructsData = await ipcStructsFetch.json();
        this.ipc = ipcStructsData;

        this.currentVer = version;
        this.update();
    }

    getIpcStruct(name: string): IPCStruct | null {
        if (!this.ipc || !name)
            return null;

        const typeName = ipcNameAlias[name] || name;
        const struct = this.ipc.structs.find((s) => s.name === typeName || s.name === "FFXIVIpc" + typeName);
        return struct || null;
    }

    getEnumValue(enumName: string, value: number): string | null {
        if (!this.ipc)
            return null;
        const enumType = this.ipc.enums.find((e) => e.name === enumName);
        if (!enumType)
            return null;
        return enumType.enum[value] || null;
    }

    getOpcodeName(opcode: number, dir: boolean): string | undefined {
        this.#subscribe();
        
        if (!this.opcode)
            return undefined;
        return this.opcode.getOpcodeName(opcode, dir);
    }

    getNameOpcode(name: string): number | undefined {
        if (!this.opcode)
            return undefined;
        return this.opcode.getNameOpcode(name);
    }

    fieldHasAlias(type: string, field: string, subKey: string = "", subType: number = 0): boolean {
        if (!this.name)
            return false;
        return this.name.fieldHasAlias(type, field, subKey, subType);
    }

    getFieldAlias(type: string, field: string, value: number, subKey: string = "", subType: number = 0): string | null {
        if (!this.name)
            return null;
        return this.name.getFieldAlias(type, field, value, subKey, subType);
    }
}