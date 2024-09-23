/**
 * Parses a RESP (Redis Serialization Protocol) message into an array of its elements.
 *
 * @param {string} data - The RESP message to parse as a string.
 * @returns {any[]} An array containing the parsed elements from the RESP message. The array may contain nested arrays, strings, integers, null values, or error objects.
 * @throws {Error} If the RESP message is malformed.
 */
declare function parseRESPMessage(data: string): any[];
export default parseRESPMessage;
//# sourceMappingURL=parse-resp-message.d.ts.map