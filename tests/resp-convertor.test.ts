import serializeToRESP, { stringToRESP } from "../src/resp-convertors";

describe("serializeToRESP", () => {
  // Test for null input
  it("should correctly serialize null to RESP format", () => {
    expect(serializeToRESP(null)).toBe("_\r\n");
  });

  // Test for boolean input
  it("should correctly serialize true to RESP format", () => {
    expect(serializeToRESP(true)).toBe("#t\r\n");
  });

  it("should correctly serialize false to RESP format", () => {
    expect(serializeToRESP(false)).toBe("#f\r\n");
  });

  // Test for number input
  it("should correctly serialize integer to RESP format", () => {
    expect(serializeToRESP(42)).toBe(":42\r\n");
  });

  it("should correctly serialize negative integer to RESP format", () => {
    expect(serializeToRESP(-42)).toBe(":-42\r\n");
  });

  it("should correctly serialize large integer to RESP bulk string to avoid precision issues", () => {
    const largeInt = Number.MAX_SAFE_INTEGER + 1;
    expect(serializeToRESP(largeInt)).toBe(
      `$${largeInt.toString().length}\r\n${largeInt}\r\n`
    );
  });

  it("should correctly serialize finite floating point numbers", () => {
    expect(serializeToRESP(3.14)).toBe(",3.14\r\n");
  });

  it("should correctly serialize infinity", () => {
    expect(serializeToRESP(Infinity)).toBe("$8\r\nInfinity\r\n");
  });

  it("should correctly serialize negative infinity", () => {
    expect(serializeToRESP(-Infinity)).toBe("$9\r\n-Infinity\r\n");
  });

  it("should correctly serialize NaN", () => {
    expect(serializeToRESP(NaN)).toBe(",nan\r\n");
  });

  // Test for string input
  it("should correctly serialize bulk string to RESP format", () => {
    expect(serializeToRESP("hello")).toBe("$5\r\nhello\r\n");
  });

  it("should correctly serialize simple string to RESP format", () => {
    expect(stringToRESP("OK", "simple")).toBe("+OK\r\n");
  });

  it("should correctly serialize bulk string to RESP format", () => {
    expect(stringToRESP("Hello, world!", "bulk")).toBe(
      "$13\r\nHello, world!\r\n"
    );
  });

  it("should correctly serialize simple string to RESP format", () => {
    expect(stringToRESP("Hello, world!", "simple")).toBe("+Hello, world!\r\n");
  });

  // Test for array input
  it("should correctly serialize an empty array", () => {
    expect(serializeToRESP([])).toBe("*0\r\n");
  });

  it("should correctly serialize an array of strings", () => {
    expect(serializeToRESP(["foo", "bar"])).toBe(
      "*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n"
    );
  });

  it("should correctly serialize a mixed array", () => {
    expect(serializeToRESP([42, "foo", null, true])).toBe(
      "*4\r\n:42\r\n$3\r\nfoo\r\n_\r\n#t\r\n"
    );
  });

  // Test for object input
  it("should correctly serialize an empty object", () => {
    expect(serializeToRESP({})).toBe("%0\r\n");
  });

  it("should correctly serialize an object with string keys and mixed values", () => {
    const obj = { foo: 42, bar: "hello", baz: true };
    expect(serializeToRESP(obj)).toBe(
      `%3\r\n$3\r\nfoo\r\n:42\r\n$3\r\nbar\r\n$5\r\nhello\r\n$3\r\nbaz\r\n#t\r\n`
    );
  });

  // Test for unsupported data type
  it("should throw an error for unsupported data types like function", () => {
    expect(() => serializeToRESP(() => {})).toThrow("Unsupported data type.");
  });

  it("should throw an error for unsupported symbol data type", () => {
    expect(() => serializeToRESP(Symbol("test"))).toThrow(
      "Unsupported data type."
    );
  });
});
