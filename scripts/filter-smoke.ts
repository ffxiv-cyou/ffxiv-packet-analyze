import { readFileSync } from "node:fs";
import { FilterSymbols } from "../src/model/filter/symbols";
import { compileFilter } from "../src/model/filter/compiler";
import { complete } from "../src/model/filter/complete";

interface RawOpcodeEntry {
    name: string;
    opcode: number;
}

const ipc = JSON.parse(readFileSync("public/data/7.5/ipc_structs.json", "utf8"));
const db = JSON.parse(readFileSync("public/data/7.5/db.json", "utf8"));
const opcodeList = JSON.parse(readFileSync("public/data/7.5/opcode.json", "utf8"));

const entry = opcodeList.find((e: { region: string }) => e.region === "CN");
const client = new Map<number, string>(
    entry.lists.ClientZoneIpcType.map((i: RawOpcodeEntry) => [i.opcode, i.name]),
);
const server = new Map<number, string>(
    entry.lists.ServerZoneIpcType.map((i: RawOpcodeEntry) => [i.opcode, i.name]),
);

const symbols = new FilterSymbols({ ipc, db, opcodeNames: { client, server } });

function opcodeOf(name: string): { opcode: number; dir: boolean } {
    for (const [opcode, n] of client) if (n === name) return { opcode, dir: true };
    for (const [opcode, n] of server) if (n === name) return { opcode, dir: false };
    throw new Error(`opcode not found: ${name}`);
}

interface Packet {
    type: string;
    name: string;
    dir: boolean;
    conn: string;
    epoch: number;
    opcode: number;
    length: number;
    data: Uint8Array;
}

function makePacket(ipcName: string, build: (dw: DataView) => void): Packet {
    const { opcode, dir } = opcodeOf(ipcName);
    const payload = new Uint8Array(4096);
    build(new DataView(payload.buffer));
    const data = new Uint8Array(32 + payload.length);
    const header = new DataView(data.buffer);
    header.setUint32(0, data.length, true);
    header.setUint32(4, 0x11111111, true);
    header.setUint32(8, 0x22222222, true);
    header.setUint16(18, opcode, true);
    data.set(payload, 32);
    return { type: "otk::packet", name: "test", dir, conn: "", epoch: 0, opcode, length: data.length, data };
}

const logMsg = makePacket("ActorControlSelf", (dw) => {
    dw.setUint16(0, 517, true);
    dw.setUint32(4, 7313, true);
});

const statusGain = makePacket("ActorControlSelf", (dw) => {
    dw.setUint16(0, 20, true);
    dw.setUint32(4, 1, true);
});

const plain = makePacket("Examine", (dw) => {
    dw.setUint8(2, 24);
    dw.setUint32(63, 1, true);
});

const statusList = makePacket("StatusEffectList", (dw) => {
    dw.setUint8(0, 24);
    dw.setUint16(20 + 12, 1, true); // effect[1].effect_id = 石化
});

const spawn = makePacket("PlayerSpawn", (dw) => {
    const bytes = new TextEncoder().encode("Jim Bob");
    new Uint8Array(dw.buffer, dw.byteOffset + 594, 32).set(bytes);
});

const clientTrigger = makePacket("UpdateClassInfo", (dw) => {
    dw.setUint8(0, 24);
    dw.setUint16(2, 90, true);
});

let failures = 0;

function check(label: string, expr: string, packet: Packet, expected: boolean) {
    const compiled = compileFilter(expr, symbols);
    const errors = compiled.diagnostics.filter((d) => d.severity === "error");
    if (errors.length > 0) {
        failures++;
        console.log(`FAIL ${label}: ${expr}\n     compile errors: ${errors.map((e) => e.message).join("; ")}`);
        return;
    }
    const actual = compiled.predicate(packet);
    const mark = actual === expected ? "ok  " : "FAIL";
    if (actual !== expected) failures++;
    console.log(`${mark} ${label}: ${expr} => ${actual}`);
}

