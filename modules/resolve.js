export const resolve = (value, data) => {
  // value = node
  //       | string
  //       | function that returns another value

  if (value === null || value === undefined) return [];

  const instructions = [];

  if (["number", "string"].includes(typeof value)) {
    instructions.push(["text", value.toString()]);
  }
  else if (typeof value === "function") {
    const result = value(data);
    instructions.push(...resolve(result, data));
  }
  else if (Array.isArray(value)) {
    if (Array.isArray(value[0])) {
      value.forEach((item) => {
        instructions.push(...resolve(item, data));
      });
    }
    else if (value[0].startsWith("$")) {
      switch (value[0].slice(1)) {
        case "fragments": {
          value.slice(1).forEach((fragment) => {
            instructions.push(...resolve(fragment, data));
          });
          break;
        }
        case "stack": {
          data.stacks ??= {};
          data.stacks[value[1]] ??= [];
          instructions.push([
            "inject",
            (data) => {
              const contents = data.stacks[value[1]];
              return resolve(["$fragments", ...contents], data);
            }
          ]);
          break;
        }
      }
    }
    else {
      const element = value[0];
      const attributes =
        value[1] && Object.getPrototypeOf(value[1]) === Object.prototype
          ? { ...value[1] }
          : null;

      if (attributes !== null) {
        Object.keys(attributes).forEach((key) => {
          if (typeof attributes[key] === "function") {
            attributes[key] = attributes[key].call(null, data);
          }
        });
      }
      const children = value.slice(attributes ? 2 : 1);

      instructions.push(["open", element, attributes]);
      children.forEach((child) => {
        instructions.push(...resolve(child, data));
      });
      instructions.push(["close", element]);
    }
  }

  return instructions;
};
