import extraEnums from "../../data/ipc_extra_enum.json";

/** Extra enum tables that are not part of ipc_structs.json. */
export const extraEnum = extraEnums as {
    [key: string]: { [key: number]: string | null };
};

/**
 * Maps an IPC struct field to the name database / extra enum category that
 * should be used to render its value as a human readable name.
 */
export const keyMapping: { [key: string]: string } = {
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

/** Struct name -> field that selects the active sub type (discriminated union). */
export const subtypeKeys: { [key: string]: string } = {
    "FFXIVIpcActorControl": "category",
    "FFXIVIpcActorControlSelf": "category",
    "FFXIVIpcActorControlTarget": "category",
    "FFXIVIpcClientTrigger": "commandId",
};

/** Alias key produced by keyMapping -> name database category in db.json. */
export const aliasKeyToDb: { [key: string]: string } = {
    ItemId: "Item",
    LogMessage: "LogMessage",
    ClassJob: "ClassJob",
    Status: "Status",
    Action: "Action",
};

export function subTypeKey(type: string): string {
    return subtypeKeys[type] || "";
}

/**
 * Resolve the alias category key for `structName.fieldName` (optionally within a
 * sub type branch). Returns e.g. "ItemId", "LogMessage", "ActorControlType", or
 * null when the field has no alias.
 */
export function fieldAliasKey(
    structName: string,
    fieldName: string,
    subtypeName: string = "",
): string | null {
    if (subtypeName) {
        const key = structName + "." + subtypeName + "." + fieldName;
        if (keyMapping[key]) return keyMapping[key];
    }

    if (fieldName === "actionId") return "Action";

    const key = structName + "." + fieldName;
    return keyMapping[key] ?? null;
}
