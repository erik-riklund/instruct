import group from "../testing.js";
import { render } from "../index.js";

group(
  ({ expect }) => ({
    tests: [
      [
        "should render an empty element",
        () => {
          const instructions = [
            ["open", "div"],
            ["text", ">"],
            ["close", "div"]
          ];
          const expected_result = "<div></div>";
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should render an element containing text content",
        () => {
          const instructions = [
            ["open", "div"],
            ["text", ">"],
            ["text", "Hello world"],
            ["close", "div"]
          ];
          const expected_result = "<div>Hello world</div>";
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should render an element with an unquoted attribute value and text content",
        () => {
          const instructions = [
            ["open", "div"],
            ["attribute", "class", "card"],
            ["text", ">"],
            ["text", "Hello world"],
            ["close", "div"]
          ];
          const expected_result = "<div class=card>Hello world</div>";
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should render a void element with a quoted attribute value",
        () => {
          const instructions = [
            ["open", "img"],
            ["attribute", "src", "/images/test.png"],
            ["text", ">"]
          ];
          const expected_result = '<img src="/images/test.png">';
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should render a void element with mixed attribute value types",
        () => {
          const instructions = [
            ["open", "img"],
            ["attribute", "src", "/images/test.png"],
            ["attribute", "width", 256],
            ["text", ">"]
          ];
          const expected_result = '<img src="/images/test.png" width=256>';
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should render a boolean attribute when true",
        () => {
          const instructions = [
            ["open", "button"],
            ["attribute", "disabled", true],
            ["text", ">"],
            ["close", "button"]
          ];
          const expected_result = "<button disabled></button>";
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should omit a boolean attribute when false",
        () => {
          const instructions = [
            ["open", "button"],
            ["attribute", "disabled", false],
            ["text", ">"],
            ["close", "button"]
          ];
          const expected_result = "<button></button>";
          expect(render(instructions)).toEqual(expected_result);
        }
      ],
      [
        "should execute a `resolve` instruction to render dynamic text content",
        () => {
          const instructions = [
            ["open", "div"],
            ["text", ">"],
            ["resolve", (data) => `Hello ${data.name}`],
            ["close", "div"]
          ];
          const result = render(instructions, { name: "Bob" });
          const expected_result = "<div>Hello Bob</div>";
          expect(result).toEqual(expected_result);
        }
      ],
      [
        "should execute a callback function in an `attribute` " +
        "instruction to render dynamic attribute values",
        () => {
          const instructions = [
            ["open", "body"],
            ["attribute", "data-theme", (data) => data.theme],
            ["text", ">"],
            ["close", "body"]
          ];
          const result = render(instructions, { theme: "light" });
          const expected_result = "<body data-theme=light></body>";
          expect(result).toEqual(expected_result);
        }
      ],
      [
        "should execute a `resolve` instruction returning a nested node structure",
        () => {
          const instructions = [
            ["open", "div"],
            ["text", ">"],
            ["resolve", ({ user }) => {
              return user ? ["h1", `Hello ${user.name}`] : null;
            }],
            ["close", "div"]
          ];
          const user = { name: "Bob" };
          const result = render(instructions, { user });
          const expected_result = "<div><h1>Hello Bob</h1></div>";
          expect(result).toEqual(expected_result);
        }
      ],
      [
        "should omit output when a `resolve` instruction returns null",
        () => {
          const instructions = [
            ["open", "div"],
            ["text", ">"],
            ["resolve", ({ user }) => {
              return user ? ["h1", `Hello ${user.name}`] : null;
            }],
            ["close", "div"]
          ];
          const result = render(instructions, { user: null });
          const expected_result = "<div></div>";
          expect(result).toEqual(expected_result);
        }
      ],
      [
        "should evaluate `defer` instructions after completing " +
        "rendering of the document tree",
        () => {
          const instructions = [
            ["open", "head"],
            ["text", ">"],
            ["invoke", (data) => {
              data.stacks = { metadata: [] };
            }],
            ["defer", (data) => {
              return ["$fragments", ...data.stacks.metadata];
            }],
            ["close", "head"],
            ["open", "body"],
            ["text", ">"],
            ["open", "h1"],
            ["text", ">"],
            ["invoke", ({ stacks }) => {
              stacks.metadata.push(["meta", { charset: "utf-8" }]);
            }],
            ["text", "Hello world"],
            ["close", "h1"],
            ["close", "body"]
          ];
          const expected_chunks = [
            "<head>",
            "<meta charset=utf-8>",
            "</head>",
            "<body>",
            "<h1>Hello world</h1>",
            "</body>"
          ];
          expect(render(instructions)).toEqual(expected_chunks.join(""));
        }
      ]
    ]
  })
);
