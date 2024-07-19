const _throw = (error: unknown) => {
	throw error;
};

/**
 * Creates a function that returns the given `value`.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.returns(42);
 *
 * console.log(fn());
 * //=> 42
 */
export const returns = <T>(value: T) => () => value;

/**
 * Creates a function that throws the given `error`.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.throws(new Error("Oops! All errors!"));
 *
 * try {
 *   fn();
 * } catch (error) {
 *   console.log(error.message);
 *   //=> "Oops! All errors!"
 * }
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.throws("Oops! Not an error!");
 *
 * try {
 *   fn();
 * } catch (error) {
 *   console.log(error);
 *   //=> "Oops! Not an error!"
 * }
 */
export const throws = (error: unknown) => () => _throw(error);

/**
 * Creates an async function that resolves to the given `value`.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.resolves(42);
 *
 * console.log(await fn());
 * //=> 42
 */
export const resolves = <T>(value: T) => async () => value;

/**
 * Creates an async function that rejects with the given `error`.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.rejects(new Error("Oops! All errors!"));
 *
 * try {
 *   await fn();
 * } catch (error) {
 *   console.log(error.message);
 *   //=> "Oops! All errors!"
 * }
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * const fn = tq.rejects("Oops! Not an error!");
 *
 * try {
 *   await fn();
 * } catch (error) {
 *   console.log(error);
 *   //=> "Oops! Not an error!"
 * }
 */
export const rejects = (error: unknown) => async () => _throw(error);

/** Creates an empty function that does nothing. */
export const noop = () => () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
