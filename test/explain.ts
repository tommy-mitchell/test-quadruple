/* eslint-disable @typescript-eslint/no-empty-function */
import test from "ava";
import { explain } from "../src/explain.js";
import { spy } from "../src/spy.js";

test("gets details of a spy", t => {
	const fn = spy();

	t.like(explain(fn), {
		callCount: 0,
		called: false,
		calls: [],
		flatCalls: [],
	});

	fn(1, 2);
	fn(3, 4);

	t.like(explain(fn), {
		callCount: 2,
		called: true,
		calls: [
			{ arguments: [1, 2] },
			{ arguments: [3, 4] },
		],
		flatCalls: [1, 2, 3, 4],
	});
});

test("throws if not a spy", t => {
	const fn = () => {};
	t.throws(
		() => explain(fn),
		{ message: "Function \"fn\" is not a spy", instanceOf: TypeError },
	);

	t.throws(() => explain(() => {}), { message: "Function \"anonymous\" is not a spy" });
});

test("tracks calls to the same function separately", t => {
	const add = (a: number, b: number) => a + b;

	const fn1 = spy(add);
	const fn2 = spy(add);

	fn1(1, 2);
	fn2(3, 4);

	t.like(explain(fn1), {
		callCount: 1,
		called: true,
		calls: [{ arguments: [1, 2] }],
		flatCalls: [1, 2],
	});

	t.like(explain(fn2), {
		callCount: 1,
		called: true,
		calls: [{ arguments: [3, 4] }],
		flatCalls: [3, 4],
	});
});
