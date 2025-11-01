export function padHex(num: number, length: number): string {
    return num.toString(16).padStart(length, "0");
}

export function bytesToString(dw: DataView, offset: number): string {
    const decoder = new TextDecoder();
    let term = offset;
    for (; term < dw.byteLength; term++) {
        if (dw.getUint8(term) === 0) break;
    }

    const bytes = new Uint8Array(dw.buffer, offset, term - offset);
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