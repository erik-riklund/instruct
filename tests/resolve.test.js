import group from "../testing.js";
import { resolve } from "../index.js";

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
      ]
    ]
  })
);
