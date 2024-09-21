
/**
 * Parses a RESP (Redis Serialization Protocol) message into an array of its elements.
 *
 * @param {string} data - The RESP message to parse as a string.
 * @returns {any[]} An array containing the parsed elements from the RESP message. The array may contain nested arrays, strings, integers, null values, or error objects.
 * @throws {Error} If the RESP message is malformed.
 */
function parseRESPMessage(data: string): any[] {
  const result: any[] = [];
  let i = 0;

  while (i < data.length) {
    const type = data[i];

    if (!type || type === "\r" || type === "\n") {
      // Skip empty lines or only newline characters
      i++;
      continue;
    }

    i++;

    if (type === "*") {
      // Array
      const end = data.indexOf("\r\n", i);
      if (end === -1) throw new Error("Malformed RESP: Array length missing");
      const length = parseInt(data.slice(i, end));
      i = end + 2;

      if (length === -1) {
        result.push(null); // Handle null array
      } else {
        const array: any[] = [];
        for (let j = 0; j < length; j++) {
          const [element, newIndex] = parseRESPElement(data, i);
          array.push(element);
          i = newIndex;
        }
        result.push(array);
      }
    } else {
      const [element, newIndex] = parseRESPElement(data, i - 1);
      result.push(element);
      i = newIndex;
    }
  }

  return result;
}

/**
 * Parses a single RESP element starting at a given index in the input string.
 * 
 * @param {string} data - The RESP message string.
 * @param {number} start - The starting index for parsing the element.
 * @returns {[any, number]} A tuple where the first value is the parsed element (string, integer, null, error, or array) and the second value is the new index after parsing the element.
 * @throws {Error} If the RESP element is malformed or unsupported.
 */
function parseRESPElement(data: string, start: number): [any, number] {
  const type = data[start];
  let i = start + 1;

  if (!type) throw new Error("Malformed RESP: Missing type");

  if (type === "$") {
    // Bulk String
    const end = data.indexOf("\r\n", i);
    if (end === -1)
      throw new Error("Malformed RESP: Bulk string length missing");
    const length = parseInt(data.slice(i, end));
    i = end + 2;

    if (length === -1) {
      return [null, i]; // Null bulk string
    }

    const element = data.slice(i, i + length);
    if (element.length < length)
      throw new Error("Malformed RESP: Bulk string data incomplete");
    return [element, i + length + 2];
  } else if (type === "+") {
    // Simple String
    const end = data.indexOf("\r\n", i);
    if (end === -1) throw new Error("Malformed RESP: Simple string incomplete");
    const element = data.slice(i, end);
    return [element, end + 2];
  } else if (type === ":") {
    // Integer
    const end = data.indexOf("\r\n", i);
    if (end === -1) throw new Error("Malformed RESP: Integer incomplete");
    const element = parseInt(data.slice(i, end));
    return [element, end + 2];
  } else if (type === "-") {
    // Error Message
    const end = data.indexOf("\r\n", i);
    if (end === -1) throw new Error("Malformed RESP: Error message incomplete");
    const element = new Error(data.slice(i, end));
    return [element, end + 2];
  } else if (type === "*") {
    // Nested Array
    const end = data.indexOf("\r\n", i);
    if (end === -1) throw new Error("Malformed RESP: Array length missing");
    const length = parseInt(data.slice(i, end));
    i = end + 2;

    const array: any[] = [];
    for (let j = 0; j < length; j++) {
      const [element, newIndex] = parseRESPElement(data, i);
      array.push(element);
      i = newIndex;
    }
    return [array, i];
  } else {
    throw new Error("Unsupported RESP type.");
  }
}

export default parseRESPMessage;
