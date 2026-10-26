import { resetCalls } from "#src/helpers/store.ts";
import { arrify } from "#src/helpers/utils.ts";
import type { AnyFunction } from "#src/types.ts";

/**
 * Resets the tracked calls and fakes sequence of a spy. Throws if the given function is not a spy.
 *
 * @param spy - The spy to reset.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.spy([tq.returns(1), tq.returns(2)]);
 *
 * fn(); //=> 1
 * fn(); //=> 2
 * fn(); //=> 2
 *
 * tq.explain(fn);
 * //=> { called: true, … }
 *
 * tq.reset(fn);
 * tq.explain(fn);
 * //=> { called: false, … }
 *
 * fn();
 * //=> 1
 */
export function reset(spy: AnyFunction): void;

/**
 * Resets the tracked calls and fakes sequences of the provided spies. Throws if the given functions are not spies.
 *
 * @param spies - An array of spies to reset.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn1 = tq.spy();
 * const fn2 = tq.spy();
 *
 * fn1();
 * tq.explain(fn1);
 * //=> { called: true, … }
 *
 * fn2();
 * tq.explain(fn2);
 * //=> { called: true, … }
 *
 * tq.reset([fn1, fn2]);
 *
 * tq.explain(fn1);
 * //=> { called: false, … }
 *
 * tq.explain(fn2);
 * //=> { called: false, … }
 */
export function reset(spies: AnyFunction[]): void;

/**
 * Resets the tracked calls and fakes sequences of the provided spies. Throws if the given functions are not spies.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn1 = tq.spy();
 * const fn2 = tq.spy();
 *
 * fn1();
 * tq.explain(fn1);
 * //=> { called: true, … }
 *
 * fn2();
 * tq.explain(fn2);
 * //=> { called: true, … }
 *
 * tq.reset(fn1, fn2);
 *
 * tq.explain(fn1);
 * //=> { called: false, … }
 *
 * tq.explain(fn2);
 * //=> { called: false, … }
 */
export function reset(spy: AnyFunction, ...spies: AnyFunction[]): void; // eslint-disable-line @typescript-eslint/unified-signatures

export function reset(spyOrSpies: AnyFunction | AnyFunction[], ...spies: AnyFunction[]): void {
	const functions = arrify(spyOrSpies, ...spies);

	for (const fn of functions) {
		resetCalls(fn);
	}
}
