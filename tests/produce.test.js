import produce from "~/index.js";
import test from "~/library/testing.js";

test(
  "produce",
  ({ expect }) => [
    [
      "should produce simple HTML",
      () => {
        const node = ["h1", "Hello world"];
        const expected_result = "<h1>Hello world</h1>";
        expect(produce(node)).toBe(expected_result);
      }
    ],

    [
      "should produce nested HTML",
      () => {
        const node = ["div", ["h1", "Hello"], ["p", "World"]];
        const expected_result = "<div><h1>Hello</h1><p>World</p></div>";
        expect(produce(node)).toBe(expected_result);
      }
    ],

    [
      "should pass data to dynamic values",
      () => {
        const node = ["h1", (data) => `Hello ${data.name}!`];
        const expected_result = "<h1>Hello Alice!</h1>";
        expect(produce(node, { name: "Alice" })).toBe(expected_result);
      }
    ],

    [
      "should produce dynamic attribute values",
      () => {
        const node = ["html", {
          lang: (data) => data.language
        }];
        const expected_result = '<!doctype html><html lang="en"></html>';
        expect(produce(node, { language: "en" })).toBe(expected_result);
      }
    ],

    [
      "should produce dynamic nodes",
      () => {
        const node = (data) => ["h1", data.title];
        const expected_result = "<h1>Hello world</h1>";
        expect(produce(node, { title: "Hello world" })).toBe(expected_result);
      }
    ],

    [
      "should produce and inject stack contents (strings)",
      () => {
        const node = [
          "html",
          [
            "head",
            ["style", ["$stack", "styles"]],
            ["title", "Hello world"]
          ],
          [
            "body",
            ["h1", "Hello world"],
            ({ stacks }) => {
              stacks.styles.push(".foo { color: red }");
              return ["p", { class: "foo" }, "Lorem ipsum dolor sit amet"];
            }
          ]
        ];
        const expected_chunks = [
          "<!doctype html>",
          "<html>",
          "<head>",
          "<style>",
          ".foo { color: red }",
          "</style>",
          "<title>Hello world</title>",
          "</head>",
          "<body>",
          "<h1>Hello world</h1>",
          '<p class="foo">Lorem ipsum dolor sit amet</p>',
          "</body>",
          "</html>"
        ];
        expect(produce(node)).toEqual(expected_chunks.join(""));
      }
    ],

    [
      "should produce and inject stack contents (nodes)",
      () => {
        const node = [
          "html",
          [
            "head",
            ["$stack", "metadata"],
            ["title", "Hello world"]
          ],
          [
            "body",
            ["h1", "Hello world"],
            ({ stacks }) => {
              stacks.metadata.push(["meta", { charset: "utf-8" }]);
              return ["p", { class: "foo" }, "Lorem ipsum dolor sit amet"];
            }
          ]
        ];
        const expected_chunks = [
          "<!doctype html>",
          "<html>",
          "<head>",
          '<meta charset="utf-8">',
          "<title>Hello world</title>",
          "</head>",
          "<body>",
          "<h1>Hello world</h1>",
          '<p class="foo">Lorem ipsum dolor sit amet</p>',
          "</body>",
          "</html>"
        ];
        expect(produce(node)).toEqual(expected_chunks.join(""));
      }
    ],

    [
      "should produce and inject stack contents (mixed)",
      () => {
        const node = [
          "html",
          [
            "head",
            ["$stack", "metadata"],
            ["style", ["$stack", "styles"]],
            ["title", "Hello world"]
          ],
          [
            "body",
            ["h1", "Hello world"],
            ({ stacks }) => {
              stacks.styles.push(".foo { color: red }");
              stacks.metadata.push(["meta", { charset: "utf-8" }]);
              return ["p", { class: "foo" }, "Lorem ipsum dolor sit amet"];
            }
          ]
        ];
        const expected_chunks = [
          "<!doctype html>",
          "<html>",
          "<head>",
          '<meta charset="utf-8">',
          "<style>",
          ".foo { color: red }",
          "</style>",
          "<title>Hello world</title>",
          "</head>",
          "<body>",
          "<h1>Hello world</h1>",
          '<p class="foo">Lorem ipsum dolor sit amet</p>',
          "</body>",
          "</html>"
        ];
        expect(produce(node)).toEqual(expected_chunks.join(""));
      }
    ]
  ]
);
