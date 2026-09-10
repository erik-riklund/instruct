import test from "~/library/testing.js";
import { compile, render } from "~/index.js";

test(
  "render",
  ({ expect }) => [
    [
      "should render an empty element",
      () => {
        const element = ["div"];
      }
    ]
  ]
);
