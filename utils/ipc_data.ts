// This file is auto-generated. Do not edit directly.

export class IpcPacket {
  constructor(dw: DataView, offset: number = 0) {
    // Base class constructor
  }
  static PacketSize(): number {
    return 0; // Override in derived classes
  }
}

export class FFXIVARR_POSITION3_U16 extends IpcPacket {
  x: number;
  y: number;
  z: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.x = dw.getUint16(offset + 0, true);
    this.y = dw.getUint16(offset + 2, true);
    this.z = dw.getUint16(offset + 4, true);
  }
}
export class ActiveLand extends IpcPacket {
  ward: number;
  plot: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.ward = dw.getUint8(offset + 0);
    this.plot = dw.getUint8(offset + 1);
  }
}
export class HuntingLogEntry extends IpcPacket {
  rank: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.rank = dw.getUint8(offset + 0);
  }
}
export class StatusEffect extends IpcPacket {
  effect_id: number;
  param: number;
  duration: number;
  sourceActorId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.effect_id = dw.getUint16(offset + 0, true);
    this.param = dw.getUint16(offset + 2, true);
    this.duration = dw.getFloat32(offset + 4, true);
    this.sourceActorId = dw.getUint32(offset + 8, true);
  }
}
export class QuestActive extends IpcPacket {

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
  }
}
export class EffectEntry extends IpcPacket {
  effectType: ActionEffectType;
  param0: number;
  param1: number;
  param2: number;
  extendedValueHighestByte: number;
  flags: number;
  value: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.param0 = dw.getUint8(offset + 1);
    this.param1 = dw.getUint8(offset + 2);
    this.param2 = dw.getUint8(offset + 3);
    this.extendedValueHighestByte = dw.getUint8(offset + 4);
    this.flags = dw.getUint8(offset + 5);
    this.value = dw.getInt16(offset + 6, true);
  }
}
export class LandIdent extends IpcPacket {
  landId: number;
  wardNum: number;
  territoryTypeId: number;
  worldId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landId = dw.getInt16(offset + 0, true);
    this.wardNum = dw.getInt16(offset + 2, true);
    this.territoryTypeId = dw.getInt16(offset + 4, true);
    this.worldId = dw.getInt16(offset + 6, true);
  }
}
export class LandFlagSet extends IpcPacket {
  landIdent: LandIdent;
  landFlags: number;
  unkown1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.landFlags = dw.getUint32(offset + 8, true);
    this.unkown1 = dw.getUint32(offset + 12, true);
  }
}
export class HousingObject extends IpcPacket {
  itemId: number;
  padding: number;
  rotation: number;
  pos: FFXIVARR_POSITION3;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemId = dw.getUint32(offset + 0, true);
    this.padding = dw.getUint32(offset + 4, true);
    this.rotation = dw.getFloat32(offset + 8, true);
    this.pos = new FFXIVARR_POSITION3(dw, offset + 12);
  }
}
export class PlayerTeleportQuery extends IpcPacket {
  targetAetheryte: number;
  cost: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.targetAetheryte = dw.getUint16(offset + 0, true);
    this.cost = dw.getUint16(offset + 2, true);
  }
}
export class FFXIVIpcGmCommand1 extends IpcPacket {
  commandId: number;
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  unknown1: number;
  target: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.commandId = dw.getUint32(offset + 0, true);
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.unknown1 = dw.getUint32(offset + 20, true);
    this.target = dw.getUint32(offset + 24, true);
  }
}
export class FFXIVIpcGmCommand2 extends IpcPacket {
  commandId: number;
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  worldId: number;
  target: number[];
  unknown1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.commandId = dw.getUint32(offset + 0, true);
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.worldId = dw.getUint16(offset + 20, true);
    this.target = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.target[i] = dw.getInt8(offset + 22 + i * 1);
    }
    this.unknown1 = dw.getUint16(offset + 54, true);
  }
}
export class FFXIVIpcClientTrigger extends IpcPacket {
  commandId: number;
  unk_2: number[];
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  position: FFXIVARR_POSITION3;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.commandId = dw.getUint16(offset + 0, true);
    this.unk_2 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unk_2[i] = dw.getUint8(offset + 2 + i * 1);
    }
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 20);
  }
}
export class FFXIVIpcUpdatePosition extends IpcPacket {
  rotation: number;
  animationType: number;
  animationState: number;
  clientAnimationType: number;
  headPosition: number;
  position: FFXIVARR_POSITION3;
  unk: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.rotation = dw.getFloat32(offset + 0, true);
    this.animationType = dw.getUint8(offset + 4);
    this.animationState = dw.getUint8(offset + 5);
    this.clientAnimationType = dw.getUint8(offset + 6);
    this.headPosition = dw.getUint8(offset + 7);
    this.position = new FFXIVARR_POSITION3(dw, offset + 8);
    this.unk = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unk[i] = dw.getUint8(offset + 20 + i * 1);
    }
  }
}
export class FFXIVIpcUpdatePositionInstance extends IpcPacket {
  rotation: number;
  interpolateRotation: number;
  flags: number;
  position: FFXIVARR_POSITION3;
  interpolatePosition: FFXIVARR_POSITION3;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.rotation = dw.getFloat32(offset + 0, true);
    this.interpolateRotation = dw.getFloat32(offset + 4, true);
    this.flags = dw.getUint32(offset + 8, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 12);
    this.interpolatePosition = new FFXIVARR_POSITION3(dw, offset + 24);
    this.unknown = dw.getUint32(offset + 36, true);
  }
}
export class FFXIVIpcSkillHandler extends IpcPacket {
  pad_0000: number;
  type: number;
  pad_0002: number[];
  actionId: number;
  sequence: number;
  pad_000C: number[];
  targetId: bigint;
  itemSourceSlot: number;
  itemSourceContainer: number;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.pad_0000 = dw.getUint8(offset + 0);
    this.type = dw.getUint8(offset + 1);
    this.pad_0002 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_0002[i] = dw.getUint8(offset + 2 + i * 1);
    }
    this.actionId = dw.getUint32(offset + 4, true);
    this.sequence = dw.getUint16(offset + 8, true);
    this.pad_000C = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.pad_000C[i] = dw.getUint8(offset + 10 + i * 1);
    }
    this.targetId = dw.getBigUint64(offset + 16, true);
    this.itemSourceSlot = dw.getUint16(offset + 24, true);
    this.itemSourceContainer = dw.getUint16(offset + 26, true);
    this.unknown = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcAoESkillHandler extends IpcPacket {
  pad_0000: number;
  type: number;
  pad_0002: number[];
  actionId: number;
  sequence: number;
  pad_000C: number[];
  pos: FFXIVARR_POSITION3;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.pad_0000 = dw.getUint8(offset + 0);
    this.type = dw.getUint8(offset + 1);
    this.pad_0002 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_0002[i] = dw.getUint8(offset + 2 + i * 1);
    }
    this.actionId = dw.getUint32(offset + 4, true);
    this.sequence = dw.getUint16(offset + 8, true);
    this.pad_000C = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.pad_000C[i] = dw.getUint8(offset + 10 + i * 1);
    }
    this.pos = new FFXIVARR_POSITION3(dw, offset + 16);
    this.unknown = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcZoneLineHandler extends IpcPacket {
  zoneLineId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.zoneLineId = dw.getUint32(offset + 0, true);
  }
}
export class FFXIVIpcDiscoveryHandler extends IpcPacket {
  positionRef: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.positionRef = dw.getUint32(offset + 0, true);
  }
}
export class FFXIVIpcEventHandlerReturn extends IpcPacket {
  eventId: number;
  scene: number;
  param1: number;
  param2: number;
  pad_000A: number[];
  param3: number;
  pad_000E: number[];
  param4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint16(offset + 4, true);
    this.param1 = dw.getUint16(offset + 6, true);
    this.param2 = dw.getUint16(offset + 8, true);
    this.pad_000A = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_000A[i] = dw.getUint8(offset + 10 + i * 1);
    }
    this.param3 = dw.getUint16(offset + 12, true);
    this.pad_000E = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_000E[i] = dw.getUint8(offset + 14 + i * 1);
    }
    this.param4 = dw.getUint16(offset + 16, true);
  }
}
export class FFXIVIpcEnterTerritoryHandler extends IpcPacket {
  eventId: number;
  param1: number;
  param2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.param1 = dw.getUint16(offset + 4, true);
    this.param2 = dw.getUint16(offset + 6, true);
  }
}
export class FFXIVIpcEventHandlerOutsideRange extends IpcPacket {
  param1: number;
  eventId: number;
  position: FFXIVARR_POSITION3;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.param1 = dw.getUint32(offset + 0, true);
    this.eventId = dw.getUint32(offset + 4, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 8);
  }
}
export class FFXIVIpcEventHandlerWithinRange extends IpcPacket {
  param1: number;
  eventId: number;
  position: FFXIVARR_POSITION3;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.param1 = dw.getUint32(offset + 0, true);
    this.eventId = dw.getUint32(offset + 4, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 8);
  }
}
export class FFXIVIpcEventHandlerEmote extends IpcPacket {
  actorId: bigint;
  eventId: number;
  emoteId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.emoteId = dw.getUint16(offset + 12, true);
  }
}
export class FFXIVIpcEventHandlerTalk extends IpcPacket {
  actorId: bigint;
  eventId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
  }
}
export class FFXIVIpcEventHandlerSay extends IpcPacket {
  actorId: bigint;
  eventId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
  }
}
export class FFXIVIpcPingHandler extends IpcPacket {
  timestamp: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.timestamp = dw.getUint32(offset + 0, true);
  }
}
export class FFXIVIpcSetSearchInfo extends IpcPacket {
  status: bigint;
  status1: number;
  status2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.status = dw.getBigUint64(offset + 0, true);
    this.status1 = dw.getUint32(offset + 8, true);
    this.status2 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcTellHandler extends IpcPacket {
  contentId: bigint;
  worldId: number;
  u0A: number;
  u0C: number;
  worldId1: number;
  preName: number;
  targetPCName: number[];
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.worldId = dw.getUint16(offset + 8, true);
    this.u0A = dw.getUint16(offset + 10, true);
    this.u0C = dw.getUint32(offset + 12, true);
    this.worldId1 = dw.getUint16(offset + 16, true);
    this.preName = dw.getUint8(offset + 18);
    this.targetPCName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.targetPCName[i] = dw.getInt8(offset + 19 + i * 1);
    }
    this.message = new Array(1029);
    for (let i = 0; i < 1029; i++) {
      this.message[i] = dw.getInt8(offset + 51 + i * 1);
    }
  }
}
export class FFXIVIpcChatHandler extends IpcPacket {
  pad_0000: number[];
  sourceId: number;
  pad_0008: number[];
  chatType: ChatType;
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.pad_0000 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.pad_0000[i] = dw.getUint8(offset + 0 + i * 1);
    }
    this.sourceId = dw.getUint32(offset + 4, true);
    this.pad_0008 = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.pad_0008[i] = dw.getUint8(offset + 8 + i * 1);
    }
    this.message = new Array(1012);
    for (let i = 0; i < 1012; i++) {
      this.message[i] = dw.getInt8(offset + 26 + i * 1);
    }
  }
}
export class FFXIVIpcChannelChatHandler extends IpcPacket {
  channelId: bigint;
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.channelId = dw.getBigUint64(offset + 0, true);
    this.message = new Array(1024);
    for (let i = 0; i < 1024; i++) {
      this.message[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcShopEventHandler extends IpcPacket {
  eventId: number;
  param: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.param = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcLinkshellEventHandler extends IpcPacket {
  eventId: number;
  scene: number;
  pad_0006: number[];
  lsName: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint16(offset + 4, true);
    this.pad_0006 = new Array(1);
    for (let i = 0; i < 1; i++) {
      this.pad_0006[i] = dw.getUint8(offset + 6 + i * 1);
    }
    this.lsName = new Array(21);
    for (let i = 0; i < 21; i++) {
      this.lsName[i] = dw.getInt8(offset + 7 + i * 1);
    }
  }
}
export class FFXIVIpcInventoryModifyHandler extends IpcPacket {
  seq: number;
  action: InventoryOperation;
  pad_0006: number[];
  fromContainer: number;
  pad_000E: number[];
  fromSlot: number;
  pad_0011: number[];
  toContainer: number;
  pad_0022: number[];
  toSlot: number;
  pad_0025: number[];
  splitCount: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.seq = dw.getUint32(offset + 0, true);
    this.pad_0006 = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.pad_0006[i] = dw.getUint8(offset + 6 + i * 1);
    }
    this.fromContainer = dw.getUint16(offset + 12, true);
    this.pad_000E = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_000E[i] = dw.getUint8(offset + 14 + i * 1);
    }
    this.fromSlot = dw.getUint8(offset + 16);
    this.pad_0011 = new Array(15);
    for (let i = 0; i < 15; i++) {
      this.pad_0011[i] = dw.getUint8(offset + 17 + i * 1);
    }
    this.toContainer = dw.getUint16(offset + 32, true);
    this.pad_0022 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad_0022[i] = dw.getUint8(offset + 34 + i * 1);
    }
    this.toSlot = dw.getUint8(offset + 36);
    this.pad_0025 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.pad_0025[i] = dw.getUint8(offset + 37 + i * 1);
    }
    this.splitCount = dw.getUint32(offset + 40, true);
  }
}
export class FFXIVIpcRenameLandHandler extends IpcPacket {
  ident: LandIdent;
  houseName: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.ident = new LandIdent(dw, offset + 0);
    this.houseName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.houseName[i] = dw.getInt8(offset + 8 + i * 1);
    }
    this.padding = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcHousingUpdateHouseGreeting extends IpcPacket {
  ident: LandIdent;
  greeting: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.ident = new LandIdent(dw, offset + 0);
    this.greeting = new Array(200);
    for (let i = 0; i < 200; i++) {
      this.greeting[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcBuildPresetHandler extends IpcPacket {
  itemId: number;
  plotNum: number;
  stateString: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemId = dw.getUint32(offset + 0, true);
    this.plotNum = dw.getUint8(offset + 4);
    this.stateString = new Array(27);
    for (let i = 0; i < 27; i++) {
      this.stateString[i] = dw.getInt8(offset + 5 + i * 1);
    }
  }
}
export class FFXIVIpcSetSharedEstateSettings extends IpcPacket {
  char1ContentId: bigint;
  char2ContentId: bigint;
  char3ContentId: bigint;
  char1Permissions: number;
  padding1: number[];
  char2Permissions: number;
  padding2: number[];
  char3Permissions: number;
  padding3: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.char1ContentId = dw.getBigUint64(offset + 0, true);
    this.char2ContentId = dw.getBigUint64(offset + 8, true);
    this.char3ContentId = dw.getBigUint64(offset + 16, true);
    this.char1Permissions = dw.getUint8(offset + 24);
    this.padding1 = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding1[i] = dw.getUint8(offset + 25 + i * 1);
    }
    this.char2Permissions = dw.getUint8(offset + 32);
    this.padding2 = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding2[i] = dw.getUint8(offset + 33 + i * 1);
    }
    this.char3Permissions = dw.getUint8(offset + 40);
    this.padding3 = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding3[i] = dw.getUint8(offset + 41 + i * 1);
    }
  }
}
export class FFXIVIpcMarketBoardRequestItemListings extends IpcPacket {
  padding1: number;
  itemCatalogId: number;
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding1 = dw.getUint16(offset + 0, true);
    this.itemCatalogId = dw.getUint16(offset + 2, true);
    this.padding2 = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcReqPlaceHousingItem extends IpcPacket {
  landId: number;
  unknown1: number;
  unknown2: number;
  sourceInvContainerId: number;
  sourceInvSlotId: number;
  position: FFXIVARR_POSITION3;
  rotation: number;
  shouldPlaceItem: number;
  unknown4: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landId = dw.getUint16(offset + 0, true);
    this.unknown1 = dw.getUint16(offset + 2, true);
    this.unknown2 = dw.getUint32(offset + 4, true);
    this.sourceInvContainerId = dw.getUint16(offset + 8, true);
    this.sourceInvSlotId = dw.getUint16(offset + 10, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 12);
    this.rotation = dw.getFloat32(offset + 24, true);
    this.shouldPlaceItem = dw.getUint32(offset + 28, true);
    this.unknown4 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown4[i] = dw.getUint32(offset + 32 + i * 4, true);
    }
  }
}
export class FFXIVIpcHousingUpdateObjectPosition extends IpcPacket {
  ident: LandIdent;
  slot: number;
  unk: number;
  pos: FFXIVARR_POSITION3;
  rotation: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.ident = new LandIdent(dw, offset + 0);
    this.slot = dw.getUint16(offset + 8, true);
    this.unk = dw.getUint16(offset + 10, true);
    this.pos = new FFXIVARR_POSITION3(dw, offset + 12);
    this.rotation = dw.getFloat32(offset + 24, true);
    this.padding = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcMarketBoardSearch extends IpcPacket {
  startIdx: number;
  requestId: number;
  itemSearchCategory: number;
  shouldCheckClassJobId: number;
  maxEquipLevel: number;
  classJobId: number;
  searchStr: number[];
  unk4: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.startIdx = dw.getUint32(offset + 0, true);
    this.requestId = dw.getUint16(offset + 4, true);
    this.itemSearchCategory = dw.getUint8(offset + 6);
    this.shouldCheckClassJobId = dw.getUint8(offset + 7);
    this.maxEquipLevel = dw.getUint8(offset + 8);
    this.classJobId = dw.getUint8(offset + 9);
    this.searchStr = new Array(40);
    for (let i = 0; i < 40; i++) {
      this.searchStr[i] = dw.getInt8(offset + 10 + i * 1);
    }
    this.unk4 = new Array(43);
    for (let i = 0; i < 43; i++) {
      this.unk4[i] = dw.getUint16(offset + 50 + i * 2, true);
    }
  }
}
export class FFXIVIpcMarketBoardRequestItemListingInfo extends IpcPacket {
  catalogId: number;
  requestId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.catalogId = dw.getUint32(offset + 0, true);
    this.requestId = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcFreeCompanyUpdateShortMessageHandler extends IpcPacket {
  shortMessage: number[];
  padding: number;
  unknown: number;
  unknown1: number;
  unknown2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.shortMessage = new Array(104);
    for (let i = 0; i < 104; i++) {
      this.shortMessage[i] = dw.getInt8(offset + 0 + i * 1);
    }
    this.padding = dw.getUint8(offset + 104);
    this.unknown = dw.getUint8(offset + 105);
    this.unknown1 = dw.getUint32(offset + 106, true);
    this.unknown2 = dw.getUint16(offset + 110, true);
  }
}
export class FFXIVIpcSocialInviteHandler extends IpcPacket {
  unknown: bigint;
  p1: number;
  p2: number;
  socialType: number;
  name: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getBigUint64(offset + 0, true);
    this.p1 = dw.getUint8(offset + 8);
    this.p2 = dw.getUint8(offset + 9);
    this.socialType = dw.getUint8(offset + 10);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 11 + i * 1);
    }
    this.padding = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.padding[i] = dw.getUint8(offset + 43 + i * 1);
    }
  }
}
export class FFXIVIpcSocialReplyHandler extends IpcPacket {
  contentId: bigint;
  p1: number;
  p2: number;
  socialType: number;
  response: number;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.p1 = dw.getUint8(offset + 8);
    this.p2 = dw.getUint8(offset + 9);
    this.socialType = dw.getUint8(offset + 10);
    this.response = dw.getUint8(offset + 11);
    this.unknown = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcPartyChangeLeaderHandler extends IpcPacket {
  contentId: bigint;
  p1: number;
  p2: number;
  name: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.p1 = dw.getUint8(offset + 8);
    this.p2 = dw.getUint8(offset + 9);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 10 + i * 1);
    }
    this.padding = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.padding[i] = dw.getUint8(offset + 42 + i * 1);
    }
  }
}
export class FFXIVIpcPartyLeaveHandler extends IpcPacket {
  empty: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.empty = dw.getBigUint64(offset + 0, true);
  }
}
export class FFXIVIpcPartyKickHandler extends IpcPacket {
  contentId: bigint;
  p1: number;
  p2: number;
  name: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.p1 = dw.getUint8(offset + 8);
    this.p2 = dw.getUint8(offset + 9);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 10 + i * 1);
    }
    this.padding = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.padding[i] = dw.getUint8(offset + 42 + i * 1);
    }
  }
}
export class FFXIVIpcPartyDisbandHandler extends IpcPacket {
  empty: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.empty = dw.getBigUint64(offset + 0, true);
  }
}
export class FFXIVIpcDive extends IpcPacket {
  unknown: number;
  posTarget: FFXIVARR_POSITION3;
  posOriginal: FFXIVARR_POSITION3;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getFloat32(offset + 0, true);
    this.posTarget = new FFXIVARR_POSITION3(dw, offset + 4);
    this.posOriginal = new FFXIVARR_POSITION3(dw, offset + 16);
    this.padding = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcHousingEditExterior extends IpcPacket {
  landId: number;
  unknown: number[];
  removeFlag: number;
  unknown2: number;
  container: number[];
  slot: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landId = dw.getUint16(offset + 0, true);
    this.unknown = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.unknown[i] = dw.getUint8(offset + 2 + i * 1);
    }
    this.removeFlag = dw.getUint8(offset + 8);
    this.unknown2 = dw.getUint8(offset + 9);
    this.container = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.container[i] = dw.getUint16(offset + 10 + i * 2, true);
    }
    this.slot = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.slot[i] = dw.getUint16(offset + 28 + i * 2, true);
    }
    this.padding = dw.getUint16(offset + 46, true);
  }
}
export class FFXIVIpcHousingEditInterior extends IpcPacket {
  unknown: bigint;
  container: number[];
  slot: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getBigUint64(offset + 0, true);
    this.container = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.container[i] = dw.getUint16(offset + 8 + i * 2, true);
    }
    this.slot = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.slot[i] = dw.getUint16(offset + 28 + i * 2, true);
    }
  }
}
export class FFXIVIpcEventYieldHandler extends IpcPacket {
  eventId: number;
  scene: number;
  padding: number;
  params: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint16(offset + 4, true);
    this.padding = dw.getUint16(offset + 6, true);
    this.params = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.params[i] = dw.getUint32(offset + 8 + i * 4, true);
    }
  }
}
export class FFXIVIpcEventYield16Handler extends IpcPacket {
  eventId: number;
  scene: number;
  padding: number;
  params: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint16(offset + 4, true);
    this.padding = dw.getUint16(offset + 6, true);
    this.params = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.params[i] = dw.getUint32(offset + 8 + i * 4, true);
    }
  }
}
export class FFXIVIpcCFCommenceHandler extends IpcPacket {
  param: number;
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.param = dw.getUint8(offset + 0);
    this.padding = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVInventoryEquipRecommendedItemsHandler extends IpcPacket {
  contextId: number;
  storageId: number[];
  containerIndex: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contextId = dw.getUint32(offset + 0, true);
    this.storageId = new Array(14);
    for (let i = 0; i < 14; i++) {
      this.storageId[i] = dw.getUint16(offset + 4 + i * 2, true);
    }
    this.containerIndex = new Array(14);
    for (let i = 0; i < 14; i++) {
      this.containerIndex[i] = dw.getInt16(offset + 32 + i * 2, true);
    }
  }
}
export class FFXIVIpcPing extends IpcPacket {
  timeInMilliseconds: bigint;
  unknown_8: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.timeInMilliseconds = dw.getBigUint64(offset + 0, true);
    this.unknown_8 = new Array(56);
    for (let i = 0; i < 56; i++) {
      this.unknown_8[i] = dw.getUint8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcInit extends IpcPacket {
  unknown: bigint;
  charId: number;
  unknown1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getBigUint64(offset + 0, true);
    this.charId = dw.getUint32(offset + 8, true);
    this.unknown1 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcChat extends IpcPacket {
  padding: number[];
  chatType: ChatType;
  name: number[];
  msg: number[];
  unknown: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = new Array(14);
    for (let i = 0; i < 14; i++) {
      this.padding[i] = dw.getUint8(offset + 0 + i * 1);
    }
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 16 + i * 1);
    }
    this.msg = new Array(1012);
    for (let i = 0; i < 1012; i++) {
      this.msg[i] = dw.getInt8(offset + 48 + i * 1);
    }
    this.unknown = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.unknown[i] = dw.getUint8(offset + 1060 + i * 1);
    }
  }
}
export class FFXIVIpcChatBanned extends IpcPacket {
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.padding[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcWorldVisitList extends IpcPacket {
  id: number;
  status: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.id = dw.getUint16(offset + 0, true);
    this.status = dw.getUint16(offset + 2, true);
  }
}
export class FFXIVIpcLogout extends IpcPacket {
  flags1: number;
  flags2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.flags1 = dw.getUint32(offset + 0, true);
    this.flags2 = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcPlayTime extends IpcPacket {
  playTimeInMinutes: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.playTimeInMinutes = dw.getUint32(offset + 0, true);
    this.padding = dw.getUint32(offset + 4, true);
  }
}
export class PlayerEntry extends IpcPacket {
  contentId: bigint;
  unknown: bigint;
  bytes: number[];
  zoneId: number;
  zoneId1: number;
  bytes1: number[];
  onlineStatusMask: bigint;
  classJob: number;
  padding: number;
  level: number;
  padding1: number;
  unknown2: number[];
  name: number[];
  fcTag: number[];
  padding2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.unknown = dw.getBigUint64(offset + 8, true);
    this.bytes = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.bytes[i] = dw.getUint8(offset + 16 + i * 1);
    }
    this.zoneId = dw.getUint16(offset + 28, true);
    this.zoneId1 = dw.getUint16(offset + 30, true);
    this.bytes1 = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.bytes1[i] = dw.getInt8(offset + 32 + i * 1);
    }
    this.onlineStatusMask = dw.getBigUint64(offset + 40, true);
    this.classJob = dw.getUint8(offset + 48);
    this.padding = dw.getUint8(offset + 49);
    this.level = dw.getUint8(offset + 50);
    this.padding1 = dw.getUint8(offset + 51);
    this.unknown2 = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.unknown2[i] = dw.getUint8(offset + 52 + i * 1);
    }
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 60 + i * 1);
    }
    this.fcTag = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.fcTag[i] = dw.getInt8(offset + 92 + i * 1);
    }
    this.padding2 = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.padding2[i] = dw.getUint8(offset + 98 + i * 1);
    }
  }
}
export class FFXIVIpcSocialList extends IpcPacket {
  padding: number;
  padding1: number;
  padding2: number;
  type: number;
  sequence: number;
  padding3: number;
  entries: PlayerEntry[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = dw.getUint32(offset + 0, true);
    this.padding1 = dw.getUint32(offset + 4, true);
    this.padding2 = dw.getUint32(offset + 8, true);
    this.type = dw.getUint8(offset + 12);
    this.sequence = dw.getUint8(offset + 13);
    this.padding3 = dw.getUint16(offset + 14, true);
    this.entries = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.entries[i] = new PlayerEntry(dw, offset + 16 + i * 104);
    }
  }
}
export class FFXIVIpcExamineSearchInfo extends IpcPacket {
  unknown: number;
  unknown1: number;
  unknown2: number;
  padding: number[];
  unknown3: number;
  unknown4: number;
  unknown5: number;
  unknown6: number;
  worldId: number;
  searchMessage: number[];
  fcName: number[];
  unknown7: number;
  padding1: number;
  id: number;
  level: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getUint32(offset + 0, true);
    this.unknown1 = dw.getUint16(offset + 4, true);
    this.unknown2 = dw.getUint16(offset + 6, true);
    this.padding = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.padding[i] = dw.getInt8(offset + 8 + i * 1);
    }
    this.unknown3 = dw.getUint32(offset + 24, true);
    this.unknown4 = dw.getUint16(offset + 28, true);
    this.unknown5 = dw.getUint16(offset + 30, true);
    this.unknown6 = dw.getUint16(offset + 32, true);
    this.worldId = dw.getUint8(offset + 34);
    this.searchMessage = new Array(193);
    for (let i = 0; i < 193; i++) {
      this.searchMessage[i] = dw.getInt8(offset + 35 + i * 1);
    }
    this.fcName = new Array(24);
    for (let i = 0; i < 24; i++) {
      this.fcName[i] = dw.getInt8(offset + 228 + i * 1);
    }
    this.unknown7 = dw.getUint8(offset + 252);
    this.padding1 = dw.getUint16(offset + 253, true);
    this.id = dw.getUint16(offset + 255, true);
    this.level = dw.getUint16(offset + 257, true);
  }
}
export class FFXIVIpcSetSearchInfo extends IpcPacket {
  onlineStatusFlags: bigint;
  unknown: bigint;
  unknown1: number;
  padding: number;
  selectRegion: number;
  searchMessage: number[];
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.onlineStatusFlags = dw.getBigUint64(offset + 0, true);
    this.unknown = dw.getBigUint64(offset + 8, true);
    this.unknown1 = dw.getUint32(offset + 16, true);
    this.padding = dw.getUint8(offset + 20);
    this.selectRegion = dw.getUint8(offset + 21);
    this.searchMessage = new Array(193);
    for (let i = 0; i < 193; i++) {
      this.searchMessage[i] = dw.getInt8(offset + 22 + i * 1);
    }
    this.padding2 = dw.getUint8(offset + 215);
  }
}
export class FFXIVIpcInitSearchInfo extends IpcPacket {
  onlineStatusFlags: bigint;
  unknown: bigint;
  unknown1: number;
  selectRegion: number;
  searchMessage: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.onlineStatusFlags = dw.getBigUint64(offset + 0, true);
    this.unknown = dw.getBigUint64(offset + 8, true);
    this.unknown1 = dw.getUint8(offset + 16);
    this.selectRegion = dw.getUint8(offset + 17);
    this.searchMessage = new Array(193);
    for (let i = 0; i < 193; i++) {
      this.searchMessage[i] = dw.getInt8(offset + 18 + i * 1);
    }
    this.padding = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.padding[i] = dw.getInt8(offset + 211 + i * 1);
    }
  }
}
export class FFXIVIpcExamineSearchComment extends IpcPacket {
  charId: number;
  searchComment: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.charId = dw.getUint32(offset + 0, true);
    this.searchComment = new Array(195);
    for (let i = 0; i < 195; i++) {
      this.searchComment[i] = dw.getInt8(offset + 4 + i * 1);
    }
    this.padding = dw.getInt8(offset + 199);
  }
}
export class FFXIVIpcServerNoticeShort extends IpcPacket {
  padding: number;
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = dw.getUint8(offset + 0);
    this.message = new Array(538);
    for (let i = 0; i < 538; i++) {
      this.message[i] = dw.getInt8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcServerNotice extends IpcPacket {
  padding: number;
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = dw.getUint8(offset + 0);
    this.message = new Array(775);
    for (let i = 0; i < 775; i++) {
      this.message[i] = dw.getInt8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcSetOnlineStatus extends IpcPacket {
  onlineStatusFlags: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.onlineStatusFlags = dw.getBigUint64(offset + 0, true);
  }
}
export class FFXIVIpcBlackList extends IpcPacket {
  contentId: bigint;
  name: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcLogMessage extends IpcPacket {
  field_0: number;
  field_4: number;
  field_8: number;
  field_12: number;
  category: number;
  logMessage: number;
  field_24: number;
  field_25: number;
  field_26: number[];
  field_58: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.field_0 = dw.getUint32(offset + 0, true);
    this.field_4 = dw.getUint32(offset + 4, true);
    this.field_8 = dw.getUint32(offset + 8, true);
    this.field_12 = dw.getUint32(offset + 12, true);
    this.category = dw.getUint32(offset + 16, true);
    this.logMessage = dw.getUint32(offset + 20, true);
    this.field_24 = dw.getUint8(offset + 24);
    this.field_25 = dw.getUint8(offset + 25);
    this.field_26 = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.field_26[i] = dw.getUint8(offset + 26 + i * 1);
    }
    this.field_58 = dw.getUint32(offset + 58, true);
  }
}
export class FFXIVIpcLinkshellList extends IpcPacket {
  lsId: bigint;
  unknownId: bigint;
  unknown: number;
  rank: number;
  padding: number;
  lsName: number[];
  unk: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.lsId = dw.getBigUint64(offset + 0, true);
    this.unknownId = dw.getBigUint64(offset + 8, true);
    this.unknown = dw.getUint8(offset + 16);
    this.rank = dw.getUint8(offset + 17);
    this.padding = dw.getUint16(offset + 18, true);
    this.lsName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.lsName[i] = dw.getUint8(offset + 20 + i * 1);
    }
    this.unk = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.unk[i] = dw.getUint8(offset + 40 + i * 1);
    }
  }
}
export class FFXIVIpcReqMoogleMailList extends IpcPacket {
  unk: number[];
  timeStamp: number;
  unk1: number[];
  read: number;
  type: number;
  unk2: number;
  senderName: number[];
  summary: number[];
  padding2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unk = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.unk[i] = dw.getInt8(offset + 0 + i * 1);
    }
    this.timeStamp = dw.getUint32(offset + 8, true);
    this.unk1 = new Array(48);
    for (let i = 0; i < 48; i++) {
      this.unk1[i] = dw.getInt8(offset + 12 + i * 1);
    }
    this.read = dw.getUint8(offset + 60);
    this.type = dw.getUint8(offset + 61);
    this.unk2 = dw.getUint8(offset + 62);
    this.senderName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.senderName[i] = dw.getInt8(offset + 63 + i * 1);
    }
    this.summary = new Array(60);
    for (let i = 0; i < 60; i++) {
      this.summary[i] = dw.getInt8(offset + 95 + i * 1);
    }
    this.padding2 = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.padding2[i] = dw.getInt8(offset + 155 + i * 1);
    }
  }
}
export class FFXIVIpcMailLetterNotification extends IpcPacket {
  sendbackCount: number;
  friendLetters: number;
  unreadCount: number;
  rewardLetters: number;
  isGmLetter: number;
  isSupportDesk: number;
  unk2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.sendbackCount = dw.getUint32(offset + 0, true);
    this.friendLetters = dw.getUint16(offset + 4, true);
    this.unreadCount = dw.getUint16(offset + 6, true);
    this.rewardLetters = dw.getUint16(offset + 8, true);
    this.isGmLetter = dw.getUint8(offset + 10);
    this.isSupportDesk = dw.getUint8(offset + 11);
    this.unk2 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unk2[i] = dw.getInt8(offset + 12 + i * 1);
    }
  }
}
export class FFFXIVIpcMarketTaxRates extends IpcPacket {
  type: number;
  category: number;
  unknown1: number;
  unknown2: number;
  unknown3: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.type = dw.getUint32(offset + 0, true);
    this.category = dw.getUint16(offset + 4, true);
    this.unknown1 = dw.getUint8(offset + 6);
    this.unknown2 = dw.getUint8(offset + 7);
    this.unknown3 = dw.getBigUint64(offset + 8, true);
  }
}
export class FFFXIVIpcMarketBoardItemListingCount extends IpcPacket {
  itemCatalogId: number;
  unknown1: number;
  requestId: number;
  quantity: number;
  unknown3: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemCatalogId = dw.getUint32(offset + 0, true);
    this.unknown1 = dw.getUint32(offset + 4, true);
    this.requestId = dw.getUint16(offset + 8, true);
    this.quantity = dw.getUint16(offset + 10, true);
    this.unknown3 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcMarketBoardItemListing extends IpcPacket {
  listingId: bigint;
  retainerId: bigint;
  retainerOwnerId: bigint;
  artisanId: bigint;
  pricePerUnit: number;
  totalTax: number;
  itemQuantity: number;
  itemId: number;
  lastReviewTime: number;
  containerId: number;
  slotId: number;
  durability: number;
  spiritBond: number;
  materiaValue: number[];
  padding1: number;
  padding2: number;
  retainerName: number[];
  playerName: number[];
  hq: boolean;
  materiaCount: number;
  onMannequin: number;
  dyeId: number;
  padding3: number;
  padding4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.listingId = dw.getBigUint64(offset + 0, true);
    this.retainerId = dw.getBigUint64(offset + 8, true);
    this.retainerOwnerId = dw.getBigUint64(offset + 16, true);
    this.artisanId = dw.getBigUint64(offset + 24, true);
    this.pricePerUnit = dw.getUint32(offset + 32, true);
    this.totalTax = dw.getUint32(offset + 36, true);
    this.itemQuantity = dw.getUint32(offset + 40, true);
    this.itemId = dw.getUint32(offset + 44, true);
    this.lastReviewTime = dw.getUint16(offset + 48, true);
    this.containerId = dw.getUint16(offset + 50, true);
    this.slotId = dw.getUint32(offset + 52, true);
    this.durability = dw.getUint16(offset + 56, true);
    this.spiritBond = dw.getUint16(offset + 58, true);
    this.materiaValue = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.materiaValue[i] = dw.getUint16(offset + 60 + i * 2, true);
    }
    this.padding1 = dw.getUint16(offset + 70, true);
    this.padding2 = dw.getUint32(offset + 72, true);
    this.retainerName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.retainerName[i] = dw.getInt8(offset + 76 + i * 1);
    }
    this.playerName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.playerName[i] = dw.getInt8(offset + 108 + i * 1);
    }
    this.hq = dw.getUint8(offset + 140) !== 0;
    this.materiaCount = dw.getUint8(offset + 141);
    this.onMannequin = dw.getUint8(offset + 142);
    this.dyeId = dw.getUint16(offset + 143, true);
    this.padding3 = dw.getUint16(offset + 145, true);
    this.padding4 = dw.getUint32(offset + 147, true);
  }
}
export class FFXIVIpcMarketBoardItemListingHistory extends IpcPacket {
  itemCatalogId: number;
  itemCatalogId2: number;
  salePrice: number;
  purchaseTime: number;
  quantity: number;
  isHq: number;
  padding: number;
  onMannequin: number;
  buyerName: number[];
  itemCatalogId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemCatalogId = dw.getUint32(offset + 0, true);
    this.itemCatalogId2 = dw.getUint32(offset + 4, true);
    this.salePrice = dw.getUint32(offset + 8, true);
    this.purchaseTime = dw.getUint32(offset + 12, true);
    this.quantity = dw.getUint32(offset + 16, true);
    this.isHq = dw.getUint8(offset + 20);
    this.padding = dw.getUint8(offset + 21);
    this.onMannequin = dw.getUint8(offset + 22);
    this.buyerName = new Array(33);
    for (let i = 0; i < 33; i++) {
      this.buyerName[i] = dw.getInt8(offset + 23 + i * 1);
    }
    this.itemCatalogId = dw.getUint32(offset + 56, true);
  }
}
export class FFXIVIpcMarketBoardSearchResult extends IpcPacket {
  itemCatalogId: number;
  quantity: number;
  demand: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemCatalogId = dw.getUint32(offset + 0, true);
    this.quantity = dw.getUint16(offset + 4, true);
    this.demand = dw.getUint16(offset + 6, true);
  }
}
export class FFXIVIpcExamineFreeCompanyInfo extends IpcPacket {
  unknown: number[];
  charId: number;
  fcTimeCreated: number;
  unknown2: number[];
  unknown3: number;
  fcName: number[];
  padding: number;
  fcTag: number[];
  padding2: number;
  fcLeader: number[];
  fcSlogan: number[];
  padding3: number;
  fcEstateProfile: number[];
  padding4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.unknown[i] = dw.getInt8(offset + 0 + i * 1);
    }
    this.charId = dw.getUint32(offset + 32, true);
    this.fcTimeCreated = dw.getUint32(offset + 36, true);
    this.unknown2 = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.unknown2[i] = dw.getInt8(offset + 40 + i * 1);
    }
    this.unknown3 = dw.getUint16(offset + 56, true);
    this.fcName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.fcName[i] = dw.getInt8(offset + 58 + i * 1);
    }
    this.padding = dw.getUint16(offset + 78, true);
    this.fcTag = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.fcTag[i] = dw.getInt8(offset + 80 + i * 1);
    }
    this.padding2 = dw.getUint16(offset + 85, true);
    this.fcLeader = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.fcLeader[i] = dw.getInt8(offset + 87 + i * 1);
    }
    this.fcSlogan = new Array(192);
    for (let i = 0; i < 192; i++) {
      this.fcSlogan[i] = dw.getInt8(offset + 119 + i * 1);
    }
    this.padding3 = dw.getInt8(offset + 311);
    this.fcEstateProfile = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.fcEstateProfile[i] = dw.getInt8(offset + 312 + i * 1);
    }
    this.padding4 = dw.getUint32(offset + 332, true);
  }
}
export class FFXIVIpcFreeCompanyUpdateShortMessage extends IpcPacket {
  unknown: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  unknown5: number;
  shortMessage: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = dw.getUint32(offset + 0, true);
    this.unknown1 = dw.getUint16(offset + 4, true);
    this.unknown2 = dw.getUint16(offset + 6, true);
    this.unknown3 = dw.getUint32(offset + 8, true);
    this.unknown5 = dw.getUint32(offset + 12, true);
    this.shortMessage = new Array(104);
    for (let i = 0; i < 104; i++) {
      this.shortMessage[i] = dw.getInt8(offset + 16 + i * 1);
    }
  }
}
export class FFXIVIpcStatusEffectList extends IpcPacket {
  classId: number;
  level1: number;
  level: number;
  current_hp: number;
  max_hp: number;
  current_mp: number;
  max_mp: number;
  shieldPercentage: number;
  unknown1: number;
  unknown2: number;
  effect: StatusEffect[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.classId = dw.getUint8(offset + 0);
    this.level1 = dw.getUint8(offset + 1);
    this.level = dw.getUint16(offset + 2, true);
    this.current_hp = dw.getUint32(offset + 4, true);
    this.max_hp = dw.getUint32(offset + 8, true);
    this.current_mp = dw.getUint16(offset + 12, true);
    this.max_mp = dw.getUint16(offset + 14, true);
    this.shieldPercentage = dw.getUint8(offset + 16);
    this.unknown1 = dw.getUint8(offset + 17);
    this.unknown2 = dw.getUint16(offset + 18, true);
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 20 + i * 12);
    }
    this.padding = dw.getUint32(offset + 380, true);
  }
}
export class FFXIVGCAffiliation extends IpcPacket {
  gcId: number;
  gcRank: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.gcId = dw.getUint8(offset + 0);
    this.gcRank = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.gcRank[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcEffectResult extends IpcPacket {
  unknown1: number;
  globalSequence: number;
  actor_id: number;
  current_hp: number;
  max_hp: number;
  current_mp: number;
  unknown2: number;
  classId: number;
  shieldPercentage: number;
  entryCount: number;
  unknown3: number;
  index: number;
  unknown4: number;
  id: number;
  param: number;
  unknown5: number;
  duration: number;
  sourceActorId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown1 = dw.getUint32(offset + 0, true);
    this.globalSequence = dw.getUint32(offset + 4, true);
    this.actor_id = dw.getUint32(offset + 8, true);
    this.current_hp = dw.getUint32(offset + 12, true);
    this.max_hp = dw.getUint32(offset + 16, true);
    this.current_mp = dw.getUint16(offset + 20, true);
    this.unknown2 = dw.getUint8(offset + 22);
    this.classId = dw.getUint8(offset + 23);
    this.shieldPercentage = dw.getUint8(offset + 24);
    this.entryCount = dw.getUint8(offset + 25);
    this.unknown3 = dw.getUint16(offset + 26, true);
    this.index = dw.getUint8(offset + 28);
    this.unknown4 = dw.getUint8(offset + 29);
    this.id = dw.getUint16(offset + 30, true);
    this.param = dw.getUint16(offset + 32, true);
    this.unknown5 = dw.getUint16(offset + 34, true);
    this.duration = dw.getFloat32(offset + 36, true);
    this.sourceActorId = dw.getUint32(offset + 40, true);
  }
}
export class FFXIVIpcActorControl extends IpcPacket {
  category: number;
  padding: number;
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  padding1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.category = dw.getUint16(offset + 0, true);
    this.padding = dw.getUint16(offset + 2, true);
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.padding1 = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcActorControlSelf extends IpcPacket {
  category: number;
  padding: number;
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  param5: number;
  param6: number;
  padding1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.category = dw.getUint16(offset + 0, true);
    this.padding = dw.getUint16(offset + 2, true);
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.param5 = dw.getUint32(offset + 20, true);
    this.param6 = dw.getUint32(offset + 24, true);
    this.padding1 = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcActorControlTarget extends IpcPacket {
  category: number;
  padding: number;
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  padding1: number;
  targetId: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.category = dw.getUint16(offset + 0, true);
    this.padding = dw.getUint16(offset + 2, true);
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.padding1 = dw.getUint32(offset + 20, true);
    this.targetId = dw.getBigUint64(offset + 24, true);
  }
}
export class FFXIVIpcUpdateHpMpTp extends IpcPacket {
  hp: number;
  mp: number;
  tp_gp: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.hp = dw.getUint32(offset + 0, true);
    this.mp = dw.getUint16(offset + 4, true);
    this.tp_gp = dw.getUint16(offset + 6, true);
  }
}
export class FFXIVIpcEffect extends IpcPacket {
  animationTargetId: bigint;
  actionId: number;
  sequence: number;
  animationLockTime: number;
  someTargetId: number;
  sourceSequence: number;
  rotation: number;
  actionAnimationId: number;
  variation: number;
  effectDisplayType: ActionEffectDisplayType;
  unknown20: number;
  effectCount: number;
  padding_21: number;
  padding_22: number[];
  effects: number[];
  padding_6A: number[];
  effectTargetId: number;
  effectFlags: number;
  padding_78: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.animationTargetId = dw.getBigUint64(offset + 0, true);
    this.actionId = dw.getUint32(offset + 8, true);
    this.sequence = dw.getUint32(offset + 12, true);
    this.animationLockTime = dw.getFloat32(offset + 16, true);
    this.someTargetId = dw.getUint32(offset + 20, true);
    this.sourceSequence = dw.getUint16(offset + 24, true);
    this.rotation = dw.getUint16(offset + 26, true);
    this.actionAnimationId = dw.getUint16(offset + 28, true);
    this.variation = dw.getUint8(offset + 30);
    this.unknown20 = dw.getUint8(offset + 32);
    this.effectCount = dw.getUint8(offset + 33);
    this.padding_21 = dw.getUint16(offset + 34, true);
    this.padding_22 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding_22[i] = dw.getUint16(offset + 36 + i * 2, true);
    }
    this.effects = new Array(64);
    for (let i = 0; i < 64; i++) {
      this.effects[i] = dw.getUint8(offset + 42 + i * 1);
    }
    this.padding_6A = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding_6A[i] = dw.getUint16(offset + 106 + i * 2, true);
    }
    this.effectTargetId = dw.getUint32(offset + 112, true);
    this.effectFlags = dw.getUint32(offset + 116, true);
    this.padding_78 = dw.getUint32(offset + 120, true);
  }
}
export class FFXIVIpcAoeEffect extends IpcPacket {
  animationTargetId: bigint;
  actionId: number;
  globalSequence: number;
  animationLockTime: number;
  someTargetId: number;
  sourceSequence: number;
  rotation: number;
  actionAnimationId: number;
  variation: number;
  effectDisplayType: ActionEffectDisplayType;
  unknown20: number;
  effectCount: number;
  padding_21: number[];
  padding: number;
  entries: EffectEntry[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.animationTargetId = dw.getBigUint64(offset + 0, true);
    this.actionId = dw.getUint32(offset + 8, true);
    this.globalSequence = dw.getUint32(offset + 12, true);
    this.animationLockTime = dw.getFloat32(offset + 16, true);
    this.someTargetId = dw.getUint32(offset + 20, true);
    this.sourceSequence = dw.getUint16(offset + 24, true);
    this.rotation = dw.getUint16(offset + 26, true);
    this.actionAnimationId = dw.getUint16(offset + 28, true);
    this.variation = dw.getUint8(offset + 30);
    this.unknown20 = dw.getUint8(offset + 32);
    this.effectCount = dw.getUint8(offset + 33);
    this.padding_21 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding_21[i] = dw.getUint16(offset + 34 + i * 2, true);
    }
    this.padding = dw.getUint16(offset + 40, true);
    this.entries = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.entries[i] = new EffectEntry(dw, offset + 42 + i * 8);
    }
  }
}
export class FFXIVIpcPlayerSpawn extends IpcPacket {
  title: number;
  u1b: number;
  currentWorldId: number;
  homeWorldId: number;
  gmRank: number;
  u3c: number;
  u4: number;
  onlineStatus: number;
  pose: number;
  u5a: number;
  u5b: number;
  u5c: number;
  targetId: bigint;
  u6: number;
  u7: number;
  mainWeaponModel: bigint;
  secWeaponModel: bigint;
  craftToolModel: bigint;
  u14: number;
  u15: number;
  bNPCBase: number;
  bNPCName: number;
  u18: number;
  u19: number;
  directorId: number;
  ownerId: number;
  u22: number;
  hPMax: number;
  hPCurr: number;
  displayFlags: number;
  fateID: number;
  mPCurr: number;
  mPMax: number;
  unk: number;
  modelChara: number;
  rotation: number;
  currentMount: number;
  activeMinion: number;
  u23: number;
  u24: number;
  u25: number;
  u26: number;
  spawnIndex: number;
  state: number;
  persistentEmote: number;
  modelType: number;
  subtype: number;
  voice: number;
  enemyType: number;
  u27: number;
  level: number;
  classJob: number;
  u28: number;
  u29: number;
  u30: number;
  mountHead: number;
  mountBody: number;
  mountFeet: number;
  mountColor: number;
  scale: number;
  elementData: number[];
  effect: StatusEffect[];
  pos: FFXIVARR_POSITION3;
  models: number[];
  unknown6_58: number[];
  name: number[];
  look: number[];
  fcTag: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.title = dw.getUint16(offset + 0, true);
    this.u1b = dw.getUint16(offset + 2, true);
    this.currentWorldId = dw.getUint16(offset + 4, true);
    this.homeWorldId = dw.getUint16(offset + 6, true);
    this.gmRank = dw.getUint8(offset + 8);
    this.u3c = dw.getUint8(offset + 9);
    this.u4 = dw.getUint8(offset + 10);
    this.onlineStatus = dw.getUint8(offset + 11);
    this.pose = dw.getUint8(offset + 12);
    this.u5a = dw.getUint8(offset + 13);
    this.u5b = dw.getUint8(offset + 14);
    this.u5c = dw.getUint8(offset + 15);
    this.targetId = dw.getBigUint64(offset + 16, true);
    this.u6 = dw.getUint32(offset + 24, true);
    this.u7 = dw.getUint32(offset + 28, true);
    this.mainWeaponModel = dw.getBigUint64(offset + 32, true);
    this.secWeaponModel = dw.getBigUint64(offset + 40, true);
    this.craftToolModel = dw.getBigUint64(offset + 48, true);
    this.u14 = dw.getUint32(offset + 56, true);
    this.u15 = dw.getUint32(offset + 60, true);
    this.bNPCBase = dw.getUint32(offset + 64, true);
    this.bNPCName = dw.getUint32(offset + 68, true);
    this.u18 = dw.getUint32(offset + 72, true);
    this.u19 = dw.getUint32(offset + 76, true);
    this.directorId = dw.getUint32(offset + 80, true);
    this.ownerId = dw.getUint32(offset + 84, true);
    this.u22 = dw.getUint32(offset + 88, true);
    this.hPMax = dw.getUint32(offset + 92, true);
    this.hPCurr = dw.getUint32(offset + 96, true);
    this.displayFlags = dw.getUint32(offset + 100, true);
    this.fateID = dw.getUint16(offset + 104, true);
    this.mPCurr = dw.getUint16(offset + 106, true);
    this.mPMax = dw.getUint16(offset + 108, true);
    this.unk = dw.getUint16(offset + 110, true);
    this.modelChara = dw.getUint16(offset + 112, true);
    this.rotation = dw.getUint16(offset + 114, true);
    this.currentMount = dw.getUint16(offset + 116, true);
    this.activeMinion = dw.getUint16(offset + 118, true);
    this.u23 = dw.getUint8(offset + 120);
    this.u24 = dw.getUint8(offset + 121);
    this.u25 = dw.getUint8(offset + 122);
    this.u26 = dw.getUint8(offset + 123);
    this.spawnIndex = dw.getUint8(offset + 124);
    this.state = dw.getUint8(offset + 125);
    this.persistentEmote = dw.getUint8(offset + 126);
    this.modelType = dw.getUint8(offset + 127);
    this.subtype = dw.getUint8(offset + 128);
    this.voice = dw.getUint8(offset + 129);
    this.enemyType = dw.getUint8(offset + 130);
    this.u27 = dw.getUint8(offset + 131);
    this.level = dw.getUint8(offset + 132);
    this.classJob = dw.getUint8(offset + 133);
    this.u28 = dw.getUint8(offset + 134);
    this.u29 = dw.getUint8(offset + 135);
    this.u30 = dw.getUint8(offset + 136);
    this.mountHead = dw.getUint8(offset + 137);
    this.mountBody = dw.getUint8(offset + 138);
    this.mountFeet = dw.getUint8(offset + 139);
    this.mountColor = dw.getUint8(offset + 140);
    this.scale = dw.getUint8(offset + 141);
    this.elementData = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.elementData[i] = dw.getUint8(offset + 142 + i * 1);
    }
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 148 + i * 12);
    }
    this.pos = new FFXIVARR_POSITION3(dw, offset + 508);
    this.models = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.models[i] = dw.getUint32(offset + 520 + i * 4, true);
    }
    this.unknown6_58 = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.unknown6_58[i] = dw.getUint8(offset + 560 + i * 1);
    }
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 570 + i * 1);
    }
    this.look = new Array(26);
    for (let i = 0; i < 26; i++) {
      this.look[i] = dw.getUint8(offset + 602 + i * 1);
    }
    this.fcTag = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.fcTag[i] = dw.getInt8(offset + 628 + i * 1);
    }
    this.padding = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.padding[i] = dw.getUint8(offset + 634 + i * 1);
    }
  }
}
export class FFXIVIpcNpcSpawn extends IpcPacket {
  gimmickId: number;
  u2b: number;
  u2ab: number;
  gmRank: number;
  u3b: number;
  aggressionMode: number;
  onlineStatus: number;
  u3c: number;
  pose: number;
  u4: number;
  targetId: bigint;
  u6: number;
  u7: number;
  mainWeaponModel: bigint;
  secWeaponModel: bigint;
  craftToolModel: bigint;
  u14: number;
  u15: number;
  bNPCBase: number;
  bNPCName: number;
  levelId: number;
  u19: number;
  directorId: number;
  spawnerId: number;
  parentActorId: number;
  hPMax: number;
  hPCurr: number;
  displayFlags: number;
  fateID: number;
  mPCurr: number;
  unknown1: number;
  unknown2: number;
  modelChara: number;
  rotation: number;
  currentMount: number;
  activeMinion: number;
  u23: number;
  u24: number;
  u6_58a: number;
  u6_58b: number;
  spawnIndex: number;
  state: number;
  persistantEmote: number;
  modelType: number;
  subtype: number;
  voice: number;
  u25c: number;
  enemyType: number;
  level: number;
  classJob: number;
  u26: number;
  u27: number;
  u28: number;
  mountHead: number;
  mountBody: number;
  mountFeet: number;
  mountColor: number;
  scale: number;
  elemental: number[];
  effect: StatusEffect[];
  pos: FFXIVARR_POSITION3;
  models: number[];
  unknown6_58: number[];
  name: number[];
  look: number[];
  fcTag: number[];
  unk30: number;
  unk31: number;
  bNPCPartSlot: number;
  unk32: number;
  unk33: number;
  unk34: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.gimmickId = dw.getUint32(offset + 0, true);
    this.u2b = dw.getUint8(offset + 4);
    this.u2ab = dw.getUint8(offset + 5);
    this.gmRank = dw.getUint8(offset + 6);
    this.u3b = dw.getUint8(offset + 7);
    this.aggressionMode = dw.getUint8(offset + 8);
    this.onlineStatus = dw.getUint8(offset + 9);
    this.u3c = dw.getUint8(offset + 10);
    this.pose = dw.getUint8(offset + 11);
    this.u4 = dw.getUint32(offset + 12, true);
    this.targetId = dw.getBigUint64(offset + 16, true);
    this.u6 = dw.getUint32(offset + 24, true);
    this.u7 = dw.getUint32(offset + 28, true);
    this.mainWeaponModel = dw.getBigUint64(offset + 32, true);
    this.secWeaponModel = dw.getBigUint64(offset + 40, true);
    this.craftToolModel = dw.getBigUint64(offset + 48, true);
    this.u14 = dw.getUint32(offset + 56, true);
    this.u15 = dw.getUint32(offset + 60, true);
    this.bNPCBase = dw.getUint32(offset + 64, true);
    this.bNPCName = dw.getUint32(offset + 68, true);
    this.levelId = dw.getUint32(offset + 72, true);
    this.u19 = dw.getUint32(offset + 76, true);
    this.directorId = dw.getUint32(offset + 80, true);
    this.spawnerId = dw.getUint32(offset + 84, true);
    this.parentActorId = dw.getUint32(offset + 88, true);
    this.hPMax = dw.getUint32(offset + 92, true);
    this.hPCurr = dw.getUint32(offset + 96, true);
    this.displayFlags = dw.getUint32(offset + 100, true);
    this.fateID = dw.getUint16(offset + 104, true);
    this.mPCurr = dw.getUint16(offset + 106, true);
    this.unknown1 = dw.getUint16(offset + 108, true);
    this.unknown2 = dw.getUint16(offset + 110, true);
    this.modelChara = dw.getUint16(offset + 112, true);
    this.rotation = dw.getUint16(offset + 114, true);
    this.currentMount = dw.getUint16(offset + 116, true);
    this.activeMinion = dw.getUint16(offset + 118, true);
    this.u23 = dw.getUint8(offset + 120);
    this.u24 = dw.getUint8(offset + 121);
    this.u6_58a = dw.getUint8(offset + 122);
    this.u6_58b = dw.getUint8(offset + 123);
    this.spawnIndex = dw.getUint8(offset + 124);
    this.state = dw.getUint8(offset + 125);
    this.persistantEmote = dw.getUint8(offset + 126);
    this.modelType = dw.getUint8(offset + 127);
    this.subtype = dw.getUint8(offset + 128);
    this.voice = dw.getUint8(offset + 129);
    this.u25c = dw.getUint8(offset + 130);
    this.enemyType = dw.getUint8(offset + 131);
    this.level = dw.getUint8(offset + 132);
    this.classJob = dw.getUint8(offset + 133);
    this.u26 = dw.getUint8(offset + 134);
    this.u27 = dw.getUint8(offset + 135);
    this.u28 = dw.getUint8(offset + 136);
    this.mountHead = dw.getUint8(offset + 137);
    this.mountBody = dw.getUint8(offset + 138);
    this.mountFeet = dw.getUint8(offset + 139);
    this.mountColor = dw.getUint8(offset + 140);
    this.scale = dw.getUint8(offset + 141);
    this.elemental = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.elemental[i] = dw.getUint8(offset + 142 + i * 1);
    }
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 148 + i * 12);
    }
    this.pos = new FFXIVARR_POSITION3(dw, offset + 508);
    this.models = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.models[i] = dw.getUint32(offset + 520 + i * 4, true);
    }
    this.unknown6_58 = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.unknown6_58[i] = dw.getUint8(offset + 560 + i * 1);
    }
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 570 + i * 1);
    }
    this.look = new Array(26);
    for (let i = 0; i < 26; i++) {
      this.look[i] = dw.getUint8(offset + 602 + i * 1);
    }
    this.fcTag = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.fcTag[i] = dw.getInt8(offset + 628 + i * 1);
    }
    this.unk30 = dw.getUint32(offset + 634, true);
    this.unk31 = dw.getUint32(offset + 638, true);
    this.bNPCPartSlot = dw.getUint8(offset + 642);
    this.unk32 = dw.getUint8(offset + 643);
    this.unk33 = dw.getUint16(offset + 644, true);
    this.unk34 = dw.getUint16(offset + 646, true);
  }
}
export class FFXIVIpcActorFreeSpawn extends IpcPacket {
  spawnId: number;
  actorId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.spawnId = dw.getUint32(offset + 0, true);
    this.actorId = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcActorMove extends IpcPacket {
  headRotation: number;
  rotation: number;
  animationType: number;
  animationState: number;
  animationSpeed: number;
  unknownRotation: number;
  posX: number;
  posY: number;
  posZ: number;
  unknown_12: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.headRotation = dw.getUint8(offset + 0);
    this.rotation = dw.getUint8(offset + 1);
    this.animationType = dw.getUint8(offset + 2);
    this.animationState = dw.getUint8(offset + 3);
    this.animationSpeed = dw.getUint8(offset + 4);
    this.unknownRotation = dw.getUint8(offset + 5);
    this.posX = dw.getUint16(offset + 6, true);
    this.posY = dw.getUint16(offset + 8, true);
    this.posZ = dw.getUint16(offset + 10, true);
    this.unknown_12 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcActorSetPos extends IpcPacket {
  r16: number;
  waitForLoad: number;
  unknown1: number;
  unknown2: number;
  x: number;
  y: number;
  z: number;
  unknown3: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.r16 = dw.getUint16(offset + 0, true);
    this.waitForLoad = dw.getUint8(offset + 2);
    this.unknown1 = dw.getUint8(offset + 3);
    this.unknown2 = dw.getUint32(offset + 4, true);
    this.x = dw.getFloat32(offset + 8, true);
    this.y = dw.getFloat32(offset + 12, true);
    this.z = dw.getFloat32(offset + 16, true);
    this.unknown3 = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcActorCast extends IpcPacket {
  action_id: number;
  skillType: SkillType;
  unknown: number;
  unknown_1: number;
  cast_time: number;
  target_id: number;
  rotation: number;
  flag: number;
  unknown_2: number;
  posX: number;
  posY: number;
  posZ: number;
  unknown_3: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.action_id = dw.getUint16(offset + 0, true);
    this.unknown = dw.getUint8(offset + 3);
    this.unknown_1 = dw.getUint32(offset + 4, true);
    this.cast_time = dw.getFloat32(offset + 8, true);
    this.target_id = dw.getUint32(offset + 12, true);
    this.rotation = dw.getUint16(offset + 16, true);
    this.flag = dw.getUint16(offset + 18, true);
    this.unknown_2 = dw.getUint32(offset + 20, true);
    this.posX = dw.getUint16(offset + 24, true);
    this.posY = dw.getUint16(offset + 26, true);
    this.posZ = dw.getUint16(offset + 28, true);
    this.unknown_3 = dw.getUint16(offset + 30, true);
  }
}
export class FFXIVIpcHateList extends IpcPacket {
  numEntries: number;
  actorId: number;
  hatePercent: number;
  unknown: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.numEntries = dw.getUint32(offset + 0, true);
    this.actorId = dw.getUint32(offset + 4, true);
    this.hatePercent = dw.getUint8(offset + 8);
    this.unknown = dw.getUint8(offset + 9);
    this.padding = dw.getUint16(offset + 10, true);
  }
}
export class FFXIVIpcHateRank extends IpcPacket {
  numEntries: number;
  actorId: number;
  hateAmount: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.numEntries = dw.getUint32(offset + 0, true);
    this.actorId = dw.getUint32(offset + 4, true);
    this.hateAmount = dw.getUint32(offset + 8, true);
  }
}
export class FFXIVIpcUpdateClassInfo extends IpcPacket {
  classId: number;
  level1: number;
  level: number;
  nextLevelIndex: number;
  currentExp: number;
  restedExp: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.classId = dw.getUint8(offset + 0);
    this.level1 = dw.getUint8(offset + 1);
    this.level = dw.getUint16(offset + 2, true);
    this.nextLevelIndex = dw.getUint32(offset + 4, true);
    this.currentExp = dw.getUint32(offset + 8, true);
    this.restedExp = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcPlayerTitleList extends IpcPacket {
  titleList: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.titleList = new Array(48);
    for (let i = 0; i < 48; i++) {
      this.titleList[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcInitZone extends IpcPacket {
  serverId: number;
  zoneId: number;
  zoneIndex: number;
  contentfinderConditionId: number;
  layerSetId: number;
  layoutId: number;
  weatherId: number;
  bitmask: number;
  bitmask1: number;
  unknown5: number;
  unknown8: number;
  festivalId: number;
  additionalFestivalId: number;
  unknown9: number[];
  unknown10: number;
  unknown11: number;
  unknown12: number[];
  unknown13: number[];
  pos: FFXIVARR_POSITION3;
  unknown14: number[];
  unknown15: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.serverId = dw.getUint16(offset + 0, true);
    this.zoneId = dw.getUint16(offset + 2, true);
    this.zoneIndex = dw.getUint16(offset + 4, true);
    this.contentfinderConditionId = dw.getUint16(offset + 6, true);
    this.layerSetId = dw.getUint32(offset + 8, true);
    this.layoutId = dw.getUint32(offset + 12, true);
    this.weatherId = dw.getUint8(offset + 16);
    this.bitmask = dw.getUint8(offset + 17);
    this.bitmask1 = dw.getUint8(offset + 18);
    this.unknown5 = dw.getUint8(offset + 19);
    this.unknown8 = dw.getUint32(offset + 20, true);
    this.festivalId = dw.getUint16(offset + 24, true);
    this.additionalFestivalId = dw.getUint16(offset + 26, true);
    this.unknown9 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown9[i] = dw.getUint32(offset + 28 + i * 4, true);
    }
    this.unknown10 = dw.getUint32(offset + 36, true);
    this.unknown11 = dw.getUint32(offset + 40, true);
    this.unknown12 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unknown12[i] = dw.getUint32(offset + 44 + i * 4, true);
    }
    this.unknown13 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.unknown13[i] = dw.getUint32(offset + 60 + i * 4, true);
    }
    this.pos = new FFXIVARR_POSITION3(dw, offset + 72);
    this.unknown14 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.unknown14[i] = dw.getUint32(offset + 84 + i * 4, true);
    }
    this.unknown15 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown15[i] = dw.getUint32(offset + 96 + i * 4, true);
    }
  }
}
export class FFXIVIpcPlayerSetup extends IpcPacket {
  contentId: bigint;
  crest: bigint;
  unknown10: bigint;
  charId: number;
  restedExp: number;
  companionCurrentExp: number;
  unknown1C: number;
  fishCaught: number;
  useBaitCatalogId: number;
  spearfishCaught: number;
  unknownPvp2C: number;
  unknown2E: number;
  pvpFrontlineOverallCampaigns: number;
  squadronMissionFinishAt: number;
  squadronTrainingFinishAt: number;
  wondrousTailsStatus: number[];
  wondrousTailsFlags: number;
  unknown44: number;
  companionTimePassed: number;
  unknown4C: number;
  unknown50: number;
  unknownPvp52: number[];
  pvpSeriesExp: number;
  playerCommendations: number;
  unknown64: number[];
  pvpFrontlineWeeklyMatches: number;
  unknown68: number;
  activeGrandCompanyExpedition: number;
  activeGrandCompanyTraining: number;
  unknown6E: number;
  wondrousTailsCompleted: number;
  pvpRivalWingsTotalMatches: number;
  pvpRivalWingsTotalVictories: number;
  pvpRivalWingsWeeklyMatches: number;
  pvpRivalWingsWeeklyVictories: number;
  maxLevel: number;
  expansion: number;
  premiumSaddlebag: number;
  unknown77: number;
  unknown78: number;
  race: number;
  tribe: number;
  gender: number;
  currentJob: number;
  currentClass: number;
  deity: number;
  namedayMonth: number;
  namedayDay: number;
  cityState: number;
  homepoint: number;
  questSpecialFlags: number;
  petData: number;
  companionRank: number;
  companionStars: number;
  companionSp: number;
  companionActiveCommand: number;
  companionColor: number;
  companionFavFeed: number;
  favAetheryteCount: number;
  dailyQuestSeed: number;
  unknown97: number;
  weeklyLockoutInfo: number;
  relicId: number;
  relicNoteId: number;
  sightseeing21To80Unlock: number;
  sightseeingHeavenswardUnlock: number;
  unknown9E: number[];
  exp: number[];
  pvpTotalExp: number;
  unknownPvp124: number;
  pvpExp: number;
  pvpFrontlineOverallRanks: number[];
  unknown138: number[];
  levels: number[];
  activeFestivalIds: number[];
  activeFestivalPhases: number[];
  unknown194: number[];
  beastReputationValue: number[];
  questManagerUnknown: number[];
  supplySatisfaction: number[];
  companionName: number[];
  companionDefRank: number;
  companionAttRank: number;
  companionHealRank: number;
  mountGuideMask: number[];
  ornamentMask: number[];
  glassesStylesMask: number[];
  framerKitsMask: number[];
  name: number[];
  unknown293: number[];
  unknown2A3: number[];
  unlockBitmask: number[];
  aetheryte: number[];
  favoriteAetheryteIds: number[];
  freeAetheryteId: number;
  psPlusFreeAetheryteId: number;
  discovery: number[];
  howto: number[];
  minions: number[];
  chocoboTaxiMask: number[];
  watchedCutscenes: number[];
  companionBardingMask: number[];
  companionEquippedHead: number;
  companionEquippedBody: number;
  companionEquippedLegs: number;
  unknown73d: number;
  unknown741: number[];
  caughtFishes: number[];
  unlockedFishingSpots: number[];
  caughtSpearfish: number[];
  unlockedSpearfishingSpots: number[];
  rankGrandCompany: number[];
  beastReputationRank: number[];
  contentRouletteCompletion: number[];
  unknown6f7: number[];
  pose: number[];
  playerStateFlags: number[];
  contentsNoteCompletionFlags: number[];
  secretRecipeBookMask: number[];
  unknownMask879: number[];
  relicCompletion: number[];
  sightseeingMask: number[];
  huntingMarkMask: number[];
  tripleTriadCards: number[];
  unknown895: number;
  unknown7D7: number[];
  unknown7D8: number;
  aetherCurrentCompeleteSet2: number[];
  aetherCurrentMask: number[];
  regionalFolkloreMask: number[];
  orchestrionMask: number[];
  hallOfNoviceCompletion: number[];
  animaCompletion: number[];
  wondrousTailsOrder: number[];
  wondrousTailsReward: number[];
  supplySatisfactionRanks: number[];
  usedSupplyAllowances: number[];
  unknownA7A: number;
  unlockedRaids: number[];
  unlockedDungeons: number[];
  unlockedGuildhests: number[];
  unlockedTrials: number[];
  unlockedPvp: number[];
  pvpPadding: number[];
  clearedRaids: number[];
  clearedDungeons: number[];
  clearedGuildhests: number[];
  clearedTrials: number[];
  clearedPvp: number[];
  clearedPvpPadding: number[];
  unknown948: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.crest = dw.getBigUint64(offset + 8, true);
    this.unknown10 = dw.getBigUint64(offset + 16, true);
    this.charId = dw.getUint32(offset + 24, true);
    this.restedExp = dw.getUint32(offset + 28, true);
    this.companionCurrentExp = dw.getUint32(offset + 32, true);
    this.unknown1C = dw.getUint32(offset + 36, true);
    this.fishCaught = dw.getUint32(offset + 40, true);
    this.useBaitCatalogId = dw.getUint32(offset + 44, true);
    this.spearfishCaught = dw.getUint32(offset + 48, true);
    this.unknownPvp2C = dw.getUint16(offset + 52, true);
    this.unknown2E = dw.getUint16(offset + 54, true);
    this.pvpFrontlineOverallCampaigns = dw.getUint32(offset + 56, true);
    this.squadronMissionFinishAt = dw.getUint32(offset + 60, true);
    this.squadronTrainingFinishAt = dw.getUint32(offset + 64, true);
    this.wondrousTailsStatus = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.wondrousTailsStatus[i] = dw.getUint8(offset + 68 + i * 1);
    }
    this.wondrousTailsFlags = dw.getUint32(offset + 72, true);
    this.unknown44 = dw.getUint32(offset + 76, true);
    this.companionTimePassed = dw.getFloat32(offset + 80, true);
    this.unknown4C = dw.getUint32(offset + 84, true);
    this.unknown50 = dw.getUint16(offset + 88, true);
    this.unknownPvp52 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unknownPvp52[i] = dw.getUint16(offset + 90 + i * 2, true);
    }
    this.pvpSeriesExp = dw.getUint16(offset + 98, true);
    this.playerCommendations = dw.getUint16(offset + 100, true);
    this.unknown64 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown64[i] = dw.getUint16(offset + 102 + i * 2, true);
    }
    this.pvpFrontlineWeeklyMatches = dw.getUint16(offset + 106, true);
    this.unknown68 = dw.getUint16(offset + 108, true);
    this.activeGrandCompanyExpedition = dw.getUint16(offset + 110, true);
    this.activeGrandCompanyTraining = dw.getUint16(offset + 112, true);
    this.unknown6E = dw.getUint16(offset + 114, true);
    this.wondrousTailsCompleted = dw.getUint16(offset + 116, true);
    this.pvpRivalWingsTotalMatches = dw.getUint16(offset + 118, true);
    this.pvpRivalWingsTotalVictories = dw.getUint16(offset + 120, true);
    this.pvpRivalWingsWeeklyMatches = dw.getUint16(offset + 122, true);
    this.pvpRivalWingsWeeklyVictories = dw.getUint16(offset + 124, true);
    this.maxLevel = dw.getUint8(offset + 126);
    this.expansion = dw.getUint8(offset + 127);
    this.premiumSaddlebag = dw.getUint8(offset + 128);
    this.unknown77 = dw.getUint8(offset + 129);
    this.unknown78 = dw.getUint8(offset + 130);
    this.race = dw.getUint8(offset + 131);
    this.tribe = dw.getUint8(offset + 132);
    this.gender = dw.getUint8(offset + 133);
    this.currentJob = dw.getUint8(offset + 134);
    this.currentClass = dw.getUint8(offset + 135);
    this.deity = dw.getUint8(offset + 136);
    this.namedayMonth = dw.getUint8(offset + 137);
    this.namedayDay = dw.getUint8(offset + 138);
    this.cityState = dw.getUint8(offset + 139);
    this.homepoint = dw.getUint16(offset + 140, true);
    this.questSpecialFlags = dw.getUint8(offset + 142);
    this.petData = dw.getUint8(offset + 143);
    this.companionRank = dw.getUint8(offset + 144);
    this.companionStars = dw.getUint8(offset + 145);
    this.companionSp = dw.getUint8(offset + 146);
    this.companionActiveCommand = dw.getUint8(offset + 147);
    this.companionColor = dw.getUint8(offset + 148);
    this.companionFavFeed = dw.getUint8(offset + 149);
    this.favAetheryteCount = dw.getUint8(offset + 150);
    this.dailyQuestSeed = dw.getUint8(offset + 151);
    this.unknown97 = dw.getUint8(offset + 152);
    this.weeklyLockoutInfo = dw.getUint8(offset + 153);
    this.relicId = dw.getUint8(offset + 154);
    this.relicNoteId = dw.getUint8(offset + 155);
    this.sightseeing21To80Unlock = dw.getUint8(offset + 156);
    this.sightseeingHeavenswardUnlock = dw.getUint8(offset + 157);
    this.unknown9E = new Array(26);
    for (let i = 0; i < 26; i++) {
      this.unknown9E[i] = dw.getUint8(offset + 158 + i * 1);
    }
    this.exp = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.exp[i] = dw.getUint32(offset + 184 + i * 4, true);
    }
    this.pvpTotalExp = dw.getUint32(offset + 312, true);
    this.unknownPvp124 = dw.getUint32(offset + 316, true);
    this.pvpExp = dw.getUint32(offset + 320, true);
    this.pvpFrontlineOverallRanks = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.pvpFrontlineOverallRanks[i] = dw.getUint32(offset + 324 + i * 4, true);
    }
    this.unknown138 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unknown138[i] = dw.getUint32(offset + 336 + i * 4, true);
    }
    this.levels = new Array(35);
    for (let i = 0; i < 35; i++) {
      this.levels[i] = dw.getUint16(offset + 352 + i * 2, true);
    }
    this.activeFestivalIds = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.activeFestivalIds[i] = dw.getUint16(offset + 422 + i * 2, true);
    }
    this.activeFestivalPhases = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.activeFestivalPhases[i] = dw.getUint16(offset + 430 + i * 2, true);
    }
    this.unknown194 = new Array(176);
    for (let i = 0; i < 176; i++) {
      this.unknown194[i] = dw.getUint8(offset + 438 + i * 1);
    }
    this.beastReputationValue = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.beastReputationValue[i] = dw.getUint16(offset + 614 + i * 2, true);
    }
    this.questManagerUnknown = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.questManagerUnknown[i] = dw.getUint16(offset + 654 + i * 2, true);
    }
    this.supplySatisfaction = new Array(11);
    for (let i = 0; i < 11; i++) {
      this.supplySatisfaction[i] = dw.getUint16(offset + 670 + i * 2, true);
    }
    this.companionName = new Array(21);
    for (let i = 0; i < 21; i++) {
      this.companionName[i] = dw.getInt8(offset + 692 + i * 1);
    }
    this.companionDefRank = dw.getUint8(offset + 713);
    this.companionAttRank = dw.getUint8(offset + 714);
    this.companionHealRank = dw.getUint8(offset + 715);
    this.mountGuideMask = new Array(41);
    for (let i = 0; i < 41; i++) {
      this.mountGuideMask[i] = dw.getUint8(offset + 716 + i * 1);
    }
    this.ornamentMask = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.ornamentMask[i] = dw.getUint8(offset + 757 + i * 1);
    }
    this.glassesStylesMask = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.glassesStylesMask[i] = dw.getUint8(offset + 765 + i * 1);
    }
    this.framerKitsMask = new Array(33);
    for (let i = 0; i < 33; i++) {
      this.framerKitsMask[i] = dw.getUint8(offset + 770 + i * 1);
    }
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 803 + i * 1);
    }
    this.unknown293 = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.unknown293[i] = dw.getUint8(offset + 835 + i * 1);
    }
    this.unknown2A3 = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.unknown2A3[i] = dw.getUint8(offset + 851 + i * 1);
    }
    this.unlockBitmask = new Array(92);
    for (let i = 0; i < 92; i++) {
      this.unlockBitmask[i] = dw.getUint8(offset + 867 + i * 1);
    }
    this.aetheryte = new Array(31);
    for (let i = 0; i < 31; i++) {
      this.aetheryte[i] = dw.getUint8(offset + 959 + i * 1);
    }
    this.favoriteAetheryteIds = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.favoriteAetheryteIds[i] = dw.getUint16(offset + 990 + i * 2, true);
    }
    this.freeAetheryteId = dw.getUint16(offset + 998, true);
    this.psPlusFreeAetheryteId = dw.getUint16(offset + 1000, true);
    this.discovery = new Array(508);
    for (let i = 0; i < 508; i++) {
      this.discovery[i] = dw.getUint8(offset + 1002 + i * 1);
    }
    this.howto = new Array(37);
    for (let i = 0; i < 37; i++) {
      this.howto[i] = dw.getUint8(offset + 1510 + i * 1);
    }
    this.minions = new Array(71);
    for (let i = 0; i < 71; i++) {
      this.minions[i] = dw.getUint8(offset + 1547 + i * 1);
    }
    this.chocoboTaxiMask = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.chocoboTaxiMask[i] = dw.getUint8(offset + 1618 + i * 1);
    }
    this.watchedCutscenes = new Array(174);
    for (let i = 0; i < 174; i++) {
      this.watchedCutscenes[i] = dw.getUint8(offset + 1630 + i * 1);
    }
    this.companionBardingMask = new Array(14);
    for (let i = 0; i < 14; i++) {
      this.companionBardingMask[i] = dw.getUint8(offset + 1804 + i * 1);
    }
    this.companionEquippedHead = dw.getUint8(offset + 1818);
    this.companionEquippedBody = dw.getUint8(offset + 1819);
    this.companionEquippedLegs = dw.getUint8(offset + 1820);
    this.unknown73d = dw.getUint32(offset + 1821, true);
    this.unknown741 = new Array(11);
    for (let i = 0; i < 11; i++) {
      this.unknown741[i] = dw.getUint8(offset + 1825 + i * 1);
    }
    this.caughtFishes = new Array(182);
    for (let i = 0; i < 182; i++) {
      this.caughtFishes[i] = dw.getUint8(offset + 1836 + i * 1);
    }
    this.unlockedFishingSpots = new Array(42);
    for (let i = 0; i < 42; i++) {
      this.unlockedFishingSpots[i] = dw.getUint8(offset + 2018 + i * 1);
    }
    this.caughtSpearfish = new Array(38);
    for (let i = 0; i < 38; i++) {
      this.caughtSpearfish[i] = dw.getUint8(offset + 2060 + i * 1);
    }
    this.unlockedSpearfishingSpots = new Array(9);
    for (let i = 0; i < 9; i++) {
      this.unlockedSpearfishingSpots[i] = dw.getUint8(offset + 2098 + i * 1);
    }
    this.rankGrandCompany = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.rankGrandCompany[i] = dw.getUint8(offset + 2107 + i * 1);
    }
    this.beastReputationRank = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.beastReputationRank[i] = dw.getUint8(offset + 2110 + i * 1);
    }
    this.contentRouletteCompletion = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.contentRouletteCompletion[i] = dw.getUint8(offset + 2130 + i * 1);
    }
    this.unknown6f7 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown6f7[i] = dw.getUint8(offset + 2140 + i * 1);
    }
    this.pose = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.pose[i] = dw.getUint8(offset + 2142 + i * 1);
    }
    this.playerStateFlags = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.playerStateFlags[i] = dw.getUint8(offset + 2149 + i * 1);
    }
    this.contentsNoteCompletionFlags = new Array(13);
    for (let i = 0; i < 13; i++) {
      this.contentsNoteCompletionFlags[i] = dw.getUint8(offset + 2152 + i * 1);
    }
    this.secretRecipeBookMask = new Array(14);
    for (let i = 0; i < 14; i++) {
      this.secretRecipeBookMask[i] = dw.getUint8(offset + 2165 + i * 1);
    }
    this.unknownMask879 = new Array(28);
    for (let i = 0; i < 28; i++) {
      this.unknownMask879[i] = dw.getUint8(offset + 2179 + i * 1);
    }
    this.relicCompletion = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.relicCompletion[i] = dw.getUint8(offset + 2207 + i * 1);
    }
    this.sightseeingMask = new Array(43);
    for (let i = 0; i < 43; i++) {
      this.sightseeingMask[i] = dw.getUint8(offset + 2219 + i * 1);
    }
    this.huntingMarkMask = new Array(124);
    for (let i = 0; i < 124; i++) {
      this.huntingMarkMask[i] = dw.getUint8(offset + 2262 + i * 1);
    }
    this.tripleTriadCards = new Array(57);
    for (let i = 0; i < 57; i++) {
      this.tripleTriadCards[i] = dw.getUint8(offset + 2386 + i * 1);
    }
    this.unknown895 = dw.getUint8(offset + 2443);
    this.unknown7D7 = new Array(15);
    for (let i = 0; i < 15; i++) {
      this.unknown7D7[i] = dw.getUint8(offset + 2444 + i * 1);
    }
    this.unknown7D8 = dw.getUint8(offset + 2459);
    this.aetherCurrentCompeleteSet2 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.aetherCurrentCompeleteSet2[i] = dw.getUint8(offset + 2460 + i * 1);
    }
    this.aetherCurrentMask = new Array(56);
    for (let i = 0; i < 56; i++) {
      this.aetherCurrentMask[i] = dw.getUint8(offset + 2463 + i * 1);
    }
    this.regionalFolkloreMask = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.regionalFolkloreMask[i] = dw.getUint8(offset + 2519 + i * 1);
    }
    this.orchestrionMask = new Array(99);
    for (let i = 0; i < 99; i++) {
      this.orchestrionMask[i] = dw.getUint8(offset + 2525 + i * 1);
    }
    this.hallOfNoviceCompletion = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.hallOfNoviceCompletion[i] = dw.getUint8(offset + 2624 + i * 1);
    }
    this.animaCompletion = new Array(11);
    for (let i = 0; i < 11; i++) {
      this.animaCompletion[i] = dw.getUint8(offset + 2629 + i * 1);
    }
    this.wondrousTailsOrder = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.wondrousTailsOrder[i] = dw.getUint8(offset + 2640 + i * 1);
    }
    this.wondrousTailsReward = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.wondrousTailsReward[i] = dw.getUint8(offset + 2656 + i * 1);
    }
    this.supplySatisfactionRanks = new Array(11);
    for (let i = 0; i < 11; i++) {
      this.supplySatisfactionRanks[i] = dw.getUint8(offset + 2660 + i * 1);
    }
    this.usedSupplyAllowances = new Array(11);
    for (let i = 0; i < 11; i++) {
      this.usedSupplyAllowances[i] = dw.getUint8(offset + 2671 + i * 1);
    }
    this.unknownA7A = dw.getUint8(offset + 2682);
    this.unlockedRaids = new Array(28);
    for (let i = 0; i < 28; i++) {
      this.unlockedRaids[i] = dw.getUint8(offset + 2683 + i * 1);
    }
    this.unlockedDungeons = new Array(18);
    for (let i = 0; i < 18; i++) {
      this.unlockedDungeons[i] = dw.getUint8(offset + 2711 + i * 1);
    }
    this.unlockedGuildhests = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.unlockedGuildhests[i] = dw.getUint8(offset + 2729 + i * 1);
    }
    this.unlockedTrials = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.unlockedTrials[i] = dw.getUint8(offset + 2739 + i * 1);
    }
    this.unlockedPvp = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.unlockedPvp[i] = dw.getUint8(offset + 2751 + i * 1);
    }
    this.pvpPadding = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pvpPadding[i] = dw.getUint8(offset + 2756 + i * 1);
    }
    this.clearedRaids = new Array(28);
    for (let i = 0; i < 28; i++) {
      this.clearedRaids[i] = dw.getUint8(offset + 2758 + i * 1);
    }
    this.clearedDungeons = new Array(18);
    for (let i = 0; i < 18; i++) {
      this.clearedDungeons[i] = dw.getUint8(offset + 2786 + i * 1);
    }
    this.clearedGuildhests = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.clearedGuildhests[i] = dw.getUint8(offset + 2804 + i * 1);
    }
    this.clearedTrials = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.clearedTrials[i] = dw.getUint8(offset + 2814 + i * 1);
    }
    this.clearedPvp = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.clearedPvp[i] = dw.getUint8(offset + 2826 + i * 1);
    }
    this.clearedPvpPadding = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.clearedPvpPadding[i] = dw.getUint8(offset + 2831 + i * 1);
    }
    this.unknown948 = new Array(15);
    for (let i = 0; i < 15; i++) {
      this.unknown948[i] = dw.getUint8(offset + 2833 + i * 1);
    }
  }
}
export class FFXIVIpcPlayerStats extends IpcPacket {
  strength: number;
  dexterity: number;
  vitality: number;
  intelligence: number;
  mind: number;
  piety: number;
  hp: number;
  mp: number;
  tp: number;
  gp: number;
  cp: number;
  delay: number;
  tenacity: number;
  attackPower: number;
  defense: number;
  directHitRate: number;
  evasion: number;
  magicDefense: number;
  criticalHit: number;
  attackMagicPotency: number;
  healingMagicPotency: number;
  elementalBonus: number;
  determination: number;
  skillSpeed: number;
  spellSpeed: number;
  haste: number;
  craftsmanship: number;
  control: number;
  gathering: number;
  perception: number;
  unknown: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.strength = dw.getUint32(offset + 0, true);
    this.dexterity = dw.getUint32(offset + 4, true);
    this.vitality = dw.getUint32(offset + 8, true);
    this.intelligence = dw.getUint32(offset + 12, true);
    this.mind = dw.getUint32(offset + 16, true);
    this.piety = dw.getUint32(offset + 20, true);
    this.hp = dw.getUint32(offset + 24, true);
    this.mp = dw.getUint32(offset + 28, true);
    this.tp = dw.getUint32(offset + 32, true);
    this.gp = dw.getUint32(offset + 36, true);
    this.cp = dw.getUint32(offset + 40, true);
    this.delay = dw.getUint32(offset + 44, true);
    this.tenacity = dw.getUint32(offset + 48, true);
    this.attackPower = dw.getUint32(offset + 52, true);
    this.defense = dw.getUint32(offset + 56, true);
    this.directHitRate = dw.getUint32(offset + 60, true);
    this.evasion = dw.getUint32(offset + 64, true);
    this.magicDefense = dw.getUint32(offset + 68, true);
    this.criticalHit = dw.getUint32(offset + 72, true);
    this.attackMagicPotency = dw.getUint32(offset + 76, true);
    this.healingMagicPotency = dw.getUint32(offset + 80, true);
    this.elementalBonus = dw.getUint32(offset + 84, true);
    this.determination = dw.getUint32(offset + 88, true);
    this.skillSpeed = dw.getUint32(offset + 92, true);
    this.spellSpeed = dw.getUint32(offset + 96, true);
    this.haste = dw.getUint32(offset + 100, true);
    this.craftsmanship = dw.getUint32(offset + 104, true);
    this.control = dw.getUint32(offset + 108, true);
    this.gathering = dw.getUint32(offset + 112, true);
    this.perception = dw.getUint32(offset + 116, true);
    this.unknown = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.unknown[i] = dw.getUint32(offset + 120 + i * 4, true);
    }
  }
}
export class FFXIVIpcActorOwner extends IpcPacket {
  type: number;
  padding: number[];
  actorId: number;
  actorId2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.type = dw.getUint8(offset + 0);
    this.padding = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding[i] = dw.getUint8(offset + 1 + i * 1);
    }
    this.actorId = dw.getUint32(offset + 8, true);
    this.actorId2 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcPlayerStateFlags extends IpcPacket {
  flags: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.flags = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.flags[i] = dw.getUint8(offset + 0 + i * 1);
    }
    this.padding = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcPlayerClassInfo extends IpcPacket {
  classId: number;
  unknown: number;
  isSpecialist: number;
  syncedLevel: number;
  classLevel: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.classId = dw.getUint16(offset + 0, true);
    this.unknown = dw.getUint8(offset + 2);
    this.isSpecialist = dw.getUint8(offset + 3);
    this.syncedLevel = dw.getUint16(offset + 4, true);
    this.classLevel = dw.getUint16(offset + 6, true);
  }
}
export class FFXIVIpcModelEquip extends IpcPacket {
  mainWeapon: bigint;
  offWeapon: bigint;
  unk1: number;
  classJobId: number;
  level: number;
  unk2: number;
  models: number[];
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.mainWeapon = dw.getBigUint64(offset + 0, true);
    this.offWeapon = dw.getBigUint64(offset + 8, true);
    this.unk1 = dw.getUint8(offset + 16);
    this.classJobId = dw.getUint8(offset + 17);
    this.level = dw.getUint8(offset + 18);
    this.unk2 = dw.getUint8(offset + 19);
    this.models = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.models[i] = dw.getUint32(offset + 20 + i * 4, true);
    }
    this.padding2 = dw.getUint32(offset + 60, true);
  }
}
export class FFXIVIpcExamine extends IpcPacket {
  unkFlag1: number;
  unkFlag2: number;
  classJob: number;
  level: number;
  padding: number;
  titleId: number;
  grandCompany: number;
  grandCompanyRank: number;
  unknown: number[];
  u6_fromPSpawn: number;
  u7_fromPSpawn: number;
  padding1: number[];
  mainWeaponModel: bigint;
  secWeaponModel: bigint;
  unknown2: number;
  worldId: number;
  unknown3: number[];
  catalogId: number;
  appearanceCatalogId: number;
  crafterId: bigint;
  quality: number;
  stain: number;
  unknown: number[];
  materiaId: number;
  tier: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unkFlag1 = dw.getUint8(offset + 0);
    this.unkFlag2 = dw.getUint8(offset + 1);
    this.classJob = dw.getInt8(offset + 2);
    this.level = dw.getInt8(offset + 3);
    this.padding = dw.getUint16(offset + 4, true);
    this.titleId = dw.getUint16(offset + 6, true);
    this.grandCompany = dw.getInt8(offset + 8);
    this.grandCompanyRank = dw.getInt8(offset + 9);
    this.unknown = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.unknown[i] = dw.getInt8(offset + 10 + i * 1);
    }
    this.u6_fromPSpawn = dw.getUint32(offset + 16, true);
    this.u7_fromPSpawn = dw.getUint32(offset + 20, true);
    this.padding1 = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.padding1[i] = dw.getInt8(offset + 24 + i * 1);
    }
    this.mainWeaponModel = dw.getBigUint64(offset + 32, true);
    this.secWeaponModel = dw.getBigUint64(offset + 40, true);
    this.unknown2 = dw.getUint8(offset + 48);
    this.worldId = dw.getUint16(offset + 49, true);
    this.unknown3 = new Array(12);
    for (let i = 0; i < 12; i++) {
      this.unknown3[i] = dw.getInt8(offset + 51 + i * 1);
    }
    this.catalogId = dw.getUint32(offset + 63, true);
    this.appearanceCatalogId = dw.getUint32(offset + 67, true);
    this.crafterId = dw.getBigUint64(offset + 71, true);
    this.quality = dw.getUint8(offset + 79);
    this.stain = dw.getUint8(offset + 80);
    this.unknown = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown[i] = dw.getUint8(offset + 81 + i * 1);
    }
    this.materiaId = dw.getUint16(offset + 83, true);
    this.tier = dw.getUint16(offset + 85, true);
  }
}
export class FFXIVIpcCharaNameReq extends IpcPacket {
  contentId: bigint;
  name: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcItemInfo extends IpcPacket {
  containerSequence: number;
  unknown: number;
  containerId: number;
  slot: number;
  quantity: number;
  catalogId: number;
  reservedFlag: number;
  signatureId: bigint;
  hqFlag: number;
  unknown2: number;
  condition: number;
  spiritBond: number;
  stain: number;
  glamourCatalogId: number;
  materia1: number;
  materia2: number;
  materia3: number;
  materia4: number;
  materia5: number;
  buffer1: number;
  buffer2: number;
  buffer3: number;
  buffer4: number;
  buffer5: number;
  padding: number;
  unknown10: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.containerSequence = dw.getUint32(offset + 0, true);
    this.unknown = dw.getUint32(offset + 4, true);
    this.containerId = dw.getUint16(offset + 8, true);
    this.slot = dw.getUint16(offset + 10, true);
    this.quantity = dw.getUint32(offset + 12, true);
    this.catalogId = dw.getUint32(offset + 16, true);
    this.reservedFlag = dw.getUint32(offset + 20, true);
    this.signatureId = dw.getBigUint64(offset + 24, true);
    this.hqFlag = dw.getUint8(offset + 32);
    this.unknown2 = dw.getUint8(offset + 33);
    this.condition = dw.getUint16(offset + 34, true);
    this.spiritBond = dw.getUint16(offset + 36, true);
    this.stain = dw.getUint16(offset + 38, true);
    this.glamourCatalogId = dw.getUint32(offset + 40, true);
    this.materia1 = dw.getUint16(offset + 44, true);
    this.materia2 = dw.getUint16(offset + 46, true);
    this.materia3 = dw.getUint16(offset + 48, true);
    this.materia4 = dw.getUint16(offset + 50, true);
    this.materia5 = dw.getUint16(offset + 52, true);
    this.buffer1 = dw.getUint8(offset + 54);
    this.buffer2 = dw.getUint8(offset + 55);
    this.buffer3 = dw.getUint8(offset + 56);
    this.buffer4 = dw.getUint8(offset + 57);
    this.buffer5 = dw.getUint8(offset + 58);
    this.padding = dw.getUint8(offset + 59);
    this.unknown10 = dw.getUint32(offset + 60, true);
  }
}
export class FFXIVIpcContainerInfo extends IpcPacket {
  containerSequence: number;
  numItems: number;
  containerId: number;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.containerSequence = dw.getUint32(offset + 0, true);
    this.numItems = dw.getUint32(offset + 4, true);
    this.containerId = dw.getUint32(offset + 8, true);
    this.unknown = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcCurrencyCrystalInfo extends IpcPacket {
  containerSequence: number;
  containerId: number;
  slot: number;
  quantity: number;
  unknown: number;
  catalogId: number;
  unknown1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.containerSequence = dw.getUint32(offset + 0, true);
    this.containerId = dw.getUint16(offset + 4, true);
    this.slot = dw.getUint16(offset + 6, true);
    this.quantity = dw.getUint32(offset + 8, true);
    this.unknown = dw.getUint32(offset + 12, true);
    this.catalogId = dw.getUint32(offset + 16, true);
    this.unknown1 = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcInventoryTransactionFinish extends IpcPacket {
  sequenceId: number;
  sequenceId1: number;
  padding: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.sequenceId = dw.getUint32(offset + 0, true);
    this.sequenceId1 = dw.getUint32(offset + 4, true);
    this.padding = dw.getBigUint64(offset + 8, true);
  }
}
export class FFXIVIpcInventoryTransaction extends IpcPacket {
  sequence: number;
  type: number;
  padding1: number;
  ownerId: number;
  storageId: number;
  slotId: number;
  padding2: number;
  stackSize: number;
  catalogId: number;
  someActorId: number;
  targetStorageId: number;
  targetSlotId: number;
  padding3: number;
  targetStackSize: number;
  targetCatalogId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.sequence = dw.getUint32(offset + 0, true);
    this.type = dw.getUint16(offset + 4, true);
    this.padding1 = dw.getUint16(offset + 6, true);
    this.ownerId = dw.getUint32(offset + 8, true);
    this.storageId = dw.getUint32(offset + 12, true);
    this.slotId = dw.getUint16(offset + 16, true);
    this.padding2 = dw.getUint16(offset + 18, true);
    this.stackSize = dw.getUint32(offset + 20, true);
    this.catalogId = dw.getUint32(offset + 24, true);
    this.someActorId = dw.getUint32(offset + 28, true);
    this.targetStorageId = dw.getInt32(offset + 32, true);
    this.targetSlotId = dw.getUint16(offset + 36, true);
    this.padding3 = dw.getUint16(offset + 38, true);
    this.targetStackSize = dw.getUint32(offset + 40, true);
    this.targetCatalogId = dw.getUint32(offset + 44, true);
  }
}
export class FFXIVIpcInventoryActionAck extends IpcPacket {
  sequence: number;
  type: number;
  padding: number;
  padding1: number;
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.sequence = dw.getUint32(offset + 0, true);
    this.type = dw.getUint16(offset + 4, true);
    this.padding = dw.getUint16(offset + 6, true);
    this.padding1 = dw.getUint32(offset + 8, true);
    this.padding2 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcUpdateInventorySlot extends IpcPacket {
  sequence: number;
  unknown: number;
  containerId: number;
  slot: number;
  quantity: number;
  catalogId: number;
  reservedFlag: number;
  signatureId: bigint;
  hqFlag: number;
  condition: number;
  spiritBond: number;
  color: number;
  glamourCatalogId: number;
  materia1: number;
  materia2: number;
  materia3: number;
  materia4: number;
  materia5: number;
  buffer1: number;
  buffer2: number;
  buffer3: number;
  buffer4: number;
  buffer5: number;
  padding: number;
  unknown10: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.sequence = dw.getUint32(offset + 0, true);
    this.unknown = dw.getUint32(offset + 4, true);
    this.containerId = dw.getUint16(offset + 8, true);
    this.slot = dw.getUint16(offset + 10, true);
    this.quantity = dw.getUint32(offset + 12, true);
    this.catalogId = dw.getUint32(offset + 16, true);
    this.reservedFlag = dw.getUint32(offset + 20, true);
    this.signatureId = dw.getBigUint64(offset + 24, true);
    this.hqFlag = dw.getUint16(offset + 32, true);
    this.condition = dw.getUint16(offset + 34, true);
    this.spiritBond = dw.getUint16(offset + 36, true);
    this.color = dw.getUint16(offset + 38, true);
    this.glamourCatalogId = dw.getUint32(offset + 40, true);
    this.materia1 = dw.getUint16(offset + 44, true);
    this.materia2 = dw.getUint16(offset + 46, true);
    this.materia3 = dw.getUint16(offset + 48, true);
    this.materia4 = dw.getUint16(offset + 50, true);
    this.materia5 = dw.getUint16(offset + 52, true);
    this.buffer1 = dw.getUint8(offset + 54);
    this.buffer2 = dw.getUint8(offset + 55);
    this.buffer3 = dw.getUint8(offset + 56);
    this.buffer4 = dw.getUint8(offset + 57);
    this.buffer5 = dw.getUint8(offset + 58);
    this.padding = dw.getUint8(offset + 59);
    this.unknown10 = dw.getUint32(offset + 60, true);
  }
}
export class FFXIVIpcEventStart extends IpcPacket {
  actorId: bigint;
  eventId: number;
  param1: number;
  param2: number;
  padding: number;
  param3: number;
  padding1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.param1 = dw.getUint8(offset + 12);
    this.param2 = dw.getUint8(offset + 13);
    this.padding = dw.getUint16(offset + 14, true);
    this.param3 = dw.getUint32(offset + 16, true);
    this.padding1 = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcHuntingLogEntry extends IpcPacket {
  u0: number;
  rank: number;
  index: number;
  pad: number;
  completeFlags: bigint;
  pad1: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.u0 = dw.getInt32(offset + 0, true);
    this.rank = dw.getUint8(offset + 4);
    this.index = dw.getUint8(offset + 5);
    this.pad = dw.getUint16(offset + 6, true);
    this.completeFlags = dw.getBigUint64(offset + 8, true);
    this.pad1 = dw.getBigUint64(offset + 16, true);
  }
}
export class FFXIVIpcEventPlay extends IpcPacket {
  actorId: bigint;
  eventId: number;
  scene: number;
  padding: number;
  flags: number;
  param3: number;
  paramSize: number;
  param: number[];
  unknown: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.scene = dw.getUint16(offset + 12, true);
    this.padding = dw.getUint16(offset + 14, true);
    this.flags = dw.getUint32(offset + 16, true);
    this.param3 = dw.getUint32(offset + 20, true);
    this.paramSize = dw.getUint32(offset + 24, true);
    this.param = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.param[i] = dw.getUint32(offset + 28 + i * 4, true);
    }
    this.unknown = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unknown[i] = dw.getUint8(offset + 36 + i * 1);
    }
  }
}
export class FFXIVIpcEventPlay16 extends IpcPacket {
  actorId: bigint;
  eventId: number;
  scene: number;
  padding: number;
  flags: number;
  param3: number;
  paramSize: number;
  param: number[];
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.scene = dw.getUint16(offset + 12, true);
    this.padding = dw.getUint16(offset + 14, true);
    this.flags = dw.getUint32(offset + 16, true);
    this.param3 = dw.getUint32(offset + 20, true);
    this.paramSize = dw.getUint32(offset + 24, true);
    this.param = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.param[i] = dw.getUint32(offset + 28 + i * 4, true);
    }
    this.padding2 = dw.getUint32(offset + 92, true);
  }
}
export class FFXIVIpcEventPlayN extends IpcPacket {
  actorId: bigint;
  eventId: number;
  scene: number;
  padding: number;
  sceneFlags: number;
  unknown: number;
  paramSize: number;
  padding2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.scene = dw.getUint16(offset + 12, true);
    this.padding = dw.getUint16(offset + 14, true);
    this.sceneFlags = dw.getUint32(offset + 16, true);
    this.unknown = dw.getUint32(offset + 20, true);
    this.paramSize = dw.getUint8(offset + 24);
    this.padding2 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding2[i] = dw.getUint8(offset + 25 + i * 1);
    }
  }
}
export class FFXIVIpcDirectorPlayScene extends IpcPacket {
  actorId: bigint;
  eventId: number;
  scene: number;
  padding: number;
  flags: number;
  param3: number;
  param4: number;
  padding1: number[];
  param5: number;
  unknown8: number[];
  unknown: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.scene = dw.getUint16(offset + 12, true);
    this.padding = dw.getUint16(offset + 14, true);
    this.flags = dw.getUint32(offset + 16, true);
    this.param3 = dw.getUint32(offset + 20, true);
    this.param4 = dw.getUint8(offset + 24);
    this.padding1 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding1[i] = dw.getUint8(offset + 25 + i * 1);
    }
    this.param5 = dw.getUint32(offset + 28, true);
    this.unknown8 = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.unknown8[i] = dw.getUint8(offset + 32 + i * 1);
    }
    this.unknown = new Array(56);
    for (let i = 0; i < 56; i++) {
      this.unknown[i] = dw.getUint8(offset + 40 + i * 1);
    }
  }
}
export class FFXIVIpcEventFinish extends IpcPacket {
  eventId: number;
  param1: number;
  param2: number;
  padding: number;
  param3: number;
  padding1: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.param1 = dw.getUint8(offset + 4);
    this.param2 = dw.getUint8(offset + 5);
    this.padding = dw.getUint16(offset + 6, true);
    this.param3 = dw.getUint32(offset + 8, true);
    this.padding1 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcEventLinkshell extends IpcPacket {
  eventId: number;
  scene: number;
  param1: number;
  param2: number;
  param3: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  unknown4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint8(offset + 4);
    this.param1 = dw.getUint8(offset + 5);
    this.param2 = dw.getUint8(offset + 6);
    this.param3 = dw.getUint8(offset + 7);
    this.unknown1 = dw.getUint32(offset + 8, true);
    this.unknown2 = dw.getUint32(offset + 12, true);
    this.unknown3 = dw.getUint32(offset + 16, true);
    this.unknown4 = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcQuestActiveList extends IpcPacket {
  activeQuests: QuestActive[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
  }
}
export class FFXIVIpcQuestUpdate extends IpcPacket {
  slot: number;
  padding: number;
  questInfo: QuestActive;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.slot = dw.getUint16(offset + 0, true);
    this.padding = dw.getUint16(offset + 2, true);
  }
}
export class FFXIVIpcQuestCompleteList extends IpcPacket {
  questCompleteMask: number[];
  unknownCompleteMask: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.questCompleteMask = new Array(487);
    for (let i = 0; i < 487; i++) {
      this.questCompleteMask[i] = dw.getUint8(offset + 0 + i * 1);
    }
    this.unknownCompleteMask = new Array(73);
    for (let i = 0; i < 73; i++) {
      this.unknownCompleteMask[i] = dw.getUint8(offset + 487 + i * 1);
    }
  }
}
export class FFXIVIpcQuestFinish extends IpcPacket {
  questId: number;
  flag1: number;
  flag2: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.questId = dw.getUint16(offset + 0, true);
    this.flag1 = dw.getUint8(offset + 2);
    this.flag2 = dw.getUint8(offset + 3);
    this.padding = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcQuestMessage extends IpcPacket {
  questId: number;
  msgId: number;
  type: number;
  padding1: number;
  var1: number;
  var2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.questId = dw.getUint32(offset + 0, true);
    this.msgId = dw.getUint8(offset + 4);
    this.type = dw.getUint8(offset + 5);
    this.padding1 = dw.getUint16(offset + 6, true);
    this.var1 = dw.getUint32(offset + 8, true);
    this.var2 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcQuestTracker extends IpcPacket {
  active: number;
  questIndex: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.active = dw.getUint8(offset + 0);
    this.questIndex = dw.getUint8(offset + 1);
  }
}
export class FFXIVIpcWeatherChange extends IpcPacket {
  weatherId: number;
  delay: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.weatherId = dw.getUint32(offset + 0, true);
    this.delay = dw.getFloat32(offset + 4, true);
  }
}
export class FFXIVIpcDiscovery extends IpcPacket {
  mapPartId: number;
  mapId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.mapPartId = dw.getUint32(offset + 0, true);
    this.mapId = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVARR_IPC_UNK322 extends IpcPacket {
  unk: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unk = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.unk[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVARR_IPC_UNK320 extends IpcPacket {
  unk: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unk = new Array(56);
    for (let i = 0; i < 56; i++) {
      this.unk[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcPrepareZoning extends IpcPacket {
  logMessage: number;
  targetZone: number;
  animation: number;
  param4: number;
  hideChar: number;
  fadeOut: number;
  param7: number;
  fadeOutTime: number;
  unknown: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.logMessage = dw.getUint32(offset + 0, true);
    this.targetZone = dw.getUint16(offset + 4, true);
    this.animation = dw.getUint16(offset + 6, true);
    this.param4 = dw.getUint8(offset + 8);
    this.hideChar = dw.getUint8(offset + 9);
    this.fadeOut = dw.getUint8(offset + 10);
    this.param7 = dw.getUint8(offset + 11);
    this.fadeOutTime = dw.getUint8(offset + 12);
    this.unknown = dw.getUint8(offset + 13);
    this.padding = dw.getUint16(offset + 14, true);
  }
}
export class FFXIVIpcCFNotify extends IpcPacket {
  state1: number;
  unknown: number[];
  unknown_one: number;
  contents: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.state1 = dw.getUint32(offset + 0, true);
    this.unknown = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.unknown[i] = dw.getUint32(offset + 4 + i * 4, true);
    }
    this.unknown_one = dw.getUint32(offset + 24, true);
    this.contents = new Array(5);
    for (let i = 0; i < 5; i++) {
      this.contents[i] = dw.getUint16(offset + 28 + i * 2, true);
    }
    this.padding = dw.getUint16(offset + 38, true);
  }
}
export class FFXIVIpcCFAvailableContents extends IpcPacket {
  contents: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contents = new Array(72);
    for (let i = 0; i < 72; i++) {
      this.contents[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcCFPlayerInNeed extends IpcPacket {
  inNeeds: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.inNeeds = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.inNeeds[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcCFDutyInfo extends IpcPacket {
  penaltyTime: number;
  unknown: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.penaltyTime = dw.getUint8(offset + 0);
    this.unknown = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.unknown[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcCFRegisterDuty extends IpcPacket {
  unknown0: number;
  rouletteId: number;
  unknown1: number;
  contentId: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown0 = dw.getUint32(offset + 0, true);
    this.rouletteId = dw.getUint8(offset + 4);
    this.unknown1 = dw.getUint8(offset + 5);
    this.contentId = dw.getUint16(offset + 6, true);
  }
}
export class FFXIVIpcCFMemberStatus extends IpcPacket {
  contentId: number;
  unknown1: number;
  status: number;
  currentTank: number;
  currentDps: number;
  currentHealer: number;
  estimatedTime: number;
  unknown2: number[];
  unknown3: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getUint16(offset + 0, true);
    this.unknown1 = dw.getUint16(offset + 2, true);
    this.status = dw.getUint8(offset + 4);
    this.currentTank = dw.getUint8(offset + 5);
    this.currentDps = dw.getUint8(offset + 6);
    this.currentHealer = dw.getUint8(offset + 7);
    this.estimatedTime = dw.getUint8(offset + 8);
    this.unknown2 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.unknown2[i] = dw.getUint8(offset + 9 + i * 1);
    }
    this.unknown3 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcEorzeaTimeOffset extends IpcPacket {
  timestamp: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.timestamp = dw.getBigUint64(offset + 0, true);
  }
}
export class FFXIVIpcEquipDisplayFlags extends IpcPacket {
  bitmask: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.bitmask = dw.getUint8(offset + 0);
  }
}
export class FFXIVIpcMiniCactPotInit extends IpcPacket {
  type: number;
  category: number;
  unknown1: number;
  unknown2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.type = dw.getUint32(offset + 0, true);
    this.category = dw.getUint16(offset + 4, true);
    this.unknown1 = dw.getUint8(offset + 6);
    this.unknown2 = dw.getUint8(offset + 7);
  }
}
export class FFXIVIpcPlaceFieldMarkerPreset extends IpcPacket {
  status: FieldMarkerStatus;
  Xints: number[];
  Yints: number[];
  Zints: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.Xints = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.Xints[i] = dw.getUint32(offset + 4 + i * 4, true);
    }
    this.Yints = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.Yints[i] = dw.getUint32(offset + 36 + i * 4, true);
    }
    this.Zints = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.Zints[i] = dw.getUint32(offset + 68 + i * 4, true);
    }
  }
}
export class FFXIVIpcPlaceFieldMarker extends IpcPacket {
  markerId: FieldMarkerId;
  status: number;
  pad: number[];
  Xint: number;
  Yint: number;
  Zint: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.status = dw.getUint8(offset + 1);
    this.pad = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad[i] = dw.getUint8(offset + 2 + i * 1);
    }
    this.Xint = dw.getUint32(offset + 4, true);
    this.Yint = dw.getUint32(offset + 8, true);
    this.Zint = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcMount extends IpcPacket {
  id: number;
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.id = dw.getUint32(offset + 0, true);
    this.padding = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding[i] = dw.getUint32(offset + 4 + i * 4, true);
    }
  }
}
export class FFXIVIpcDirectorVars extends IpcPacket {
  m_directorId: number;
  m_sequence: number;
  m_branch: number;
  m_unionData: number[];
  u20: number;
  u22: number;
  u24: number;
  u28: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.m_directorId = dw.getUint32(offset + 0, true);
    this.m_sequence = dw.getUint8(offset + 4);
    this.m_branch = dw.getUint8(offset + 5);
    this.m_unionData = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.m_unionData[i] = dw.getUint8(offset + 6 + i * 1);
    }
    this.u20 = dw.getUint16(offset + 16, true);
    this.u22 = dw.getUint16(offset + 18, true);
    this.u24 = dw.getUint16(offset + 20, true);
    this.u28 = dw.getUint16(offset + 22, true);
  }
}
export class FFXIVIpcDirectorPopUp2 extends IpcPacket {
  directorId: number;
  pad1: number[];
  sourceActorId: bigint;
  textId: number;
  popupTimeMs: number;
  bNPCName: number;
  flags: number;
  pad2: number[];
  param: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.directorId = dw.getUint32(offset + 0, true);
    this.pad1 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.pad1[i] = dw.getUint16(offset + 4 + i * 2, true);
    }
    this.sourceActorId = dw.getBigUint64(offset + 8, true);
    this.textId = dw.getUint32(offset + 16, true);
    this.popupTimeMs = dw.getUint32(offset + 20, true);
    this.bNPCName = dw.getUint32(offset + 24, true);
    this.flags = dw.getUint8(offset + 28);
    this.pad2 = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.pad2[i] = dw.getUint8(offset + 29 + i * 1);
    }
    this.param = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.param[i] = dw.getUint32(offset + 32 + i * 4, true);
    }
  }
}
export class FFXIVIpcActorGauge extends IpcPacket {
  classJobId: number;
  data: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.classJobId = dw.getUint8(offset + 0);
    this.data = new Array(15);
    for (let i = 0; i < 15; i++) {
      this.data[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcPerformNote extends IpcPacket {
  data: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.data = new Array(16);
    for (let i = 0; i < 16; i++) {
      this.data[i] = dw.getUint8(offset + 0 + i * 1);
    }
  }
}
export class FFXIVIpcHousingUpdateLandFlagsSlot extends IpcPacket {
  type: number;
  unknown: number;
  flagSet: LandFlagSet;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.type = dw.getUint32(offset + 0, true);
    this.unknown = dw.getUint32(offset + 4, true);
    this.flagSet = new LandFlagSet(dw, offset + 8);
  }
}
export class FFXIVIpcHousingLandFlags extends IpcPacket {
  freeCompanyHouse: LandFlagSet;
  unknown1: bigint;
  privateHouse: LandFlagSet;
  unknown2: bigint;
  freeCompanyChambers: LandFlagSet;
  unknown3: bigint;
  sharedHouse: LandFlagSet[];
  unknown4: bigint;
  apartment: LandFlagSet;
  unknown5: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.freeCompanyHouse = new LandFlagSet(dw, offset + 0);
    this.unknown1 = dw.getBigUint64(offset + 16, true);
    this.privateHouse = new LandFlagSet(dw, offset + 24);
    this.unknown2 = dw.getBigUint64(offset + 40, true);
    this.freeCompanyChambers = new LandFlagSet(dw, offset + 48);
    this.unknown3 = dw.getBigUint64(offset + 64, true);
    this.sharedHouse = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.sharedHouse[i] = new LandFlagSet(dw, offset + 72 + i * 16);
    }
    this.unknown4 = dw.getBigUint64(offset + 104, true);
    this.apartment = new LandFlagSet(dw, offset + 112);
    this.unknown5 = dw.getBigUint64(offset + 128, true);
  }
}
export class LandStruct extends IpcPacket {
  plotSize: number;
  houseState: number;
  flags: number;
  iconAddIcon: number;
  fcId: number;
  fcIcon: number;
  fcIconColor: number;
  housePart: number[];
  houseColour: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.plotSize = dw.getUint8(offset + 0);
    this.houseState = dw.getUint8(offset + 1);
    this.flags = dw.getUint8(offset + 2);
    this.iconAddIcon = dw.getUint8(offset + 3);
    this.fcId = dw.getUint32(offset + 4, true);
    this.fcIcon = dw.getUint32(offset + 8, true);
    this.fcIconColor = dw.getUint32(offset + 12, true);
    this.housePart = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.housePart[i] = dw.getUint16(offset + 16 + i * 2, true);
    }
    this.houseColour = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.houseColour[i] = dw.getUint8(offset + 32 + i * 1);
    }
  }
}
export class FFXIVIpcLandUpdate extends IpcPacket {
  landIdent: LandIdent;
  land: LandStruct;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.land = new LandStruct(dw, offset + 8);
  }
}
export class FFXIVIpcLandPriceUpdate extends IpcPacket {
  price: number;
  timeLeft: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.price = dw.getUint32(offset + 0, true);
    this.timeLeft = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcLandAvailability extends IpcPacket {
  sellMode: LandSellMode;
  availableTo: LandAvailableTo;
  lotteryStatus: LandLotteryStatus;
  lotteryPlayerResult: LandLotteryPlayerResult;
  lotteryUpdateTime: number;
  refundExpiryTime: number;
  lotteryEntries: number;
  lotteryWinningNumber: number;
  lotteryPlayerNumber: number;
  refundAmount: number;
  unknown: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.lotteryUpdateTime = dw.getUint32(offset + 4, true);
    this.refundExpiryTime = dw.getUint32(offset + 8, true);
    this.lotteryEntries = dw.getUint32(offset + 12, true);
    this.lotteryWinningNumber = dw.getUint32(offset + 16, true);
    this.lotteryPlayerNumber = dw.getUint32(offset + 20, true);
    this.refundAmount = dw.getUint32(offset + 24, true);
    this.unknown = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcLandInfoSign extends IpcPacket {
  landIdent: LandIdent;
  ownerId: bigint;
  unknow1: number;
  houseIconAdd: number;
  houseSize: number;
  houseType: number;
  estateName: number[];
  estateGreeting: number[];
  ownerName: number[];
  fcTag: number[];
  tag: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.ownerId = dw.getBigUint64(offset + 8, true);
    this.unknow1 = dw.getUint32(offset + 16, true);
    this.houseIconAdd = dw.getUint8(offset + 20);
    this.houseSize = dw.getUint8(offset + 21);
    this.houseType = dw.getUint8(offset + 22);
    this.estateName = new Array(23);
    for (let i = 0; i < 23; i++) {
      this.estateName[i] = dw.getInt8(offset + 23 + i * 1);
    }
    this.estateGreeting = new Array(193);
    for (let i = 0; i < 193; i++) {
      this.estateGreeting[i] = dw.getInt8(offset + 46 + i * 1);
    }
    this.ownerName = new Array(31);
    for (let i = 0; i < 31; i++) {
      this.ownerName[i] = dw.getInt8(offset + 239 + i * 1);
    }
    this.fcTag = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.fcTag[i] = dw.getInt8(offset + 270 + i * 1);
    }
    this.tag = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.tag[i] = dw.getUint8(offset + 277 + i * 1);
    }
  }
}
export class FFXIVIpcLandRename extends IpcPacket {
  landIdent: LandIdent;
  houseName: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.houseName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.houseName[i] = dw.getInt8(offset + 8 + i * 1);
    }
    this.padding = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcLandUpdateHouseName extends IpcPacket {
  unknown: number[];
  houseName: number[];
  unknown2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.unknown[i] = dw.getUint32(offset + 0 + i * 4, true);
    }
    this.houseName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.houseName[i] = dw.getInt8(offset + 12 + i * 1);
    }
    this.unknown2 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown2[i] = dw.getUint32(offset + 32 + i * 4, true);
    }
  }
}
export class FFXIVIpcLandSetMap extends IpcPacket {
  u1: number;
  subdivision: number;
  u3: number;
  status: number;
  size: number;
  isPrivate: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.u1 = dw.getUint8(offset + 0);
    this.subdivision = dw.getUint8(offset + 1);
    this.u3 = dw.getUint8(offset + 2);
    this.status = dw.getUint8(offset + 3);
    this.size = dw.getUint8(offset + 4);
    this.isPrivate = dw.getUint8(offset + 5);
  }
}
export class FFXIVIpcLandSetInitialize extends IpcPacket {
  landIdent: LandIdent;
  unknown1: number;
  subInstance: number;
  unknown3: number;
  unknown4: number;
  unknown5: number;
  unknown6: number;
  unknown7: number;
  unknown8: number;
  land: LandStruct[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.unknown1 = dw.getUint8(offset + 8);
    this.subInstance = dw.getUint8(offset + 9);
    this.unknown3 = dw.getUint8(offset + 10);
    this.unknown4 = dw.getUint8(offset + 11);
    this.unknown5 = dw.getUint8(offset + 12);
    this.unknown6 = dw.getUint8(offset + 13);
    this.unknown7 = dw.getUint8(offset + 14);
    this.unknown8 = dw.getUint8(offset + 15);
    this.land = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.land[i] = new LandStruct(dw, offset + 16 + i * 40);
    }
  }
}
export class FFXIVIpcYardObjectSpawn extends IpcPacket {
  landId: number;
  objectArray: number;
  unknown1: number;
  object: HousingObject;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landId = dw.getUint8(offset + 0);
    this.objectArray = dw.getUint8(offset + 1);
    this.unknown1 = dw.getUint16(offset + 2, true);
    this.object = new HousingObject(dw, offset + 4);
  }
}
export class FFXIVIpcHousingObjectMove extends IpcPacket {
  itemRotation: number;
  objectArray: number;
  landId: number;
  pos: FFXIVARR_POSITION3;
  unknown1: number;
  unknown2: number;
  unknown3: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.itemRotation = dw.getUint16(offset + 0, true);
    this.objectArray = dw.getUint8(offset + 2);
    this.landId = dw.getUint8(offset + 3);
    this.pos = new FFXIVARR_POSITION3(dw, offset + 4);
    this.unknown1 = dw.getUint16(offset + 16, true);
    this.unknown2 = dw.getUint16(offset + 18, true);
    this.unknown3 = dw.getUint16(offset + 20, true);
  }
}
export class FFXIVIpcHousingObjectInitialize extends IpcPacket {
  landIdent: LandIdent;
  u1: number;
  packetNum: number;
  packetTotal: number;
  u2: number;
  object: HousingObject[];
  unknown4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.u1 = dw.getInt8(offset + 8);
    this.packetNum = dw.getUint8(offset + 9);
    this.packetTotal = dw.getUint8(offset + 10);
    this.u2 = dw.getUint8(offset + 11);
    this.object = new Array(100);
    for (let i = 0; i < 100; i++) {
      this.object[i] = new HousingObject(dw, offset + 12 + i * 24);
    }
    this.unknown4 = dw.getUint32(offset + 2412, true);
  }
}
export class FFXIVIpcHousingInternalObjectSpawn extends IpcPacket {
  containerId: number;
  containerOffset: number;
  pad1: number;
  object: HousingObject;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.containerId = dw.getUint16(offset + 0, true);
    this.containerOffset = dw.getUint8(offset + 2);
    this.pad1 = dw.getUint8(offset + 3);
    this.object = new HousingObject(dw, offset + 4);
  }
}
export class FFXIVIpcHousingIndoorInitialize extends IpcPacket {
  u1: number;
  u2: number;
  u3: number;
  u4: number;
  indoorItems: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.u1 = dw.getUint16(offset + 0, true);
    this.u2 = dw.getUint16(offset + 2, true);
    this.u3 = dw.getUint16(offset + 4, true);
    this.u4 = dw.getUint16(offset + 6, true);
    this.indoorItems = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.indoorItems[i] = dw.getUint32(offset + 8 + i * 4, true);
    }
  }
}
export class FFXIVIpcHousingWardInfo extends IpcPacket {
  landIdent: LandIdent;
  housePrice: number;
  infoFlags: number;
  estateOwnerName: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.housePrice = dw.getUint32(offset + 8, true);
    this.infoFlags = dw.getUint8(offset + 12);
    this.estateOwnerName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.estateOwnerName[i] = dw.getInt8(offset + 13 + i * 1);
    }
  }
}
export class FFXIVIpcHousingEstateGreeting extends IpcPacket {
  landIdent: LandIdent;
  message: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.landIdent = new LandIdent(dw, offset + 0);
    this.message = new Array(200);
    for (let i = 0; i < 200; i++) {
      this.message[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcHousingShowEstateGuestAccess extends IpcPacket {
  unknown: number[];
  ident: LandIdent;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown[i] = dw.getUint32(offset + 0 + i * 4, true);
    }
    this.ident = new LandIdent(dw, offset + 8);
  }
}
export class FFXIVIpcSharedEstateSettingsResponse extends IpcPacket {
  contentId: bigint;
  permissions: number;
  name: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.permissions = dw.getUint8(offset + 8);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 9 + i * 1);
    }
    this.padding = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding[i] = dw.getInt8(offset + 41 + i * 1);
    }
  }
}
export class FFXIVIpcMSQTrackerProgress extends IpcPacket {
  id: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.id = dw.getUint32(offset + 0, true);
    this.padding = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcMSQTrackerComplete extends IpcPacket {
  id: number;
  padding1: number;
  padding2: bigint;
  padding3: bigint;
  padding4: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.id = dw.getUint32(offset + 0, true);
    this.padding1 = dw.getUint32(offset + 4, true);
    this.padding2 = dw.getBigUint64(offset + 8, true);
    this.padding3 = dw.getBigUint64(offset + 16, true);
    this.padding4 = dw.getBigUint64(offset + 24, true);
  }
}
export class FFXIVIpcObjectSpawn extends IpcPacket {
  spawnIndex: number;
  objKind: number;
  state: number;
  unknown3: number;
  objId: number;
  actorId: number;
  levelId: number;
  unknown10: number;
  someActorId14: number;
  gimmickId: number;
  scale: number;
  unknown20a: number;
  rotation: number;
  unknown24a: number;
  unknown24b: number;
  flag: number;
  unknown28c: number;
  housingLink: number;
  position: FFXIVARR_POSITION3;
  unknown3C: number;
  unknown3E: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.spawnIndex = dw.getUint8(offset + 0);
    this.objKind = dw.getUint8(offset + 1);
    this.state = dw.getUint8(offset + 2);
    this.unknown3 = dw.getUint8(offset + 3);
    this.objId = dw.getUint32(offset + 4, true);
    this.actorId = dw.getUint32(offset + 8, true);
    this.levelId = dw.getUint32(offset + 12, true);
    this.unknown10 = dw.getUint32(offset + 16, true);
    this.someActorId14 = dw.getUint32(offset + 20, true);
    this.gimmickId = dw.getUint32(offset + 24, true);
    this.scale = dw.getFloat32(offset + 28, true);
    this.unknown20a = dw.getInt16(offset + 32, true);
    this.rotation = dw.getUint16(offset + 34, true);
    this.unknown24a = dw.getInt16(offset + 36, true);
    this.unknown24b = dw.getInt16(offset + 38, true);
    this.flag = dw.getUint16(offset + 40, true);
    this.unknown28c = dw.getInt16(offset + 42, true);
    this.housingLink = dw.getUint32(offset + 44, true);
    this.position = new FFXIVARR_POSITION3(dw, offset + 48);
    this.unknown3C = dw.getInt16(offset + 60, true);
    this.unknown3E = dw.getInt16(offset + 62, true);
  }
}
export class FFXIVIpcObjectDespawn extends IpcPacket {
  spawnIndex: number;
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.spawnIndex = dw.getUint8(offset + 0);
    this.padding = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.padding[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcDuelChallenge extends IpcPacket {
  otherClassJobId: number;
  otherLevel: number;
  challengeByYou: number;
  otherItemLevel: number;
  otherActorId: number;
  otherName: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.otherClassJobId = dw.getUint8(offset + 0);
    this.otherLevel = dw.getUint8(offset + 1);
    this.challengeByYou = dw.getUint8(offset + 2);
    this.otherItemLevel = dw.getUint8(offset + 3);
    this.otherActorId = dw.getUint32(offset + 4, true);
    this.otherName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.otherName[i] = dw.getInt8(offset + 8 + i * 1);
    }
  }
}
export class FFXIVIpcRetainerInformation extends IpcPacket {
  unknown0: number[];
  retainerId: bigint;
  hireOrder: number;
  itemCount: number;
  unknown5: number[];
  gil: number;
  sellingCount: number;
  cityId: number;
  classJob: number;
  level: number;
  unknown11: number[];
  retainerTask: number;
  retainerTaskComplete: number;
  unknown14: number;
  retainerName: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown0 = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.unknown0[i] = dw.getUint8(offset + 0 + i * 1);
    }
    this.retainerId = dw.getBigUint64(offset + 8, true);
    this.hireOrder = dw.getUint8(offset + 16);
    this.itemCount = dw.getUint8(offset + 17);
    this.unknown5 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown5[i] = dw.getUint8(offset + 18 + i * 1);
    }
    this.gil = dw.getUint32(offset + 20, true);
    this.sellingCount = dw.getUint8(offset + 24);
    this.cityId = dw.getUint8(offset + 25);
    this.classJob = dw.getUint8(offset + 26);
    this.level = dw.getUint8(offset + 27);
    this.unknown11 = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.unknown11[i] = dw.getUint8(offset + 28 + i * 1);
    }
    this.retainerTask = dw.getUint32(offset + 32, true);
    this.retainerTaskComplete = dw.getUint32(offset + 36, true);
    this.unknown14 = dw.getUint8(offset + 40);
    this.retainerName = new Array(20);
    for (let i = 0; i < 20; i++) {
      this.retainerName[i] = dw.getInt8(offset + 41 + i * 1);
    }
  }
}
export class FFXIVIpcCharaVisualEffect extends IpcPacket {
  id: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.id = dw.getUint32(offset + 0, true);
    this.padding = dw.getUint32(offset + 4, true);
  }
}
export class FFXIVIpcCFCancel extends IpcPacket {
  unknown1: bigint;
  cancelReason: number;
  unknown2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown1 = dw.getBigUint64(offset + 0, true);
    this.cancelReason = dw.getUint32(offset + 8, true);
    this.unknown2 = dw.getUint32(offset + 12, true);
  }
}
export class FFXIVIpcCFUnk extends IpcPacket {
  cfConditionId: number;
  unknown1: number;
  five: number;
  unknown2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.cfConditionId = dw.getUint16(offset + 0, true);
    this.unknown1 = dw.getUint16(offset + 2, true);
    this.five = dw.getUint32(offset + 4, true);
    this.unknown2 = new Array(2);
    for (let i = 0; i < 2; i++) {
      this.unknown2[i] = dw.getUint32(offset + 8 + i * 4, true);
    }
  }
}
export class FFXIVIpcShopMessage extends IpcPacket {
  shopId: number;
  msgType: number;
  unknown2: number;
  itemId: number;
  amount: number;
  price: number;
  unknown6: number;
  unknown7: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.shopId = dw.getUint32(offset + 0, true);
    this.msgType = dw.getUint32(offset + 4, true);
    this.unknown2 = dw.getUint32(offset + 8, true);
    this.itemId = dw.getUint32(offset + 12, true);
    this.amount = dw.getUint32(offset + 16, true);
    this.price = dw.getUint32(offset + 20, true);
    this.unknown6 = dw.getUint32(offset + 24, true);
    this.unknown7 = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcLootMessage extends IpcPacket {
  msgType: LootMessageType;
  padding: number[];
  param1: number;
  param2: number;
  param3: number;
  param4: number;
  param5: number;
  param6: number;
  param7: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding[i] = dw.getUint8(offset + 1 + i * 1);
    }
    this.param1 = dw.getUint32(offset + 4, true);
    this.param2 = dw.getUint32(offset + 8, true);
    this.param3 = dw.getUint32(offset + 12, true);
    this.param4 = dw.getUint32(offset + 16, true);
    this.param5 = dw.getUint32(offset + 20, true);
    this.param6 = dw.getUint32(offset + 24, true);
    this.param7 = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVIpcSocialInviteUpdate extends IpcPacket {
  contentId: bigint;
  unknown: bigint;
  expireTime: number;
  p1: number;
  p2: number;
  socialType: number;
  padding: number;
  type: number;
  gender: number;
  name: number[];
  padding2: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.unknown = dw.getBigUint64(offset + 8, true);
    this.expireTime = dw.getUint32(offset + 16, true);
    this.p1 = dw.getUint8(offset + 20);
    this.p2 = dw.getUint8(offset + 21);
    this.socialType = dw.getUint8(offset + 22);
    this.padding = dw.getUint8(offset + 23);
    this.type = dw.getUint8(offset + 24);
    this.gender = dw.getUint8(offset + 25);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 26 + i * 1);
    }
    this.padding2 = new Array(6);
    for (let i = 0; i < 6; i++) {
      this.padding2[i] = dw.getUint8(offset + 58 + i * 1);
    }
  }
}
export class FFXIVIpcSocialInviteResult extends IpcPacket {
  contentId: bigint;
  unknown3: number;
  p1: number;
  p2: number;
  socialType: number;
  padding: number;
  name: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.unknown3 = dw.getUint32(offset + 8, true);
    this.p1 = dw.getUint8(offset + 12);
    this.p2 = dw.getUint8(offset + 13);
    this.socialType = dw.getUint8(offset + 14);
    this.padding = dw.getUint8(offset + 15);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 16 + i * 1);
    }
  }
}
export class FFXIVIpcSocialInviteResponse extends IpcPacket {
  contentId: bigint;
  unknown3: number;
  socialType: number;
  response: number;
  gender: number;
  name: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.contentId = dw.getBigUint64(offset + 0, true);
    this.unknown3 = dw.getUint32(offset + 8, true);
    this.socialType = dw.getUint8(offset + 12);
    this.response = dw.getUint8(offset + 13);
    this.gender = dw.getUint8(offset + 14);
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 15 + i * 1);
    }
    this.padding = dw.getUint8(offset + 47);
  }
}
export class PartyMember extends IpcPacket {
  name: number[];
  unknown2: bigint;
  contentId: bigint;
  charaId: number;
  u1: number;
  u2: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  u3: number;
  zoneId: number;
  gposeSelectable: number;
  classId: number;
  u5: number;
  level: number;
  isLevelSync: number;
  unknown: number[];
  effect: StatusEffect[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.name = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.name[i] = dw.getInt8(offset + 0 + i * 1);
    }
    this.unknown2 = dw.getBigUint64(offset + 32, true);
    this.contentId = dw.getBigUint64(offset + 40, true);
    this.charaId = dw.getUint32(offset + 48, true);
    this.u1 = dw.getUint32(offset + 52, true);
    this.u2 = dw.getUint32(offset + 56, true);
    this.hp = dw.getUint32(offset + 60, true);
    this.maxHp = dw.getUint32(offset + 64, true);
    this.mp = dw.getUint16(offset + 68, true);
    this.maxMp = dw.getUint16(offset + 70, true);
    this.u3 = dw.getUint16(offset + 72, true);
    this.zoneId = dw.getUint16(offset + 74, true);
    this.gposeSelectable = dw.getUint8(offset + 76);
    this.classId = dw.getUint8(offset + 77);
    this.u5 = dw.getUint8(offset + 78);
    this.level = dw.getUint8(offset + 79);
    this.isLevelSync = dw.getUint8(offset + 80);
    this.unknown = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.unknown[i] = dw.getUint8(offset + 81 + i * 1);
    }
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 88 + i * 12);
    }
  }
}
export class FFXIVIpcPartyList extends IpcPacket {
  member: PartyMember[];
  partyId: bigint;
  channelId: bigint;
  leaderIndex: number;
  partySize: number;
  padding1: number;
  padding2: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.member = new Array(8);
    for (let i = 0; i < 8; i++) {
      this.member[i] = new PartyMember(dw, offset + 0 + i * 448);
    }
    this.partyId = dw.getBigUint64(offset + 3584, true);
    this.channelId = dw.getBigUint64(offset + 3592, true);
    this.leaderIndex = dw.getUint8(offset + 3600);
    this.partySize = dw.getUint8(offset + 3601);
    this.padding1 = dw.getUint16(offset + 3602, true);
    this.padding2 = dw.getUint32(offset + 3604, true);
  }
}
export class FFXIVIpcPartyUpdate extends IpcPacket {
  executeContentId: bigint;
  targetContentId: bigint;
  executeGender: number;
  targetGender: number;
  updateStatus: number;
  partySize: number;
  executeName: number[];
  targetName: number[];
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.executeContentId = dw.getBigUint64(offset + 0, true);
    this.targetContentId = dw.getBigUint64(offset + 8, true);
    this.executeGender = dw.getUint8(offset + 16);
    this.targetGender = dw.getUint8(offset + 17);
    this.updateStatus = dw.getUint16(offset + 18, true);
    this.partySize = dw.getUint8(offset + 20);
    this.executeName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.executeName[i] = dw.getInt8(offset + 21 + i * 1);
    }
    this.targetName = new Array(32);
    for (let i = 0; i < 32; i++) {
      this.targetName[i] = dw.getInt8(offset + 53 + i * 1);
    }
    this.padding = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding[i] = dw.getUint8(offset + 85 + i * 1);
    }
  }
}
export class FFXIVIpcEventReturn extends IpcPacket {
  eventId: number;
  scene: number;
  unknown: number;
  unknown2: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.scene = dw.getUint16(offset + 4, true);
    this.unknown = dw.getUint16(offset + 6, true);
    this.unknown2 = dw.getBigUint64(offset + 8, true);
  }
}
export class FFXIVDirectorMsg4 extends IpcPacket {
  param: number[];
  unknown: bigint;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.param = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.param[i] = dw.getUint32(offset + 0 + i * 4, true);
    }
    this.unknown = dw.getBigUint64(offset + 16, true);
  }
}
export class FFXIVCeremonySetActorAppearance extends IpcPacket {
  u1: number;
  questBL: number;
  padding1: number;
  u3: number;
  mainWeaponModel: bigint;
  secWeaponModel: bigint;
  craftToolModel: bigint;
  c_u6: number;
  c_u7: number;
  charId: number;
  u4: number;
  guardianDeity: number;
  u5: number;
  models: number[];
  unknown: number[];
  look: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.u1 = dw.getUint8(offset + 0);
    this.questBL = dw.getUint8(offset + 1);
    this.padding1 = dw.getUint16(offset + 2, true);
    this.u3 = dw.getUint32(offset + 4, true);
    this.mainWeaponModel = dw.getBigUint64(offset + 8, true);
    this.secWeaponModel = dw.getBigUint64(offset + 16, true);
    this.craftToolModel = dw.getBigUint64(offset + 24, true);
    this.c_u6 = dw.getUint32(offset + 32, true);
    this.c_u7 = dw.getUint32(offset + 36, true);
    this.charId = dw.getUint32(offset + 40, true);
    this.u4 = dw.getUint16(offset + 44, true);
    this.guardianDeity = dw.getUint16(offset + 46, true);
    this.u5 = dw.getUint32(offset + 48, true);
    this.models = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.models[i] = dw.getUint32(offset + 52 + i * 4, true);
    }
    this.unknown = new Array(10);
    for (let i = 0; i < 10; i++) {
      this.unknown[i] = dw.getUint8(offset + 92 + i * 1);
    }
    this.look = new Array(26);
    for (let i = 0; i < 26; i++) {
      this.look[i] = dw.getUint8(offset + 102 + i * 1);
    }
  }
}
export class FFXIVIpcMapUpdateN extends IpcPacket {
  entryCount: number;
  padding: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.entryCount = dw.getUint8(offset + 0);
    this.padding = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.padding[i] = dw.getUint8(offset + 1 + i * 1);
    }
  }
}
export class FFXIVIpcEnvironmentControl extends IpcPacket {
  directorId: number;
  state: number;
  param3: number;
  param4: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.directorId = dw.getUint32(offset + 0, true);
    this.state = dw.getUint32(offset + 4, true);
    this.param3 = dw.getUint16(offset + 8, true);
    this.param4 = dw.getUint16(offset + 10, true);
  }
}
export class FFXIVIpcRemoteServerValue extends IpcPacket {
  value_size: number;
  key_str: number[];
  value_str: number[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.value_size = dw.getUint32(offset + 0, true);
    this.key_str = new Array(48);
    for (let i = 0; i < 48; i++) {
      this.key_str[i] = dw.getInt8(offset + 4 + i * 1);
    }
    this.value_str = new Array(1024);
    for (let i = 0; i < 1024; i++) {
      this.value_str[i] = dw.getInt8(offset + 52 + i * 1);
    }
  }
}
export class FFXIVIpcStatusEffectList2 extends IpcPacket {
  unknown3: number;
  classId: number;
  level1: number;
  level2: number;
  level3: number;
  current_hp: number;
  max_hp: number;
  current_mp: number;
  max_mp: number;
  shieldPercentage: number;
  unknown1: number;
  unknown2: number;
  effect: StatusEffect[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown3 = dw.getUint32(offset + 0, true);
    this.classId = dw.getUint8(offset + 4);
    this.level1 = dw.getUint8(offset + 5);
    this.level2 = dw.getUint8(offset + 6);
    this.level3 = dw.getUint8(offset + 7);
    this.current_hp = dw.getUint32(offset + 8, true);
    this.max_hp = dw.getUint32(offset + 12, true);
    this.current_mp = dw.getUint16(offset + 16, true);
    this.max_mp = dw.getUint16(offset + 18, true);
    this.shieldPercentage = dw.getUint8(offset + 20);
    this.unknown1 = dw.getUint8(offset + 21);
    this.unknown2 = dw.getUint16(offset + 22, true);
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 24 + i * 12);
    }
  }
}
export class FFXIVIpcStatusEffectList3 extends IpcPacket {
  effect: StatusEffect[];

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.effect = new Array(30);
    for (let i = 0; i < 30; i++) {
      this.effect[i] = new StatusEffect(dw, offset + 0 + i * 12);
    }
  }
}
export class FFXIVIpcSystemLogMessage extends IpcPacket {
  eventId: number;
  messageId: number;
  paramSize: number;
  param1: number;
  param2: number;
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.eventId = dw.getUint32(offset + 0, true);
    this.messageId = dw.getUint32(offset + 4, true);
    this.paramSize = dw.getUint32(offset + 8, true);
    this.param1 = dw.getUint32(offset + 12, true);
    this.param2 = dw.getUint32(offset + 16, true);
    this.padding = dw.getUint32(offset + 20, true);
  }
}
export class FFXIVIpcWaymark extends IpcPacket {
  type: WaymarkType;
  status: WaymarkStatus;
  padding: number;
  x: number;
  y: number;
  z: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.padding = dw.getUint16(offset + 2, true);
    this.x = dw.getInt32(offset + 4, true);
    this.y = dw.getInt32(offset + 8, true);
    this.z = dw.getInt32(offset + 12, true);
  }
}
export class FFXIVIpcEventPlay4 extends IpcPacket {
  actorId: bigint;
  eventId: number;
  scene: number;
  padding: number;
  flags: number;
  param3: number;
  paramSize: number;
  param: number[];
  padding: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.actorId = dw.getBigUint64(offset + 0, true);
    this.eventId = dw.getUint32(offset + 8, true);
    this.scene = dw.getUint16(offset + 12, true);
    this.padding = dw.getUint16(offset + 14, true);
    this.flags = dw.getUint32(offset + 16, true);
    this.param3 = dw.getUint32(offset + 20, true);
    this.paramSize = dw.getUint32(offset + 24, true);
    this.param = new Array(4);
    for (let i = 0; i < 4; i++) {
      this.param[i] = dw.getUint32(offset + 28 + i * 4, true);
    }
    this.padding = dw.getUint32(offset + 44, true);
  }
}
export class FFXIVIpcGuessTargetAction extends IpcPacket {
  unknown00: number;
  unknown02: number;
  actionId: number;
  sequence: number;
  unknown0a: number;
  unknown0c: number;
  unknown0e: number;
  targetId: number;
  padding14: number;
  param1: number;
  unknown1c: number;

  constructor(dw: DataView, offset: number = 0) {
    super(dw, offset);
    offset += IpcPacket.PacketSize();
    this.unknown00 = dw.getUint16(offset + 0, true);
    this.unknown02 = dw.getUint16(offset + 2, true);
    this.actionId = dw.getUint32(offset + 4, true);
    this.sequence = dw.getUint16(offset + 8, true);
    this.unknown0a = dw.getUint16(offset + 10, true);
    this.unknown0c = dw.getUint16(offset + 12, true);
    this.unknown0e = dw.getUint16(offset + 14, true);
    this.targetId = dw.getUint32(offset + 16, true);
    this.padding14 = dw.getUint32(offset + 20, true);
    this.param1 = dw.getUint32(offset + 24, true);
    this.unknown1c = dw.getUint32(offset + 28, true);
  }
}
export class FFXIVARR_POSITION3 {
  X: number;
  Y: number;
  Z: number;

  constructor(dw: DataView, offset: number = 0) {
    this.X = dw.getFloat32(offset + 0, true);
    this.Y = dw.getFloat32(offset + 4, true);
    this.Z = dw.getFloat32(offset + 8, true);
  }
}

