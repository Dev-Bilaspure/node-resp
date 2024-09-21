import parseRESPMessage from "../src/parse-resp-message";

describe("parseRESPMessage", () => {
  // Simple string tests
  it("should parse a simple string correctly", () => {
    const resp = "+OK\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual(["OK"]);
  });

  // Bulk string tests
  it("should parse a bulk string correctly", () => {
    const resp = "$6\r\nfoobar\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual(["foobar"]);
  });

  it("should handle null bulk strings correctly", () => {
    const resp = "$-1\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([null]);
  });

  // Integer tests
  it("should parse an integer correctly", () => {
    const resp = ":1000\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([1000]);
  });

  // Error message tests
  it("should parse an error message correctly", () => {
    const resp = "-ERR unknown command 'foobar'\r\n";
    const result = parseRESPMessage(resp);
    expect(result[0]).toBeInstanceOf(Error);
    expect(result[0].message).toBe("ERR unknown command 'foobar'");
  });

  // Array tests
  it("should parse an empty array correctly", () => {
    const resp = "*0\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([[]]);
  });

  it("should parse an array of bulk strings correctly", () => {
    const resp = "*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([["foo", "bar"]]);
  });

  it("should parse an array with null elements correctly", () => {
    const resp = "*3\r\n$3\r\nfoo\r\n$-1\r\n$3\r\nbar\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([["foo", null, "bar"]]);
  });

  // Nested array tests
  it("should parse nested arrays correctly", () => {
    const resp = "*2\r\n*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n$3\r\nbaz\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([[["foo", "bar"], "baz"]]);
  });

  // Mixed data types array tests
  it("should parse an array with mixed data types correctly", () => {
    const resp = "*4\r\n$3\r\nfoo\r\n:42\r\n+OK\r\n$-1\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([["foo", 42, "OK", null]]);
  });

  // Edge case tests
  it("should handle incomplete RESP data (gracefully throw error)", () => {
    const resp = "$6\r\nfoo";
    expect(() => parseRESPMessage(resp)).toThrow(Error);
  });

  it("should handle unsupported RESP types (gracefully throw error)", () => {
    const resp = "!5\r\ninvalid\r\n";
    expect(() => parseRESPMessage(resp)).toThrow("Unsupported RESP type.");
  });

  it("should handle a complex array with nested arrays, nulls, errors, integers, and strings", () => {
    const resp =
      "*5\r\n$3\r\nfoo\r\n:42\r\n+OK\r\n$-1\r\n*2\r\n-ERR bad command\r\n$3\r\nbar\r\n";
    const result = parseRESPMessage(resp);

    expect(result[0][0]).toBe("foo");
    expect(result[0][1]).toBe(42);
    expect(result[0][2]).toBe("OK");
    expect(result[0][3]).toBe(null);
    expect(result[0][4]).toEqual([new Error("ERR bad command"), "bar"]);
  });

  // Empty response tests
  it("should return an empty array for empty input", () => {
    const resp = "";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([]);
  });

  it("should handle input with only carriage returns and newlines", () => {
    const resp = "\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual([]);
  });

  // Multiple simple responses
  it("should parse multiple simple responses in sequence", () => {
    const resp = "+OK\r\n+PONG\r\n";
    const result = parseRESPMessage(resp);
    expect(result).toEqual(["OK", "PONG"]);
  });
});
