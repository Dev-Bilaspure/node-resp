"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const resp_convertors_1 = require("../src/resp-convertors");
describe('serializeToRESP', () => {
    test('should convert null to RESP', () => {
        expect((0, src_1.serializeToRESP)(null)).toBe('_\r\n');
    });
    test('should convert booleans to RESP', () => {
        expect((0, src_1.serializeToRESP)(true)).toBe('#t\r\n');
        expect((0, src_1.serializeToRESP)(false)).toBe('#f\r\n');
    });
    test('should convert integers to RESP', () => {
        expect((0, src_1.serializeToRESP)(123)).toBe(':123\r\n');
        expect((0, src_1.serializeToRESP)(-456)).toBe(':-456\r\n');
    });
    test('should convert large integers to RESP bulk string', () => {
        const largeInt = Number.MAX_SAFE_INTEGER + 1;
        expect((0, src_1.serializeToRESP)(largeInt)).toBe(`$${largeInt.toString().length}\r\n${largeInt}\r\n`);
    });
    test('should convert floating-point numbers to RESP', () => {
        expect((0, src_1.serializeToRESP)(123.456)).toBe(',123.456\r\n');
        expect((0, src_1.serializeToRESP)(-789.012)).toBe(',-789.012\r\n');
    });
    test('should convert special numbers to RESP', () => {
        expect((0, src_1.serializeToRESP)(Infinity)).toBe(',inf\r\n');
        expect((0, src_1.serializeToRESP)(-Infinity)).toBe(',-inf\r\n');
        expect((0, src_1.serializeToRESP)(NaN)).toBe(',nan\r\n');
    });
    test('should convert strings to RESP bulk string by default', () => {
        expect((0, src_1.serializeToRESP)('hello')).toBe('$5\r\nhello\r\n');
    });
    test('should convert arrays to RESP', () => {
        expect((0, src_1.serializeToRESP)([null, true, 123, 'text'])).toBe('*4\r\n_\r\n#t\r\n:123\r\n$4\r\ntext\r\n');
    });
    test('should convert objects to RESP', () => {
        const obj = { key1: 'value1', key2: 42, key3: false };
        expect((0, src_1.serializeToRESP)(obj)).toBe('%3\r\n$4\r\nkey1\r\n$6\r\nvalue1\r\n$4\r\nkey2\r\n:42\r\n$4\r\nkey3\r\n#f\r\n');
    });
    test('should throw error for unsupported data types', () => {
        expect(() => (0, src_1.serializeToRESP)(undefined)).toThrow('Unsupported data type.');
        expect(() => (0, src_1.serializeToRESP)(() => { })).toThrow('Unsupported data type.');
        expect(() => (0, src_1.serializeToRESP)(Symbol('sym'))).toThrow('Unsupported data type.');
    });
    // Additional tests for stringToRESP with different types
    test('should convert strings to RESP simple string', () => {
        const simpleString = 'OK';
        expect((0, src_1.serializeToRESP)(simpleString)).toBe(`$2\r\nOK\r\n`); // Default is bulk, adjust if needed
    });
    test('should convert verbatim strings correctly', () => {
        const verbatimString = 'Hello, world!';
        const encodingHint = 'txt:';
        const totalLength = Buffer.byteLength(verbatimString, 'utf8') + encodingHint.length;
        expect((0, resp_convertors_1.stringToRESP)(verbatimString, 'verbatim')).toBe(`=${totalLength}\r\n${encodingHint}${verbatimString}\r\n`);
    });
    // Nested arrays and objects
    test('should convert nested arrays to RESP', () => {
        const nestedArray = [1, [2, 3], 'four'];
        expect((0, src_1.serializeToRESP)(nestedArray)).toBe('*3\r\n:1\r\n*2\r\n:2\r\n:3\r\n$4\r\nfour\r\n');
    });
    test('should convert nested objects to RESP', () => {
        const nestedObject = { outer: { innerKey: 'innerValue' }, number: 5 };
        expect((0, src_1.serializeToRESP)(nestedObject)).toBe('%2\r\n$5\r\nouter\r\n%1\r\n$8\r\ninnerKey\r\n$10\r\ninnerValue\r\n$6\r\nnumber\r\n:5\r\n');
    });
});
