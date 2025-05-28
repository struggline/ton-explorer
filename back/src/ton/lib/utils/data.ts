export function toUnsignedHex64(value: bigint): string {
    if (value < 0n) {
        value += 1n << 64n;
    }
    return value.toString(16).padStart(16, "0");
}

export function intToIP(int: number) {
    var part1 = int & 255;
    var part2 = (int >> 8) & 255;
    var part3 = (int >> 16) & 255;
    var part4 = (int >> 24) & 255;

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

export function bigIntToBuffer(data: bigint | undefined) {
    if (!data) {
        return Buffer.from([]);
    }
    const hexStr = data.toString(16);
    const pad = hexStr.padStart(64, "0");
    const hashHex = Buffer.from(pad, "hex");

    return hashHex;
}
