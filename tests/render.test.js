import { render } from "~/index.js";
import test from "~/library/testing.js";

test(
  "render",
  ({ expect }) => [
    [
      "should render text",
      () => {
        const instructions = [
          ["text", "Hello world"]
        ];
        expect(render(instructions)).toBe("Hello world");
      }
    ],

    [
      "should render an empty element",
      () => {
        const instructions = [
          ["open", "div", null],
          ["close", "div"]
        ];
        expect(render(instructions)).toBe("<div></div>");
      }
    ],

    [
      "should render an element with text content",
      () => {
        const instructions = [
          ["open", "div", null],
          ["text", "Hello world"],
          ["close", "div"]
        ];
        expect(render(instructions)).toBe("<div>Hello world</div>");
      }
    ],

    [
      "should render an element with attributes",
      () => {
        const instructions = [
          ["open", "div", { class: "foo", data_bar: "baz" }],
          ["close", "div"]
        ];
        expect(render(instructions)).toBe(
          '<div class="foo" data-bar="baz"></div>'
        );
      }
    ],

    [
      "should render a void element",
      () => {
        const instructions = [
          ["open", "img", { src: "https://example.com/image.jpg" }],
          ["close", "img"]
        ];
        expect(render(instructions)).toBe(
          '<img src="https://example.com/image.jpg">'
        );
      }
    ],

    [
      "should render an element with a prefix",
      () => {
        const instructions = [
          ["open", "html", null],
          ["close", "html"]
        ];
        expect(render(instructions)).toBe("<!doctype html><html></html>");
      }
    ],

    [
      "should render an element with the `inject` instruction",
      () => {
        const instructions = [
          ["open", "div", null],
          ["inject", () => {
            return [["text", "Hello world"]];
          }],
          ["close", "div"]
        ];
        expect(render(instructions)).toBe("<div>Hello world</div>");
      }
    ]
  ]
);
