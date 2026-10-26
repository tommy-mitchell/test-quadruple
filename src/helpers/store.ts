import type { AnyFunction, FunctionCall } from "#src/types.ts";

const CALLS = new WeakMap<AnyFunction, FunctionCall[]>();

/** Safely get calls of a spy, throwing if none exist (i.e. not a spy). */
export const getCalls = (fn: AnyFunction): FunctionCall[] => {
	const calls = CALLS.get(fn);

	if (!calls) {
		throw new TypeError(`Function "${fn.name || "anonymous"}" is not a spy`);
	}

	return calls;
};

/** Store an array to track calls of a spy. */
export const addCalls = (fn: AnyFunction, calls: FunctionCall[]): void => {
	CALLS.set(fn, calls);
};

/** Empties the tracked calls of a spy, throwing if `fn` is not a spy. */
export const resetCalls = (fn: AnyFunction): void => {
	const calls = getCalls(fn);
	calls.length = 0;
};
