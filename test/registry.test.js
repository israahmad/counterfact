import { Registry } from "../src/registry.js";

describe("a scripted server", () => {
  it("knows if a handler exists for a request method at a path", () => {
    const registry = new Registry();

    registry.add("/hello", {
      async GET() {
        return await Promise.resolve({ body: "hello" });
      },
    });

    expect(registry.exists("GET", "/hello")).toBe(true);
    expect(registry.exists("POST", "/hello")).toBe(false);
    expect(registry.exists("GET", "/goodbye")).toBe(false);
  });

  it.todo("returns debug information if path does not exist");

  it("returns a function matching the URL and request method", async () => {
    const registry = new Registry();

    registry.add("/a", {
      async GET() {
        return await Promise.resolve({ body: "GET a" });
      },

      async POST() {
        return await Promise.resolve({ body: "POST a" });
      },
    });
    registry.add("/b", {
      async GET() {
        return await Promise.resolve({ body: "GET b" });
      },

      async POST() {
        return await Promise.resolve({ body: "POST b" });
      },
    });

    const props = {
      path: "",

      reduce(foo) {
        return foo;
      },

      store: {},
    };
    const getA = await registry.endpoint("GET", "/a")(props);
    const getB = await registry.endpoint("GET", "/b")(props);
    const postA = await registry.endpoint("POST", "/a")(props);
    const postB = await registry.endpoint("POST", "/b")(props);

    expect(getA.body).toBe("GET a");
    expect(getB.body).toBe("GET b");
    expect(postA.body).toBe("POST a");
    expect(postB.body).toBe("POST b");
  });
});