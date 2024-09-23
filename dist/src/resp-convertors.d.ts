/**
 * Serializes various data types to the Redis Serialization Protocol (RESP) format.
 *
 * @param {any} data - The data to serialize, which can be of type null, boolean, number, string, array, or object.
 * @returns {string} The serialized RESP string.
 * @throws {Error} If the data type is unsupported.
 */
declare function serializeToRESP(data: any): string;
/**
 * Converts null to the RESP format.
 *
 * @returns {string} The serialized RESP string for null.
 */
export declare function nullToRESP(): string;
/**
 * Converts a boolean to the RESP format.
 *
 * @param {boolean} bool - The boolean value to serialize.
 * @returns {string} The serialized RESP string for the boolean.
 */
export declare function booleanToRESP(bool: boolean): string;
/**
 * Converts a number to the RESP format.
 * Handles integers, floating-point numbers, and special values like Infinity and NaN.
 *
 * @param {number} num - The number to serialize.
 * @returns {string} The serialized RESP string for the number.
 */
export declare function numberToRESP(num: number): string;
/**
 * Converts a string to the RESP format.
 *
 * @param {string} str - The string to serialize.
 * @param {"bulk" | "simple"} [type="bulk"] - The type of string to serialize ("bulk" or "simple").
 * @returns {string} The serialized RESP string for the input string.
 * @throws {Error} If an unsupported string type is provided.
 */
export declare function stringToRESP(str: string, type?: "bulk" | "simple"): string;
/**
 * Converts an array to the RESP format.
 *
 * @param {Array<any>} arr - The array to serialize.
 * @returns {string} The serialized RESP string for the array.
 */
export declare function arrayToRESP(arr: Array<any>): string;
/**
 * Converts an object to the RESP format.
 *
 * @param {Record<string, any>} obj - The object to serialize.
 * @returns {string} The serialized RESP string for the object.
 */
export declare function objectToRESP(obj: Record<string, any>): string;
export default serializeToRESP;
//# sourceMappingURL=resp-convertors.d.ts.map