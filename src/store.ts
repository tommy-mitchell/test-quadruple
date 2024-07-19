export type AnyFunction = (...args: any[]) => any;

export type FunctionCall = {
	arguments: unknown[];
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const CALLS = new WeakMap<AnyFunction, FunctionCall[]>();

export const getCalls = (fn: AnyFunction) => CALLS.get(fn);

export const addCalls = (fn: AnyFunction, calls: FunctionCall[]) => CALLS.set(fn, calls);
