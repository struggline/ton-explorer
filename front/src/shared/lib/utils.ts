export function boolToString(val: boolean) {
    return val ? "true" : "false";
}

export function trimAddr(addr: string) {
    return addr.substring(0, 4) + "..." + addr.substring(addr.length - 4);
}
