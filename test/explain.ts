import test from "ava";
import { forEachObject } from "for-each-obj";
import { explain } from "#src/features/explain.ts";
import { spy } from "#src/features/spy.ts";

test("gets details of a spy", t => {
	const fn = spy();

	t.like(explain(fn), {
		callCount: 0,
		called: false,
		calls: [],
		flatCalls: [],
	});

	fn(1, 2);
	fn([3, 4], 5);

	t.like(explain(fn), {
		callCount: 2,
		called: true,
		calls: [
			{ arguments: [1, 2] },
			{ arguments: [[3, 4], 5] },
		],
		flatCalls: [1, 2, [3, 4], 5],
	});
});

test("throws if not a spy", t => {
	const fn = () => {/**/};
	t.throws(
		() => explain(fn),
		{ message: "Function \"fn\" is not a spy", instanceOf: TypeError },
	);

	t.throws(
		() => explain(() => {/**/}),
		{ message: "Function \"anonymous\" is not a spy" },
	);
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

test("handles circular references", t => {
	const array: unknown[] = [{ one: 1 }];
	array.push(array);
	const fixture: Record<string, unknown> = { array, two: 2, array2: array };
	fixture["circular"] = fixture;

	const fn = spy<() => void>();
	forEachObject(fixture, fn);

	// dprint-ignore
	t.deepEqual(explain(fn).flatCalls, [
		"array", array, fixture,
			"one", 1, array[0],
		"two", 2, fixture,
		"array2", array, fixture,
		"circular", fixture, fixture
	]);
});
