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
    ]
  ]
);

//   ["passes data to dynamic values", () => {
//     expect(produce(
//       ["h1", data => `Hello ${data.name}!`],
//       { name: "Alice" }
//     )).toBe("<h1>Hello Alice!</h1>");
//   }],

//   ["resolves dynamic attributes", () => {
//     expect(produce(
//       ["html", {
//         lang: data => data.language
//       }],
//       { language: "en" }
//     )).toBe('<html lang="en"></html>');
//   }],

//   ["resolves dynamic nodes", () => {
//     expect(produce(
//       data => ["h1", data.title],
//       { title: "Hello" }
//     )).toBe("<h1>Hello</h1>");
//   }],

//   ["produces fragments", () => {
//     expect(produce([
//       "$fragment",
//       ["h1", "Hello"],
//       ["p", "World"]
//     ])).toBe(
//       "<h1>Hello</h1><p>World</p>"
//     );
//   }],

//   ["produces lists", () => {
//     expect(produce(
//       ["ul",
//         data => [
//           "$fragment",
//           ...data.items.map(item => ["li", item])
//         ]
//       ],
//       { items: ["One", "Two", "Three"] }
//     )).toBe(
//       "<ul><li>One</li><li>Two</li><li>Three</li></ul>"
//     );
//   }],

//   ["produces nothing for null", () => {
//     expect(produce(null)).toBe("");
//   }),

//   ["produces nothing for false", () => {
//     expect(produce(false)).toBe("");
//   })
// ]);
