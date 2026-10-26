import test from "ava";
import { spy } from "#src/features/spy.ts";

test("no fakes returns undefined", t => {
	const fn = spy();
	t.is(fn(), undefined);
});

test("passes through", t => {
	const add = (a: number, b: number) => a + b;
	const fn = spy(add);
	t.is(fn(1, 2), 3);
});

test("accepts any function", t => {
	const fn = spy(() => 1);
	t.is(fn(), 1);
});

test("multiple calls", t => {
	const fn = spy([() => 1, () => 2]);
	t.is(fn(), 1);
	t.is(fn(), 2);
	t.is(fn(), 2);
});

test("multiple calls - variadic", t => {
	const fn = spy(() => 1, () => 2);
	t.is(fn(), 1);
	t.is(fn(), 2);
	t.is(fn(), 2);
});

test("spy name", t => {
	const fn = spy(() => 1);
	t.is(String(fn.name), "Symbol(spy)"); // eslint-disable-line unicorn/no-useless-coercion, @typescript-eslint/no-unnecessary-type-conversion
});
