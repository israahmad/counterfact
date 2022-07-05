import { Generator } from "../src/generator.js";

function uniqueNamer(name) {
  return function namer(takenNames) {
    let candidate = name;

    let index = 1;

    while (takenNames.has(candidate)) {
      candidate = name + index;
      index += 1;
    }

    return candidate;
  };
}

describe("a typescript Generator", () => {
  it("uses a namer function to find a unique name for an export", () => {
    const generator = new Generator();

    generator.export(
      "hello.ts",
      uniqueNamer("hello"),
      "/url",
      () => "first hello"
    );
    generator.export(
      "hello.ts",
      uniqueNamer("hello"),
      "/url",
      () => "second hello"
    );
    generator.export(
      "other-file.ts",
      uniqueNamer("hello"),
      "/url",
      () => "first hello"
    );

    expect(generator.files.get("hello.ts").exports.get("hello").print()).toBe(
      "first hello"
    );
    expect(generator.files.get("hello.ts").exports.get("hello1").print()).toBe(
      "second hello"
    );
    expect(
      generator.files.get("other-file.ts").exports.get("hello").print()
    ).toBe("first hello");
  });
});