console.log("=== evaluation ===");
check("原例", "ActorControlSelf.category == 109 && ActorControlSelf.param1 == 231560", logMsg, false);
check("判别式", "ActorControlSelf.category == LogMsg && ActorControlSelf.param1 == 7313", logMsg, true);
check("点号子类型", "ActorControlSelf.LogMsg.param1 == 7313", logMsg, true);
check("子类型不匹配", "ActorControlSelf.StatusEffectGain.param1 == 1", logMsg, false);
check("状态本地化", "ActorControlSelf.StatusEffectGain.param1 == 石化", statusGain, true);
check("状态数字", "ActorControlSelf.StatusEffectGain.param1 == 1", statusGain, true);
check("类型测试", "ActorControlSelf", logMsg, true);
check("类型测试反例", "ActorControlSelf", plain, false);
check("ipc.name", "ipc.name == ActorControlSelf", logMsg, true);
check("opcode 名", "packet.opcode == ActorControlSelf", logMsg, true);
check("short-circuit 顺序", "ActorControlSelf.category == LogMsg && ActorControlSelf.param1 == 7313", plain, false);
check("缺值时 !=", "ActorControlSelf.param1 != 7313", plain, false);
check("缺值时取反", "!(ActorControlSelf.param1 == 7313)", plain, true);
check("has 真", "has(ActorControlSelf.LogMsg.param1)", logMsg, true);
check("has 假", "has(ActorControlSelf.StatusEffectGain.param1)", logMsg, false);
check("dir", `packet.dir == ${opcodeOf("ActorControlSelf").dir ? "c" : "s"}`, logMsg, true);
check("self", "packet.self == false", logMsg, true);
check("hdr", "hdr.src == 0x11111111", logMsg, true);
check("data 字节", "data[18] == (packet.opcode & 0xff)", logMsg, true);
check("payload 切片", "payload[0:2] == 517", logMsg, true);
check("位运算", "(UpdateClassInfo.level & 0xff) == 90", clientTrigger, true);
check("本地化名", 'Examine.catalogId == "金币"', plain, true);
check("本地化裸名", "Examine.catalogId == 金币", plain, true);
check("类本地化", "UpdateClassInfo.classId == 白魔法师", clientTrigger, true);
check("字符串等于", 'packet.conn == ""', logMsg, true);
check("字符串 startswith", 'packet.conn startswith ""', logMsg, true);
check("嵌套数组", "StatusEffectList.effect[1].effect_id == 石化", statusList, true);
check("嵌套数组反例", "StatusEffectList.effect[0].effect_id == 石化", statusList, false);
check("嵌套数组 has", "has(StatusEffectList.effect[1].effect_id)", statusList, true);
check("字符串 contains", 'PlayerSpawn.name contains "Jim"', spawn, true);
check("字符串 matches", 'PlayerSpawn.name matches "^Jim"', spawn, true);
check("字符串 equals 反例", 'PlayerSpawn.name == "Bob"', spawn, false);
check("in", "ipc.name in {ActorControlSelf, Examine}", plain, true);
check("not in", "ipc.name not in {ActorControlSelf}", plain, true);
check("opcode 列表兼容", "ActorControlSelf, Examine", logMsg, true);
check("opcode 数字列表", `0x${opcodeOf("ActorControlSelf").opcode.toString(16)}`, logMsg, true);

console.log("\n=== opcode prefilter ===");
for (const expr of [
    "ActorControlSelf.param1 == 1",
    "ActorControlSelf.param1 == 1 && Examine.catalogId == 1",
    "ActorControlSelf.param1 == 1 || Examine.catalogId == 1",
    "!(ActorControlSelf.param1 == 1)",
    "ActorControlSelf.param1 != 1",
    "ipc.name != ActorControlSelf",
    "ipc.name not in {ActorControlSelf}",
    "has(ActorControlSelf.param1)",
    "packet.self",
]) {
    const compiled = compileFilter(expr, symbols);
    console.log(`${expr} => opcodes ${compiled.opcodes ? compiled.opcodes.map((o) => "0x" + o.toString(16)).join(",") : "null"}`);
}

console.log("\n=== diagnostics ===");
for (const expr of [
    "ActorControlSelf.bogus == 1",
    "param1 == 1",
    "ActorControlSelf.param1 == \"x\"",
    'ActorControlSelf.param1 matches "("',
    "ActorControlSelf.param1 ==",
    "unknownThing == 1",
]) {
    const compiled = compileFilter(expr, symbols);
    console.log(`${expr} => valid=${compiled.valid} :: ${compiled.diagnostics.map((d) => d.message).join(" | ")}`);
}

console.log("\n=== completion ===");
for (const [text, caret] of [
    ["ActorControlSelf.", 17],
    ["ActorControlSelf.Log", 21],
    ["ActorControlSelf.category == Log", 31],
    ["Actor", 5],
    ["Examine.catalogId == 金", 21],
    ["StatusEffectList.effect[0].", 27],
    ["packet.opcode == Act", 18],
    ["packet.dir == c", 14],
] as [string, number][]) {
    const result = complete(text, caret, symbols);
    console.log(`${JSON.stringify(text)} => ${result ? result.items.slice(0, 6).map((i) => i.label).join(", ") : "null"}`);
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " FAILURES"}`);
process.exit(failures === 0 ? 0 : 1);
