export function slurp(val1, val2, amt) {
    return (val2 - val1) * amt + val1;
}

export function clamp(amt, val1, val2) {
    if (amt < val1) {
        return val1;
    }
    if (amt > val2) {
        return val2;
    }
    return amt;
}