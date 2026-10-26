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
				bar: tq.spy(),
			},
			"#mrowki": {
				log: { info: tq.spy() },
			},
			"node:process": {
				argv: ["1", "2", "3"],
			},
			"./nested/other.ts": {
				other: tq.spy(),
			},
			"#baz": {
				baz: tq.spy(),
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
