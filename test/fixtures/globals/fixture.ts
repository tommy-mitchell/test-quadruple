export { baz } from "./other.ts";

export const foo = () => console.log("foo");

export const bar = () => globalThis.console.log("bar");

export const date = () => Date.now();
