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

/**
 * ...
 */
export const render = (instructions, data = {}) => {
  const result = [];
  if (!instructions?.length) {
    return ""; // no instructions were provided.
  }

  for (const [instruction, ...args] of instructions) {
    switch (instruction) {
      case "open": {
        const [tag] = args;
        if (tag in prefixes) {
          result.push(prefixes[tag].call());
        }
        result.push(`<${tag}`);
        break;
      }

      case "close": {
        const [tag] = args;
        if (!void_elements.includes(tag)) {
          result.push(`</${tag}>`);
        }
        break;
      }

      case "attribute": {
        const [key, value] = args;
        if (typeof value === "boolean") {
          if (value === true) {
            result.push(` ${key}`);
          }
        }
        else if (typeof value === "number") {
          result.push(` ${key}=${value}`);
        }
        else if (typeof value === "string") {
          result.push(
            /^[\w_-]+$/.test(value) ? ` ${key}=${value}` : ` ${key}="${value}"`
          );
        }
        else if (typeof value === "function") {
          const content = render(resolve(value), data);
          result.push(
            /^[\w_-]+$/.test(content)
              ? ` ${key}=${content}`
              : ` ${key}="${content}"`
          );
        }
        break;
      }

      case "text": {
        result.push(args[0]);
        break;
      }

      case "resolve": {
        const value = args[0].call(null, data);
        result.push(render(resolve(value), data));
        break;
      }
    }
  }

  return result.join("");
};

/**
 * ...
 */
export const resolve = (value) => {
  // value = node
  //       | string
  //       | function that returns a value

  const instructions = [];
  if (value === null || value === undefined) {
    return instructions; // the value can't be resolved.
  }

  if (typeof value === "function") {
    return [["resolve", value]];
  }
  if (["number", "string"].includes(typeof value)) {
    return [["text", value.toString()]];
  }

  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      value.forEach((item) => {
        instructions.push(...resolve(item));
      });
      return instructions;
    }

    if (value[0].startsWith("$")) {
      switch (value[0].slice(1)) {
        // todo: implement special instructions
      }
      return instructions;
    }

    instructions.push(["open", value[0]]);
    if (value[1] && Object.getPrototypeOf(value[1]) === Object.prototype) {
      for (const [raw_key, content] of Object.entries(value[1])) {
        const key = raw_key.replace(/_/g, "-");
        instructions.push(["attribute", key, content]);
      }
    }
    instructions.push(["text", ">"]);

    const children = value.slice(
      instructions.some(([type]) => type === "attribute") ? 2 : 1
    );
    children.forEach((child) => {
      instructions.push(...resolve(child));
    });
    instructions.push(["close", value[0]]);
  }

  return instructions;
};
