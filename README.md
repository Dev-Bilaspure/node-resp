# redis-resp-handler

**redis-resp-handler** is a fast and lightweight utility for parsing and serializing RESP (Redis Serialization Protocol) messages in Node.js. It supports a variety of data types including arrays, strings, integers, null values, and error messages, making it ideal for handling Redis communication.

## Features

- **Fast RESP serialization and deserialization**: Efficiently parse and serialize RESP messages.
- **Support for multiple data types**: Handles strings, integers, arrays, error messages, null values, and more.
- **Error handling**: Throws helpful errors when parsing malformed RESP messages.
- **Lightweight and optimized for performance**.

## Installation

```bash
npm install redis-resp-handler
```
```bash
yarn add redis-resp-handler
```

## Usage

### Serializing RESP messages

To serialize a RESP message, simply call the `serializeToRESP` function and pass in the data (data types: null, boolean, number, string, array, or object) you want to serialize.

```typescript
import { serializeToRESP } from "redis-resp-handler";

const message = serializeToRESP("Hello, Redis!");
console.log(message);  // Outputs: $12\r\nHello, Redis!\r\n
```


### Parsing RESP Messages

To parse a RESP message, use the `parseRESPMessage` function and pass in the string representation of the message. It will return an array of the parsed elements.

```typescript
import { parseRESPMessage } from "redis-resp-handler";

const data = "*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n";
const result = parseRESPMessage(data);
console.log(result);  // Outputs: [ ['foo', 'bar'] ]
```

## API Reference

1. `serializeToRESP(data: any): string`: Serializes a JavaScript object into a RESP message string.

- **Parameters**:
    - `data` *(any)*: The data to serialize (supports strings, numbers, arrays, objects, booleans, null).
- **Returns**:
    - A RESP formatted string.
- **Throws**:
    - `Error` if the data type is unsupported.

2. `parseRESPMessage(data: string): any[]`: Parses a RESP message string into JavaScript objects.

- **Parameters**:
    - `data` *(string)*: The RESP message to parse.
- **Returns**:
    - An array representing the parsed RESP message.
- **Throws**:
    - `Error` if the RESP message is malformed.

### Other Utility Methods

1. `nullToRESP(): string`: Converts `null` to the RESP format.

- **Returns**:
    - A RESP string representing `null` (e.g., `_\r\n`).

2. `booleanToRESP(bool: boolean): string`: Converts a boolean value to the RESP format.

- **Parameters**:
    - `bool` *(boolean)*: The boolean value to serialize.
- **Returns**:
    - A RESP string representing the boolean value (e.g., `#t\r\n` for true or `#f\r\n` for false).

3. `numberToRESP(num: number): string`: Converts a number to the RESP format. Handles integers, floating-point numbers, and special cases like `Infinity` and `NaN`.

- **Parameters**:
    - `num` *(number)*: The number to serialize.
- **Returns**:
    - A RESP string representing the number. For example:
        - Integer: `:42\r\n`
        - Floating-point: `,3.14\r\n`
        - `Infinity`: `,inf\r\n`
        - `NaN`: `,nan\r\n`
- **Throws**:
    - `Error` if the number is too large or small for safe integer serialization.

4. `stringToRESP(str: string, type: "bulk" | "simple" = "bulk"): string`: Converts a string to the RESP format.

- **Parameters**:
    - `str` *(string)*: The string to serialize.
    - `type` *(string, optional)*: The type of string, either `"bulk"` (default) or `"simple"`.
- **Returns**:
    - A RESP string representing the input string. For example:
        - Bulk string: `$11\r\nHello, Redis!\r\n`
        - Simple string: `+OK\r\n`
- **Throws**:
    - `Error` if an unsupported string type is provided.

5. `arrayToRESP(arr: Array<any>): string`: Converts an array to the RESP format. Recursively serializes all elements of the array.

- **Parameters**:
    - `arr` *(Array<any>)*: The array to serialize.
- **Returns**:
    - A RESP string representing the array. For example:
        - Array: `2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n`

6. `objectToRESP(obj: Record<string, any>): string`: Converts an object (key-value pairs) to the RESP format. The keys are serialized as strings, and the values are recursively serialized.

- **Parameters**:
    - `obj` *(Record<string, any>)*: The object to serialize.
- **Returns**:
    - A RESP string representing the object as a RESP map. For example:
        - Object: `%2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n$3\r\nbaz\r\n:42\r\n`


## Supported Data Types

- **Strings**: Simple and bulk strings.
- **Integers**: Serialized as RESP integers.
- **Arrays**: Nested arrays are supported.
- **Errors**: Parsed as JavaScript `Error` objects.
- **Null values**: Represented as `null`.
- **Booleans**: Serialized as RESP booleans.
- **Numbers**: Serialized as RESP floating-point numbers.
- **Objects**: Serialized as RESP bulk strings.
- **Complex data structures**: Supports nested arrays, objects, and mixed data types.

## License

This package is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.