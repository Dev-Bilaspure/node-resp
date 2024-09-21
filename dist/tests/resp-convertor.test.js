"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const resp_convertors_1 = __importStar(require("../src/resp-convertors"));
describe("serializeToRESP", () => {
    // Test for null input
    it("should correctly serialize null to RESP format", () => {
        expect((0, resp_convertors_1.default)(null)).toBe("_\r\n");
    });
    // Test for boolean input
    it("should correctly serialize true to RESP format", () => {
        expect((0, resp_convertors_1.default)(true)).toBe("#t\r\n");
    });
    it("should correctly serialize false to RESP format", () => {
        expect((0, resp_convertors_1.default)(false)).toBe("#f\r\n");
    });
    // Test for number input
    it("should correctly serialize integer to RESP format", () => {
        expect((0, resp_convertors_1.default)(42)).toBe(":42\r\n");
    });
    it("should correctly serialize negative integer to RESP format", () => {
        expect((0, resp_convertors_1.default)(-42)).toBe(":-42\r\n");
    });
    it("should correctly serialize large integer to RESP bulk string to avoid precision issues", () => {
        const largeInt = Number.MAX_SAFE_INTEGER + 1;
        expect((0, resp_convertors_1.default)(largeInt)).toBe(`$${largeInt.toString().length}\r\n${largeInt}\r\n`);
    });
    it("should correctly serialize finite floating point numbers", () => {
        expect((0, resp_convertors_1.default)(3.14)).toBe(",3.14\r\n");
    });
    it("should correctly serialize infinity", () => {
        expect((0, resp_convertors_1.default)(Infinity)).toBe("$8\r\nInfinity\r\n");
    });
    it("should correctly serialize negative infinity", () => {
        expect((0, resp_convertors_1.default)(-Infinity)).toBe("$9\r\n-Infinity\r\n");
    });
    it("should correctly serialize NaN", () => {
        expect((0, resp_convertors_1.default)(NaN)).toBe(",nan\r\n");
    });
    // Test for string input
    it("should correctly serialize bulk string to RESP format", () => {
        expect((0, resp_convertors_1.default)("hello")).toBe("$5\r\nhello\r\n");
    });
    it("should correctly serialize simple string to RESP format", () => {
        expect((0, resp_convertors_1.stringToRESP)("OK", "simple")).toBe("+OK\r\n");
    });
    it("should correctly serialize bulk string to RESP format", () => {
        expect((0, resp_convertors_1.stringToRESP)("Hello, world!", "bulk")).toBe("$13\r\nHello, world!\r\n");
    });
    it("should correctly serialize simple string to RESP format", () => {
        expect((0, resp_convertors_1.stringToRESP)("Hello, world!", "simple")).toBe("+Hello, world!\r\n");
    });
    // Test for array input
    it("should correctly serialize an empty array", () => {
        expect((0, resp_convertors_1.default)([])).toBe("*0\r\n");
    });
    it("should correctly serialize an array of strings", () => {
        expect((0, resp_convertors_1.default)(["foo", "bar"])).toBe("*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n");
    });
    it("should correctly serialize a mixed array", () => {
        expect((0, resp_convertors_1.default)([42, "foo", null, true])).toBe("*4\r\n:42\r\n$3\r\nfoo\r\n_\r\n#t\r\n");
    });
    // Test for object input
    it("should correctly serialize an empty object", () => {
        expect((0, resp_convertors_1.default)({})).toBe("%0\r\n");
    });
    it("should correctly serialize an object with string keys and mixed values", () => {
        const obj = { foo: 42, bar: "hello", baz: true };
        expect((0, resp_convertors_1.default)(obj)).toBe(`%3\r\n$3\r\nfoo\r\n:42\r\n$3\r\nbar\r\n$5\r\nhello\r\n$3\r\nbaz\r\n#t\r\n`);
    });
    // Test for unsupported data type
    it("should throw an error for unsupported data types like function", () => {
        expect(() => (0, resp_convertors_1.default)(() => { })).toThrow("Unsupported data type.");
    });
    it("should throw an error for unsupported symbol data type", () => {
        expect(() => (0, resp_convertors_1.default)(Symbol("test"))).toThrow("Unsupported data type.");
    });
});
