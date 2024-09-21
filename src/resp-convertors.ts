function serializeToRESP(data: any): string {
  if (data === null) {
    return nullToRESP();
  } else if (typeof data === "boolean") {
    return booleanToRESP(data);
  } else if (typeof data === "number") {
    return numberToRESP(data);
  } else if (typeof data === "string") {
    return stringToRESP(data);
  } else if (Array.isArray(data)) {
    return arrayToRESP(data);
  } else if (typeof data === "object") {
    return objectToRESP(data);
  } else {
    throw new Error("Unsupported data type.");
  }
}

export function nullToRESP(): string {
  return `_\r\n`;
}

export function booleanToRESP(bool: boolean): string {
  return `#${bool ? "t" : "f"}\r\n`;
}

export function numberToRESP(num: number): string {
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    // Convert large integers to bulk strings to avoid precision issues
    return `$${num.toString().length}\r\n${num}\r\n`;
  } else if (Number.isInteger(num)) {
    return `:${num}\r\n`;
  } else if (Number.isFinite(num)) {
    return `,${num}\r\n`;
  } else if (num === Infinity) {
    return `,inf\r\n`;
  } else if (num === -Infinity) {
    return `,-inf\r\n`;
  } else {
    return `,nan\r\n`;
  }
}

export function stringToRESP(
  str: string,
  type: "bulk" | "simple" = "bulk"
): string {
  const data = str;
  const length = Buffer.byteLength(data, "utf8");

  if (type === "bulk") {
    return `$${length}\r\n${data}\r\n`;
  } else if (type === "simple") {
    return `+${data}\r\n`;
  } else {
    throw new Error('Unsupported type. Use "verbatim", "bulk", or "simple".');
  }
}

export function arrayToRESP(arr: Array<any>): string {
  let result = `*${arr.length}\r\n`;
  arr.forEach((element) => {
    result += serializeToRESP(element);
  });
  return result;
}

export function objectToRESP(obj: Record<string, any>): string {
  let result = `%${Object.keys(obj).length}\r\n`;
  Object.entries(obj).forEach(([key, value]) => {
    result += `${stringToRESP(key)}${serializeToRESP(value)}`;
  });
  return result;
}

// Test case
// console.log(stringToRESP("FULLRESYNC 0", "simple"));

// console.log(serializeToRESP("Hello, world!"));

export default serializeToRESP;
