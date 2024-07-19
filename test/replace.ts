import { pathToFileURL } from "node:url";
import test from "ava";
import * as tq from "../src/index.js";
import { atFixture } from "./_util.js";

test("throws if importMeta not provided", async t => {
	await t.throwsAsync(tq.replace(tq.mock()), {
		message: "The `importMeta` option is required. Its value must be `import.meta`.",
		instanceOf: TypeError,
	});
});

test("fixes relative module IDs", async t => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { bar, baz } = await tq.replace<typeof import("./fixtures/imports/fixture.js")>({
		modulePath: atFixture("imports"),
		importMeta: import.meta,
		localMocks: {
			"./bar.js": { // eslint-disable-line @typescript-eslint/naming-convention
				bar: tq.spy(),
				baz: tq.spy(),
			},
		},
	});

	bar();
	baz();

	t.like(tq.explain(bar), { callCount: 1 });
	t.like(tq.explain(baz), { callCount: 1 });
});

test.todo("fixes relative module IDs at any depth");

test("allows URL module paths", async t => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { bar } = await tq.replace<typeof import("./fixtures/imports/fixture.js")>({
		modulePath: pathToFileURL(atFixture("imports")),
		importMeta: import.meta,
	});

	t.is(bar(), "bar");
});
