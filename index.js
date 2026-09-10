import { render } from "~/modules/render.js";
import { resolve } from "~/modules/resolve.js";

export { render, resolve };
export default (node, data = {}) => render(resolve(node, data));
