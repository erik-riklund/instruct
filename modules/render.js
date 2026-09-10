const void_elements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

const prefixes = {
  html: () => "<!doctype html>"
};

export const render = (instructions) => {
  const result = [];
  for (const [instruction, ...args] of instructions) {
    switch (instruction) {
      case "text": {
        result.push(args[0]);
        break;
      }
      case "open": {
        const [tag] = args;
        const attributes = Object.entries(args[1] || {}).map(([key, value]) => {
          return `${key.replace(/_/g, "-")}="${value}"`;
        });
        if (tag in prefixes) {
          result.push(prefixes[tag].call());
        }
        result.push(`<${tag}${attributes.length ? " " : ""}${attributes.join(" ")}>`);
        break;
      }
      case "close": {
        const [tag] = args;
        if (!void_elements.includes(tag)) {
          result.push(`</${tag}>`);
        }
        break;
      }
      case "inject": {
        const [callback] = args;
        result.push(render(callback()));
        break;
      }
    }
  }
  return result.join("");
};
