import { check, checkAsync } from "./index";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
  mock,
} from "bun:test";

// Helper function that throws on division by zero
function divideNumbers(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

describe("check and checkAsync functions", () => {
  describe("check function", () => {
    test("successfully parses valid JSON", () => {
      const validJson = '{"name": "John", "age": 30}';
      const result = check(JSON.parse, validJson);
      expect(result).toEqual({ name: "John", age: 30 });
    });

    test("returns Error for invalid JSON", () => {
      const invalidJson = "{invalid json}";
      const result = check(JSON.parse, invalidJson);
      expect(result).toBeInstanceOf(Error);
    });

    test("handles function with no arguments", () => {
      const noArgsFunc = () => 42;
      const result = check(noArgsFunc);
      expect(result).toBe(42);
    });

    test("handles function with multiple arguments", () => {
      const multiplyThree = (a: number, b: number, c: number) => a * b * c;
      const result = check(multiplyThree, 2, 3, 4);
      expect(result).toBe(24);
    });

    test("handles division by zero error", () => {
      const result = check(divideNumbers, 10, 0);
      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe(
        "Error: Division by zero is not allowed",
      );
    });

    test("successfully divides numbers", () => {
      const result = check(divideNumbers, 10, 2);
      expect(result).toBe(5);
    });
  });

  describe("checkAsync function", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      mock.restore();
    });

    test("successfully fetches data", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(new Response());

      const result = await checkAsync(async () => {
        const response = await fetch("https://api.example.com/data");
        return response;
      });

      expect(result).toBeInstanceOf(Response);
    });

    test("handles fetch error", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await checkAsync(async () => {
        const response = await fetch("https://api.example.com/data");
        return response;
      });

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe("Error: Network error");
    });

    test("fetches and retrieves json", async () => {
      const mockData = { name: "John", lastName: "Doe" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      });

      const result = await checkAsync(async () => {
        const response = await fetch("https://api.example.com/data");
        return response.json();
      });

      expect(result).toBe(mockData);
    });

    test("fetches but fails to retrieve json", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce({
        json: () => Promise.resolve(),
      });

      const result = await checkAsync(async () => {
        const response = await fetch("https://api.example.com/data");
        return response.json();
      });

      expect(result).toBeInstanceOf(Error);
    });

    test("handles async function with no arguments", async () => {
      const asyncNoArgs = async () => "async result";
      const result = await checkAsync(asyncNoArgs);
      expect(result).toBe("async result");
    });

    test("handles async function with multiple arguments", async () => {
      const asyncSum = async (a: number, b: number, c: number) =>
        Promise.resolve(a + b + c);
      const result = await checkAsync(asyncSum, 1, 2, 3);
      expect(result).toBe(6);
    });

    test("handles async function that throws", async () => {
      const asyncThrow = async () => {
        throw new Error("Async error");
      };
      const result = await checkAsync(asyncThrow);
      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toBe("Error: Async error");
    });
  });
});
