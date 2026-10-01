export type AnyFunction = (...args: any[]) => any;

export type FunctionCall = {
	arguments: unknown[];
};

const CALLS = new WeakMap<AnyFunction, FunctionCall[]>();

export const getCalls = (fn: AnyFunction): FunctionCall[] | undefined => (
	CALLS.get(fn)
);

export const addCalls = (fn: AnyFunction, calls: FunctionCall[]): void => {
	CALLS.set(fn, calls);
};
