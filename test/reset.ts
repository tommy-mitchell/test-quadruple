import test from "ava";
import * as tq from "#src/index.ts";

test("resets single spy", t => {
	const fn = tq.spy();

	fn();
	t.like(tq.explain(fn), { called: true });

	tq.reset(fn);
	t.like(tq.explain(fn), { called: false });
});

test("resets multiple spies", t => {
	const fn1 = tq.spy();
	const fn2 = tq.spy();

	fn1();
	fn2();
	t.like(tq.explain(fn1), { called: true });
	t.like(tq.explain(fn2), { called: true });

	// Array argument
	tq.reset([fn1, fn2]);
	t.like(tq.explain(fn1), { called: false });
	t.like(tq.explain(fn2), { called: false });

	fn1();
	fn2();
	t.like(tq.explain(fn1), { called: true });
	t.like(tq.explain(fn2), { called: true });

	// Variadic
	tq.reset(fn1, fn2);
	t.like(tq.explain(fn1), { called: false });
	t.like(tq.explain(fn2), { called: false });
});

test("throws if not a spy", t => {
	const spy = tq.spy();
	const fn = () => {/**/};

	t.throws(
		() => tq.reset(spy, fn),
		{ message: "Function \"fn\" is not a spy", instanceOf: TypeError },
	);

	t.throws(
		() => tq.reset(() => {/**/}),
		{ message: "Function \"anonymous\" is not a spy" },
	);
});

test("does nothing if no spies", async (t) => {
	const resetCalls = tq.spy();

	const { reset } = await tq.replace<typeof import("#src/reset.ts")>({
		modulePath: new URL("../src/reset.ts", import.meta.url),
		importMeta: import.meta,
		localMocks: { "./store.ts": { resetCalls } },
	});

	// @ts-expect-error -- types require at least one argument
	reset();
	t.like(tq.explain(resetCalls), { called: false });
});

test("resets fake order", t => {
	const fn = tq.spy([() => 1, () => 2]);
	t.is(fn(), 1);
	t.is(fn(), 2);
	t.is(fn(), 2);

	tq.reset(fn);

	t.is(fn(), 1);
	t.is(fn(), 2);
	t.is(fn(), 2);
});
