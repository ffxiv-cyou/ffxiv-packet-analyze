export function importFFXIVMonData(data: ArrayBuffer): { epoch: number; dir: boolean; opcode: number; data: Uint8Array }[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(new TextDecoder().decode(data), "application/xml");
    const packets: { epoch: number; dir: boolean; opcode: number; data: Uint8Array }[] = [];

    const captureNode = xmlDoc.getElementsByTagName("Capture")[0];
    if (!captureNode) {
        throw new Error("Invalid FFXIVMon data: missing <capture> node");
    }
    const packetsNode = captureNode.getElementsByTagName("Packets")[0];
    if (!packetsNode) {
        throw new Error("Invalid FFXIVMon data: missing <packets> node");
    }

    const packetNodes = packetsNode.getElementsByTagName("PacketEntry");
    for (let i = 0; i < packetNodes.length; i++) {
        const packetNode = packetNodes[i];
        const dir = packetNode.getElementsByTagName("Direction")[0]?.textContent;
        const sysTime = packetNode.getElementsByTagName("SystemMsTime")[0]?.textContent;
        const dataHex = packetNode.getElementsByTagName("Data")[0]?.textContent || "";
        const connection = packetNode.getElementsByTagName("Connection")[0];
        if (connection?.textContent !== "Game") 
            continue; // Skip non-game packet.

        const epoch = parseInt(sysTime || "0") - 62135625943000;
        const dataBytes = new Uint8Array(dataHex.match(/[\da-fA-F]{2}/g)?.map(b => parseInt(b, 16)) || []);
        if (dataBytes.length < 32)
            continue; // Invalid IPC data.

        const opcode = dataBytes.length >= 32 ? (dataBytes[19] << 8) | dataBytes[18] : 0;
        packets.push({ epoch, dir: dir === "C", opcode, data: dataBytes });
    }
    return packets;
}