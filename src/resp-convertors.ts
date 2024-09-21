/**
 * Serializes various data types to the Redis Serialization Protocol (RESP) format.
 *
 * @param {any} data - The data to serialize, which can be of type null, boolean, number, string, array, or object.
 * @returns {string} The serialized RESP string.
 * @throws {Error} If the data type is unsupported.
 */
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

/**
 * Converts null to the RESP format.
 *
 * @returns {string} The serialized RESP string for null.
 */
export function nullToRESP(): string {
  return `_\r\n`;
}

/**
 * Converts a boolean to the RESP format.
 *
 * @param {boolean} bool - The boolean value to serialize.
 * @returns {string} The serialized RESP string for the boolean.
 */
export function booleanToRESP(bool: boolean): string {
  return `#${bool ? "t" : "f"}\r\n`;
}

/**
 * Converts a number to the RESP format.
 * Handles integers, floating-point numbers, and special values like Infinity and NaN.
 *
 * @param {number} num - The number to serialize.
 * @returns {string} The serialized RESP string for the number.
 */
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

/**
 * Converts a string to the RESP format.
 *
 * @param {string} str - The string to serialize.
 * @param {"bulk" | "simple"} [type="bulk"] - The type of string to serialize ("bulk" or "simple").
 * @returns {string} The serialized RESP string for the input string.
 * @throws {Error} If an unsupported string type is provided.
 */
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

/**
 * Converts an array to the RESP format.
 *
 * @param {Array<any>} arr - The array to serialize.
 * @returns {string} The serialized RESP string for the array.
 */
export function arrayToRESP(arr: Array<any>): string {
  let result = `*${arr.length}\r\n`;
  arr.forEach((element) => {
    result += serializeToRESP(element);
  });
  return result;
}

/**
 * Converts an object to the RESP format.
 *
 * @param {Record<string, any>} obj - The object to serialize.
 * @returns {string} The serialized RESP string for the object.
 */
export function objectToRESP(obj: Record<string, any>): string {
  let result = `%${Object.keys(obj).length}\r\n`;
  Object.entries(obj).forEach(([key, value]) => {
    result += `${stringToRESP(key)}${serializeToRESP(value)}`;
  });
  return result;
}

export default serializeToRESP;
