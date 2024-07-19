import test from "ava";
import * as fakes from "../src/fakes.js";

test("returns", t => {
	const fn = fakes.returns(1);
	t.is(fn(), 1);
});

test("throws", t => {
	const fn = fakes.throws(new Error("foo"));
	t.throws(fn, { message: "foo" });
});

test("throws - non-error", t => {
	const fn = fakes.throws("foo");
	t.throws(fn, { any: true, is: "foo" });
});

test("resolves", async t => {
	const fn = fakes.resolves(1);
	t.is(await fn(), 1);
});

test("rejects", async t => {
	const fn = fakes.rejects(new Error("foo"));
	await t.throwsAsync(fn, { message: "foo" });
});

test("rejects - non-error", async t => {
	const fn = fakes.rejects("foo");
	await t.throwsAsync(fn, { any: true, is: "foo" });
});

test("noop", t => {
	const fn = fakes.noop();
	t.is(fn(), undefined); // eslint-disable-line @typescript-eslint/no-confusing-void-expression
});
