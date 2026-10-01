import test from "ava";
import { match, P } from "ts-pattern";
import * as tq from "../src/index.ts";
import { atFixture } from "./_util.ts";
import { bar as originalBar } from "./fixtures/imports/fixture.ts";

test("replaces a module", async t => {
	const logger = tq.spy();

	await tq.replace({
		modulePath: atFixture("cli"),
		importMeta: import.meta,
		localMocks: {
			"node:process": {
				exit: tq.noop(),
			},
		},
		globalMocks: {
			process: {
				argv: ["", "", "1", "2", "3"],
			},
			import: {
				console: {
					log: logger,
				},
			},
		},
	});

	const { calls } = tq.explain(logger);
	const logs = calls[0]!.arguments;

	t.deepEqual(logs, ["input:", ["1", "2", "3"]]);
});

test("with args pattern", async t => {
	t.is(originalBar(), "bar");

	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { bar, baz } = await tq.replace<typeof import("./fixtures/imports/fixture.js")>({
		modulePath: atFixture("imports"),
		importMeta: import.meta,
		localMocks: {
			"./bar.js": {
				bar: tq.spy(args => (
					match(args)
						.with(P.string, tq.returns("string"))
						.with(P.number, tq.returns("number"))
						.with(P.boolean, tq.returns("boolean"))
						.otherwise(tq.returns("unknown"))
				)),
			},
		},
	});

	t.is(bar("foo"), "string");
	t.is(bar(7), "number");
	t.is(bar(true), "boolean");
	t.is(bar({ hello: "world" }), "unknown");
	t.is(bar(), "unknown");

	t.is(baz(), "baz");
});
