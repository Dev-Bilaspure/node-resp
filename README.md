# node-resp

**node-resp** is a fast and lightweight utility for parsing and serializing RESP (Redis Serialization Protocol) messages in Node.js. It supports a variety of data types including arrays, strings, integers, null values, and error messages, making it ideal for handling Redis communication.

## Features

- **Fast RESP serialization and deserialization**: Efficiently parse and serialize RESP messages.
- **Support for multiple data types**: Handles strings, integers, arrays, error messages, null values, and more.
- **Error handling**: Throws helpful errors when parsing malformed RESP messages.
- **Lightweight and optimized for performance**.

## Installation

```bash
npm install node-resp
```
```bash
yarn add node-resp
```

## Usage

### Serializing RESP messages

To serialize a RESP message, simply call the `serializeToRESP` function and pass in the data (data types: null, boolean, number, string, array, or object) you want to serialize.

```typescript
import serializeToRESP  from "node-resp";

const message = serializeToRESP("Hello, Redis!");
console.log(message);  // Outputs: $12\r\nHello, Redis!\r\n
```


### Parsing RESP Messages

To parse a RESP message, use the `parseRESPMessage` function and pass in the string representation of the message. It will return an array of the parsed elements.

```typescript
import parseRESPMessage from "node-resp";

const data = "*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n";
const result = parseRESPMessage(data);
console.log(result);  // Outputs: [ ['foo', 'bar'] ]
```

## API Reference

### `serializeToRESP(data: any): string`

Serializes a JavaScript object into a RESP message string.

- **Parameters**:
    - `data` *(any)*: The data to serialize (supports strings, numbers, arrays, objects, booleans, null).
- **Returns**:
    - A RESP formatted string.
- **Throws**:
    - `Error` if the data type is unsupported.

### `parseRESPMessage(data: string): any[]`

Parses a RESP message string into JavaScript objects.

- **Parameters**:
    - `data` *(string)*: The RESP message to parse.
- **Returns**:
    - An array representing the parsed RESP message.
- **Throws**:
    - `Error` if the RESP message is malformed.

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