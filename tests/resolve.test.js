import { resolve } from "~/index.js";
import test from "~/library/testing.js";

test(
  "compile",
  ({ expect }) => [
    [
      "should compile a string",
      () => {
        const value = "Hello world";
        const expected_result = [["text", "Hello world"]];
        expect(resolve(value)).toEqual(expected_result);
      }
    ],

    [
      "should compile a number",
      () => {
        const value = 42;
        const expected_result = [["text", "42"]];
        expect(resolve(value)).toEqual(expected_result);
      }
    ],

    [
      "should compile an element",
      () => {
        const element = ["div", "Hello"];
        const expected_result = [
          ["open", "div", null],
          ["text", "Hello"],
          ["close", "div"]
        ];
        expect(resolve(element)).toEqual(expected_result);
      }
    ],

    [
      "should compile an element with attributes",
      () => {
        const element = ["div", { class: "test" }, "Hello"];
        const expected_result = [
          ["open", "div", { class: "test" }],
          ["text", "Hello"],
          ["close", "div"]
        ];
        expect(resolve(element)).toEqual(expected_result);
      }
    ],

    [
      "should compile an element with children",
      () => {
        const element = [
          "body",
          ["h1", "Hello world"],
          ["p", "Today is a ", ["strong", "great day"]]
        ];
        const expected_result = [
          ["open", "body", null],
          ["open", "h1", null],
          ["text", "Hello world"],
          ["close", "h1"],
          ["open", "p", null],
          ["text", "Today is a "],
          ["open", "strong", null],
          ["text", "great day"],
          ["close", "strong"],
          ["close", "p"],
          ["close", "body"]
        ];
        expect(resolve(element)).toEqual(expected_result);
      }
    ],

    [
      "should compile a string value function with context",
      () => {
        const context = { name: "Deno" };
        const value = (data) => `Hello ${data.name}`;
        const expected_result = [["text", "Hello Deno"]];
        expect(resolve(value, context)).toEqual(expected_result);
      }
    ],

    [
      "should compile a string value function with context (nested)",
      () => {
        const context = { title: "Hello world" };
        const element = ["head", ["title", (data) => data.title]];
        const expected_result = [
          ["open", "head", null],
          ["open", "title", null],
          ["text", "Hello world"],
          ["close", "title"],
          ["close", "head"]
        ];
        expect(resolve(element, context)).toEqual(expected_result);
      }
    ],

    [
      "should compile the specialized `$stack` node",
      () => {
        const element = [
          "head",
          ["$stack", "head"],
          ["title", "Hello world"]
        ];
        const context = {};
        const result = resolve(element, context);
        expect(result[1][0]).toEqual("inject");
        expect(context).toEqual({ stacks: { head: [] } });
      }
    ],

    [
      "should compile the specalized `$fragments` node (strings)",
      () => {
        const node = ["$fragments", "Hello", "world"];
        const expected_result = [["text", "Hello"], ["text", "world"]];
        expect(resolve(node)).toEqual(expected_result);
      }
    ],

    [
      "should compile the specalized `$fragments` node (nested nodes)",
      () => {
        const element = ["p", ["$fragments", "Hello", ["strong", "world"]]];
        const expected_result = [
          ["open", "p", null],
          ["text", "Hello"],
          ["open", "strong", null],
          ["text", "world"],
          ["close", "strong"],
          ["close", "p"]
        ];
        expect(resolve(element)).toEqual(expected_result);
      }
    ]
  ]
);
