import { type AnyFunction, type FunctionCall, getCalls } from "./store.js";

export type Explanation = {
	/** The number of times the given spy was called. */
	callCount: number;
	/** Whether or not the given spy was called. */
	called: boolean;
	/** An array of calls to the given spy. */
	calls: FunctionCall[];
};

/**
 * List the tracked calls of a spy. Throws if the given function is not a spy.
 *
 * @param fn - The spy to explain.
 * @returns An object with information about the spy.
 *
 * @example
 * import test from "ava";
 * import * as tq from "test-quadruple";
 *
 * test("tracks calls of a spy", async t => {
 *   const fn = tq.spy(tq.resolves(1));
 *
 *   t.is(await fn(), 1);
 *
 *   t.like(tq.explain(fn), {
 *     callCount: 1,
 *     called: true,
 *     calls: [{ arguments: [1, 2] }],
 *   });
 * });
 */
export const explain = (fn: AnyFunction): Explanation => {
	const calls = getCalls(fn);

	if (!calls) {
		throw new TypeError(`Function "${fn.name || "anonymous"}" is not a spy`);
	}

	return {
		callCount: calls.length,
		called: calls.length > 0,
		calls,
	};
};
