import { describe, expect, it } from "vitest";
import { capitalize, cn, getEmbedUrl, parseAiResponse } from "./helper";

describe("cn (classnames)", () => {
  it("should join multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should filter out falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("should return empty string for no classes", () => {
    expect(cn()).toBe("");
  });

  it("should handle single class", () => {
    expect(cn("only")).toBe("only");
  });
});

describe("capitalize", () => {
  it("should capitalize first letter of each word", () => {
    expect(capitalize("hello world")).toBe("Hello World");
  });

  it("should handle single word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should lowercase before capitalizing", () => {
    expect(capitalize("HELLO WORLD")).toBe("Hello World");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("getEmbedUrl", () => {
  it("should return null for undefined", () => {
    expect(getEmbedUrl(undefined)).toBeNull();
  });

  it("should return null for invalid redirect URLs", () => {
    expect(getEmbedUrl("https://youtube.com/embeds_referring_euri")).toBeNull();
  });

  it("should convert youtube.com/watch?v= to embed URL", () => {
    expect(getEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("should convert youtu.be/ short URLs to embed URL", () => {
    expect(getEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("should convert youtube shorts URLs to embed URL", () => {
    expect(getEmbedUrl("https://www.youtube.com/shorts/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("should return already-embedded URLs as-is", () => {
    const embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    expect(getEmbedUrl(embedUrl)).toBe(embedUrl);
  });

  it("should pass through non-YouTube URLs", () => {
    const vimeoUrl = "https://vimeo.com/123456";
    expect(getEmbedUrl(vimeoUrl)).toBe(vimeoUrl);
  });

  it("should strip query params from video ID", () => {
    expect(
      getEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30"),
    ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
});

describe("parseAiResponse", () => {
  it("should parse valid JSON wrapped in markdown code blocks", () => {
    const response = { data: '```json\n{"name": "test"}\n```' };
    const result = parseAiResponse<{ name: string }>(response);
    expect(result).toEqual({ name: "test" });
  });

  it("should parse plain JSON string", () => {
    const response = { data: '{"count": 42}' };
    const result = parseAiResponse<{ count: number }>(response);
    expect(result).toEqual({ count: 42 });
  });

  it("should return null for non-string data", () => {
    const response = { data: 123 };
    expect(parseAiResponse(response)).toBeNull();
  });

  it("should return null for invalid JSON", () => {
    const response = { data: "not json at all" };
    expect(parseAiResponse(response)).toBeNull();
  });

  it("should return null for undefined response", () => {
    expect(parseAiResponse(undefined)).toBeNull();
  });
});
