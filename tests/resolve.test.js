import group from "~/testing.js";
import { resolve } from "~/index.js";

group(
  ({ expect }) => ({
    tests: [
      [
        "should emit `open` and `close` instructions for a plain tag",
        () => {
          const node = ["body"];
          const expected_result = [
            ["open", "body"],
            ["text", ">"],
            ["close", "body"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit an `open` instruction with element attributes",
        () => {
          const node = ["div", { class: "card" }];
          const expected_result = [
            ["open", "div"],
            ["attribute", "class", "card"],
            ["text", ">"],
            ["close", "div"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit an `attribute` instruction with kebab-cased attribute names",
        () => {
          const node = [
            "body",
            { data_theme: "light" }
          ];
          const expected_result = [
            ["open", "body"],
            ["attribute", "data-theme", "light"],
            ["text", ">"],
            ["close", "body"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit nested instructions and text content for child nodes",
        () => {
          const node = [
            "section",
            ["h1", "Hello world"],
            ["p", "Lorem ipsum dolor sit amet"]
          ];
          const expected_result = [
            ["open", "section"],
            ["text", ">"],
            ["open", "h1"],
            ["text", ">"],
            ["text", "Hello world"],
            ["close", "h1"],
            ["open", "p"],
            ["text", ">"],
            ["text", "Lorem ipsum dolor sit amet"],
            ["close", "p"],
            ["close", "section"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit instructions preserving both attributes and nested child trees",
        () => {
          const node = [
            "section",
            { class: "card" },
            ["h1", "Hello world"],
            ["p", { class: "intro" }, "Lorem ipsum dolor sit amet"]
          ];
          const expected_result = [
            ["open", "section"],
            ["attribute", "class", "card"],
            ["text", ">"],
            ["open", "h1"],
            ["text", ">"],
            ["text", "Hello world"],
            ["close", "h1"],
            ["open", "p"],
            ["attribute", "class", "intro"],
            ["text", ">"],
            ["text", "Lorem ipsum dolor sit amet"],
            ["close", "p"],
            ["close", "section"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit a `resolve` instruction for callback content",
        () => {
          const callback = (data) => `Hello ${data.name}!`;
          const node = ["div", callback];
          const expected_result = [
            ["open", "div"],
            ["text", ">"],
            ["resolve", callback],
            ["close", "div"]
          ];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should emit `invoke` and `defer` instructions with handler functions for `$stack`",
        () => {
          const result = resolve(["$stack", "test"]);
          expect(result[0][0]).toBe("invoke");
          expect(typeof result[0][1]).toBe("function");
          expect(result[1][0]).toBe("defer");
          expect(typeof result[1][1]).toBe("function");
        }
      ],
      [
        "should emit instructions for `$fragments` children without container tags",
        () => {
          const node = ["$fragments", "Hello", "world"];
          const expected_result = [["text", "Hello"], ["text", "world"]];
          expect(resolve(node)).toEqual(expected_result);
        }
      ],
      [
        "should inline instructions for nested `$fragments` directly into parent elements",
        () => {
          const element = [
            "p",
            ["$fragments", "Hello", ["strong", "world"]]
          ];
          const expected_result = [
            ["open", "p"],
            ["text", ">"],
            ["text", "Hello"],
            ["open", "strong"],
            ["text", ">"],
            ["text", "world"],
            ["close", "strong"],
            ["close", "p"]
          ];
          expect(resolve(element)).toEqual(expected_result);
        }
      ]
    ]
  })
);
