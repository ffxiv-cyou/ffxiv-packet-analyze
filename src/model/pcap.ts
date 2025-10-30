
class GlobalHeader {
    magicNumber: number;
    versionMajor: number;
    versionMinor: number
    thisZone: number;
    sigFigs: number;
    snapLen: number;
    network: number;

    constructor(network: number = 228) {
        this.magicNumber = 0xa1b2c3d4;
        this.versionMajor = 2;
        this.versionMinor = 4;
        this.thisZone = 0;
        this.sigFigs = 0;
        this.snapLen = 65535;
        this.network = network; // 228 = LINKTYPE_IPV4
    }

    toArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(24);
        this.setArrayBuffer(buffer);

        return buffer;
    }

    setArrayBuffer(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset);
        view.setUint32(0, this.magicNumber, true);
        view.setUint16(4, this.versionMajor, true);
        view.setUint16(6, this.versionMinor, true);
        view.setInt32(8, this.thisZone, true);
        view.setUint32(12, this.sigFigs, true);
        view.setUint32(16, this.snapLen, true);
        view.setUint32(20, this.network, true);
        return offset + GlobalHeader.size();
    }

    static size(): number {
        return 24;
    }
}

class PacketHeader {
    tsSec: number;
    tsUsec: number;
    inclLen: number;
    origLen: number;
    constructor(timestamp: number, length: number) {
        this.tsSec = Math.floor(timestamp / 1000);
        this.tsUsec = (timestamp % 1000) * 1000;
        this.inclLen = length;
        this.origLen = length;
    }
    toArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(16);
        this.setArrayBuffer(buffer);
        return buffer;
    }
    setArrayBuffer(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset);
        view.setUint32(0, this.tsSec, true);
        view.setUint32(4, this.tsUsec, true);
        view.setUint32(8, this.inclLen, true);
        view.setUint32(12, this.origLen, true);
        return offset + PacketHeader.size();
    }
    static size(): number {
        return 16;
    }
}

class FfxivPacketHeader {
    unk1: number;
    unk2: number;
    unk3: number;
    unk4: number;
    timestamp: number;
    size: number;
    cType: number;
    count: number;
    encoding: number;
    compressed: number;
    constructor(size: number, timestamp: number) {
        this.unk1 = 0;
        this.unk2 = 0;
        this.unk3 = 0;
        this.unk4 = 0;
        this.timestamp = timestamp;
        this.size = size + FfxivPacketHeader.size();
        this.cType = 1; // Zone
        this.count = 1;
        this.encoding = 0;
        this.compressed = 0;
    }
    toArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(40);
        this.setArrayBuffer(buffer);
        return buffer;
    }

    setArrayBuffer(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset);
        view.setUint32(0, this.unk1, true);
        view.setUint32(4, this.unk2, true);
        view.setUint32(8, this.unk3, true);
        view.setUint32(12, this.unk4, true);
        view.setBigUint64(16, BigInt(this.timestamp), true);
        view.setUint32(24, this.size, true);
        view.setUint16(28, this.cType, true);
        view.setUint16(30, this.count, true);
        view.setInt8(32, this.encoding);
        view.setInt8(33, this.compressed);

        return offset + FfxivPacketHeader.size();
    }

    static size(): number {
        return 40;
    }
}

class IPv4PacketHeader {
    // Minimal IPv4 header for PCAP, can be expanded if needed
    versionIhl: number;
    totalLength: number;
    protocol: number;
    srcAddr: number;
    destAddr: number;
    constructor(length: number, protocol: number, srcAddr: number, destAddr: number) {
        this.versionIhl = 0x45; // Version 4, IHL 5
        this.totalLength = length + IPv4PacketHeader.size();
        this.protocol = protocol;
        this.srcAddr = srcAddr;
        this.destAddr = destAddr;
    }
    toArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(20);
        this.setArrayBuffer(buffer);
        return buffer;
    }

    setArrayBuffer(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset);
        view.setUint8(0, this.versionIhl);
        view.setUint16(2, this.totalLength, false);
        view.setUint8(8, 64); // TTL
        view.setUint8(9, this.protocol);
        view.setUint32(12, this.srcAddr, false);
        view.setUint32(16, this.destAddr, false);

        // calculate and set checksum
        let checksum = 0;
        for (let i = 0; i < 20; i += 2) {
            if (i === 10) continue;
            checksum += view.getUint16(i, false);
        }
        checksum = ~checksum & 0xffff;
        view.setUint16(10, checksum, false);

        return offset + IPv4PacketHeader.size();
    }

    static size(): number {
        return 20;
    }
}

class UdpPacketHeader {
    // Minimal UDP header for PCAP, can be expanded if needed
    srcPort: number;
    destPort: number;
    length: number;
    checksum: number;
    constructor(length: number, srcPort: number = 0, destPort: number = 0, checksum: number = 0) {
        this.srcPort = srcPort;
        this.destPort = destPort;
        this.length = length + UdpPacketHeader.size();
        this.checksum = checksum;
    }
    toArrayBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(8);
        this.setArrayBuffer(buffer);
        return buffer;
    }
    setArrayBuffer(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset);
        view.setUint16(0, this.srcPort, false);
        view.setUint16(2, this.destPort, false);
        view.setUint16(4, this.length, false);
        view.setUint16(6, this.checksum, false);
        return offset + UdpPacketHeader.size();
    }
    static size(): number {
        return 8;
    }
}

export function createPcapFile(packets: { epoch: number; data: Uint8Array }[]): ArrayBuffer {
    let totalLength = GlobalHeader.size();
    const headerSize = PacketHeader.size() + IPv4PacketHeader.size() + UdpPacketHeader.size() + FfxivPacketHeader.size();
    for (const packet of packets) {
        totalLength += headerSize + packet.data.byteLength;
    }

    const buffer = new ArrayBuffer(totalLength);
    let offset = 0;

    // Write global header
    const globalHeader = new GlobalHeader();
    offset = globalHeader.setArrayBuffer(buffer, offset);

    const udpPayloadSize = FfxivPacketHeader.size();
    const ipPayloadSize = UdpPacketHeader.size() + udpPayloadSize;
    const pcapPayloadSize = IPv4PacketHeader.size() + ipPayloadSize;

    // Write packet headers and data
    for (const packet of packets) {
        // Write PCAP packet header
        const packetHeader = new PacketHeader(packet.epoch, pcapPayloadSize + packet.data.byteLength);
        offset = packetHeader.setArrayBuffer(buffer, offset);

        // Write IPv4 header
        const ipv4Header = new IPv4PacketHeader(ipPayloadSize + packet.data.byteLength, 17, 0x7f000002, 0x7f000003); // Loopback addresses
        offset = ipv4Header.setArrayBuffer(buffer, offset);

        // Write UDP header
        const udpHeader = new UdpPacketHeader(udpPayloadSize + packet.data.byteLength, 65300, 65301);
        offset = udpHeader.setArrayBuffer(buffer, offset);

        // Write FFXIV packet header
        const header = new FfxivPacketHeader(packet.data.byteLength, packet.epoch);
        offset = header.setArrayBuffer(buffer, offset);

        // Write packet data
        if (packet.data.length >= 32 && packet.data[16] === 0x14 && packet.data[12] === 0)
            packet.data[12] = 3; // Fix omitted IPC flag by deucalion

        new Uint8Array(buffer, offset, packet.data.byteLength).set(packet.data);
        offset += packet.data.byteLength;
    }

    return buffer;
}