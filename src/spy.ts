import { addCalls, type AnyFunction, type FunctionCall } from "./store.js";

/**
 * Wraps a function and tracks its calls.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const add = (a: number, b: number) => a + b;
 * const spy = tq.spy(add);
 * //    ^? const spy: (a: number, b: number) => number
 *
 * spy(1, 2);
 * //=> 3
 *
 * spy(3, 4);
 * //=> 7
 *
 * console.log(tq.explain(spy));
 * //=> { callCount: 2, called: true, calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }] }
 */
export function spy<FunctionType extends AnyFunction>(fn: FunctionType): FunctionType;

/**
 * Creates a spy that uses the provided fakes, in order. Subsequent calls will use the last provided fake.
 *
 * @param fakes - An optional array of fakes to use, in order.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.spy([tq.returns(1), tq.returns(2)]);
 *
 * fn();
 * //=> 1
 *
 * fn();
 * //=> 2
 *
 * fn();
 * //=> 2
 */
export function spy(fakes?: AnyFunction[]): AnyFunction;

/**
 * Creates a spy that uses the provided fakes, in order. Subsequent calls will use the last provided fake.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.spy(tq.returns(1), tq.returns(2));
 *
 * fn();
 * //=> 1
 *
 * fn();
 * //=> 2
 *
 * fn();
 * //=> 2
 */
export function spy(...fakes: AnyFunction[]): AnyFunction;

export function spy(fnOrFakes: AnyFunction | AnyFunction[] = [], ...fakes: AnyFunction[]) {
	const calls: FunctionCall[] = [];

	const firstArg = Array.isArray(fnOrFakes) ? fnOrFakes : [fnOrFakes];
	const functions = [...firstArg, ...fakes];

	const mock = (...args: unknown[]) => {
		const fn = functions.at(calls.length) ?? functions.at(-1);
		calls.push({ arguments: args });

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return fn?.(...args);
	};

	addCalls(mock, calls);
	return mock;
}
