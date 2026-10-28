import { fileURLToPath } from "node:url";
import test from "ava";
import * as tq from "#src/index.ts";

test("throws if importMeta not provided", async t => {
	await t.throwsAsync(tq.replace(tq.mock()), {
		message: "The `importMeta` option is required. Its value must be `import.meta`.",
		instanceOf: TypeError,
	});
});

const fixtureUrl = new URL(`fixtures/imports/fixture.ts`, import.meta.url);
const fixturePath = fileURLToPath(fixtureUrl);

const cases = [
	["string paths", fixturePath],
	["URL paths", fixtureUrl],
	["subpath imports", "#fixtures/imports"],
	["bare resolution", "./fixtures/imports/fixture.ts"],
] as const;

for (const [name, modulePath] of cases) {
	test(`works with ${name}`, async t => {
		const { bar, foo } = await tq.replace<typeof import("#fixtures/imports")>({
			modulePath,
			importMeta: import.meta,
			localMocks: {
				"./foo.ts": {
					foo: { name: "not-foo" },
				},
			},
		});

		t.is(bar(), "bar");
		t.is(foo.name, "not-foo");
	});
}

test("fixes relative module IDs", async t => {
	const { argv, bar, baz, log, other } = await tq.replace<typeof import("#fixtures/imports")>({
		modulePath: "#fixtures/imports",
		importMeta: import.meta,
		localMocks: {
			"./bar.ts": {
				"bar": tq.spy(),
				"#baz": {
					baz: tq.spy(),
				},
				"./nested/other.ts": {
					other: tq.spy(),
				},
			},
			"#mrowki": {
				log: { info: tq.spy() },
			},
			"node:process": {
				argv: ["1", "2", "3"],
			},
		},
	});

	bar();
	baz();
	log.info();
	other();

	t.like(tq.explain(bar), { callCount: 1 });
	t.like(tq.explain(baz), { callCount: 1 });
	t.like(tq.explain(log.info), { callCount: 1 });
	t.like(tq.explain(other), { callCount: 1 });

	t.deepEqual(argv, ["1", "2", "3"]);
});

test("fixes relative module IDs - backtracking", async t => {
	const { outer } = await tq.replace<typeof import("#fixtures/nested/inner")>({
		modulePath: "#fixtures/nested/inner",
		importMeta: import.meta,
		localMocks: {
			"../outer.ts": {
				outer: tq.spy(),
			},
		},
	});

	outer();
	t.like(tq.explain(outer), { callCount: 1 });
});

test("fixes relative module IDs nested in subpath imports", async t => {
	const { message } = await tq.replace<typeof import("#fixtures/chain")>({
		modulePath: "#fixtures/chain",
		importMeta: import.meta,
		localMocks: {
			"./mid.ts": {
				"#fixtures/default-export": {
					"./greet.ts": tq.returns("mocked"),
				},
			},
		},
	});

	t.is(message, "mocked");
});

test("mocks relative modules with only a default export", async t => {
	const { message } = await tq.replace<typeof import("#fixtures/default-export")>({
		modulePath: "#fixtures/default-export",
		importMeta: import.meta,
		localMocks: {
			"./greet.ts": {
				"./name.ts": { name: "mocked" },
			},
		},
	});

	t.is(message, "hello mocked");
});

test("direct replacements take precedence over nested relative mocks", async t => {
	const { other } = await tq.replace<typeof import("#fixtures/imports")>({
		modulePath: "#fixtures/imports",
		importMeta: import.meta,
		localMocks: {
			"./bar.ts": {
				"./nested/other.ts": { other: tq.returns("nested") },
				"other": tq.returns("direct"),
			},
		},
	});

	t.is(other(), "direct");
});

test("passes non-plain relative mock values through", async t => {
	class FooMock {
		foo = { name: "not-foo" };
	}

	const { foo } = await tq.replace<typeof import("#fixtures/imports")>({
		modulePath: "#fixtures/imports",
		importMeta: import.meta,
		localMocks: {
			"./foo.ts": new FooMock(),
		},
	});

	t.is(foo.name, "not-foo");
});

test("preserves object identities in nested mocks", async t => {
	const replacement = { text: "replacement" };

	const { message } = await tq.replace<typeof import("#fixtures/chain")>({
		modulePath: "#fixtures/chain",
		importMeta: import.meta,
		localMocks: {
			"./mid.ts": {
				"#fixtures/default-export": {
					"./greet.ts": tq.spy(),
					"message": replacement,
				},
			},
		},
	});

	t.is(message as any, replacement);
});

test("preserves object identities", async t => {
	const replacement = { name: "not-foo" };

	const { foo } = await tq.replace<typeof import("#fixtures/imports")>({
		modulePath: fixturePath,
		importMeta: import.meta,
		localMocks: {
			"./foo.ts": {
				foo: replacement,
			},
		},
	});

	t.is(foo.name, "not-foo");
	t.is(foo, replacement);
});

test("mocks global scope", async t => {
	const loggerLocal = tq.spy();
	const loggerGlobal = tq.spy();

	const { foo, bar, baz, date } = await tq.replace<typeof import("#fixtures/globals")>({
		modulePath: "#fixtures/globals",
		importMeta: import.meta,
		localMocks: {
			global: {
				console: { log: loggerLocal },
			},
			import: {
				Date: { // eslint-disable-line @typescript-eslint/naming-convention
					now: tq.returns(964_101_600_000),
				},
			},
		},
		globalMocks: {
			global: {
				console: { log: loggerGlobal },
				globalThis: { console: { log: loggerGlobal } },
			},
		},
	});

	foo();
	bar();
	baz();

	t.like(tq.explain(loggerLocal), { flatCalls: ["foo"] });
	t.like(tq.explain(loggerGlobal), { flatCalls: ["bar", "baz"] });

	t.is(date(), 964_101_600_000);
});

test("strict overrides modules", async t => {
	const { argv, exit } = await tq.replace<typeof import("#fixtures/strict")>({
		modulePath: "#fixtures/strict",
		importMeta: import.meta,
		strict: true,
		localMocks: {
			"node:process": { exit: tq.spy() },
		},
	});

	t.is(argv as any, undefined);
	t.like(tq.explain(exit), { called: false });
});
