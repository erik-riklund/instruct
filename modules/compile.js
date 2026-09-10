export const compile = (value, data) => {
  // value = node
  //       | string
  //       | function that returns another value

  const instructions = [];

  if (["number", "string"].includes(typeof value)) {
    instructions.push(["text", value.toString()]);
  }
  else if (typeof value === "function") {
    const result = value(data);
    instructions.push(...compile(result, data));
  }
  else if (Array.isArray(value)) {
    if (value[0].startsWith("$")) {
      switch (value[0].slice(1)) {
        case "fragments": {
          value.slice(1).forEach((fragment) => {
            instructions.push(...compile(fragment, data));
          });
          break;
        }
        case "stack": {
          data.stacks ??= {};
          data.stacks[value[1]] ??= [];
          instructions.push([
            "inject",
            (data) => compile(["$fragments", data.stacks[value[1]]], data)
          ]);
          break;
        }
      }
    }
    else {
      const element = value[0];
      const attributes = Object.getPrototypeOf(value[1]) === Object.prototype ? value[1] : null;
      const children = value.slice(attributes ? 2 : 1);

      instructions.push(["open", element, attributes]);
      children.forEach((child) => {
        instructions.push(...compile(child, data));
      });
      instructions.push(["close", element]);
    }
  }

  return instructions;
};
