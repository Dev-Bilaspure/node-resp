"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullToRESP = nullToRESP;
exports.booleanToRESP = booleanToRESP;
exports.numberToRESP = numberToRESP;
exports.stringToRESP = stringToRESP;
exports.arrayToRESP = arrayToRESP;
exports.objectToRESP = objectToRESP;
function serializeToRESP(data) {
    if (data === null) {
        return nullToRESP();
    }
    else if (typeof data === "boolean") {
        return booleanToRESP(data);
    }
    else if (typeof data === "number") {
        return numberToRESP(data);
    }
    else if (typeof data === "string") {
        return stringToRESP(data);
    }
    else if (Array.isArray(data)) {
        return arrayToRESP(data);
    }
    else if (typeof data === "object") {
        return objectToRESP(data);
    }
    else {
        throw new Error("Unsupported data type.");
    }
}
function nullToRESP() {
    return `_\r\n`;
}
function booleanToRESP(bool) {
    return `#${bool ? "t" : "f"}\r\n`;
}
function numberToRESP(num) {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        // Convert large integers to bulk strings to avoid precision issues
        return `$${num.toString().length}\r\n${num}\r\n`;
    }
    else if (Number.isInteger(num)) {
        return `:${num}\r\n`;
    }
    else if (Number.isFinite(num)) {
        return `,${num}\r\n`;
    }
    else if (num === Infinity) {
        return `,inf\r\n`;
    }
    else if (num === -Infinity) {
        return `,-inf\r\n`;
    }
    else {
        return `,nan\r\n`;
    }
}
function stringToRESP(str, type = "bulk") {
    const data = str;
    const length = Buffer.byteLength(data, "utf8");
    if (type === "bulk") {
        return `$${length}\r\n${data}\r\n`;
    }
    else if (type === "simple") {
        return `+${data}\r\n`;
    }
    else {
        throw new Error('Unsupported type. Use "verbatim", "bulk", or "simple".');
    }
}
function arrayToRESP(arr) {
    let result = `*${arr.length}\r\n`;
    arr.forEach((element) => {
        result += serializeToRESP(element);
    });
    return result;
}
function objectToRESP(obj) {
    let result = `%${Object.keys(obj).length}\r\n`;
    Object.entries(obj).forEach(([key, value]) => {
        result += `${stringToRESP(key)}${serializeToRESP(value)}`;
    });
    return result;
}
// Test case
// console.log(stringToRESP("FULLRESYNC 0", "simple"));
// console.log(serializeToRESP("Hello, world!"));
exports.default = serializeToRESP;
