import { addCalls } from "#src/helpers/store.ts";
import { arrify } from "#src/helpers/utils.ts";
import type { AnyFunction, FunctionCall } from "#src/types.ts";

export const SPY_NAME_SYMBOL = Symbol("spy") as unknown as string;

/**
 * Creates an anonymous spy.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const { add } = await tq.replace({
 *   modulePath: "./module.js",
 *   importMeta: import.meta,
 *   localMocks: {
 *     "./some-dep.js": {
 *       add: tq.spy()
 *       //      ^?  tq.spy<(a: number, b: number) => number>
 *     },
 *   },
 * });
 *
 * add(1, 2);
 * add(3, 4);
 *
 * console.log(tq.explain(add));
 * //=> { calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }], … }
 */
export function spy<FunctionType extends AnyFunction>(): FunctionType;

/**
 * Wraps a function and tracks its calls.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const add = (a: number, b: number) => a + b;
 * const spy = tq.spy(add);
 * //    ^?  (a: number, b: number) => number
 *
 * spy(1, 2); //=> 3
 * spy(3, 4); //=> 7
 *
 * console.log(tq.explain(spy));
 * //=> { calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }], … }
 */
export function spy<FunctionType extends AnyFunction>(fn: FunctionType): FunctionType; // eslint-disable-line @typescript-eslint/unified-signatures

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
 * fn(); //=> 1
 * fn(); //=> 2
 * fn(); //=> 2
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
 * fn(); //=> 1
 * fn(); //=> 2
 * fn(); //=> 2
 */
export function spy(...fakes: AnyFunction[]): AnyFunction;

export function spy(fnOrFakes: AnyFunction | AnyFunction[] = [], ...fakes: AnyFunction[]) {
	const functions = arrify(fnOrFakes, ...fakes);
	const calls: FunctionCall[] = [];

	const mock = (...args: unknown[]) => {
		const fn = functions.at(calls.length) ?? functions.at(-1);
		calls.push({ arguments: args });

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return fn?.(...args);
	};

	Object.defineProperty(mock, "name", { value: SPY_NAME_SYMBOL });

	addCalls(mock, calls);
	return mock;
}
