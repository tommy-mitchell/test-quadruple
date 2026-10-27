import path from "node:path";
import { fileURLToPath } from "node:url";
import esmock from "esmock";
import type { UnknownRecord as Replacement } from "type-fest";
import { isRelative } from "#src/helpers/utils.ts";

type Replacements = Replacement & { global?: Replacement; };

/** Turns all relative module paths into absolute paths. */
const fixRelativePaths = (mocks: Replacements, modulePath: string) => {
	for (const key of Object.keys(mocks)) {
		if (!isRelative(key)) {
			continue;
		}

		const resolvedPath = path.resolve(path.dirname(modulePath), key);
		mocks[resolvedPath] = mocks[key];
		delete mocks[key]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
	}
};

/** Maps global scope mocks to `esmock`'s format. */
const mockGlobalScope = (mocks: Replacements) => {
	if (!Object.hasOwn(mocks, "global")) {
		return;
	}

	mocks["import"] = { ...mocks.global, ...(mocks["import"] as Replacement) };
	delete mocks.global;
};

export type ReplaceOptions = {
	/** The path to the module to replace. Supports {@link https://nodejs.org/api/packages.html#subpath-imports subpath imports}. */
	modulePath: URL | string;
	/** Pass in {@link https://mdn.io/import.meta `import.meta`}. */
	importMeta: ImportMeta;
	/** By default, mocks are merged with the original modules. Set this to `true` to override the mocked modules instead. */
	strict?: boolean;
	/** Mock modules directly imported by the source module. */
	localMocks?: Replacements;
	/** Mock modules imported anywhere in the source tree. */
	globalMocks?: Replacements;
};

/**
 * Partially replaces local or global imports of a module.
 *
 * Uses [`esmock`](https://github.com/iambumblehead/esmock/wiki#call-esmock) internally.
 *
 * @example
 * import { execa } from "execa";
 * import { match, P } from "ts-pattern";
 * import * as tq from "test-quadruple";
 *
 * const { program } = await tq.replace<typeof import('./program.js')>({
 *   modulePath: "./program.js",
 *   importMeta: import.meta,
 *   localMocks: {
 *     execa: {
 *       execa: tq.spy(args => match(args)
 *         .with("foo", tq.resolves("bar"))
 *         .with([42, true], tq.resolves("The Ultimate Answer to Life, The Universe and Everything"))
 *         .otherwise(execa)
 *       ),
 *     },
 *   },
 * });
 *
 * await program("foo");
 * //=> "bar"
 *
 * await program(42, true);
 * //=> "The Ultimate Answer to Life, The Universe and Everything"
 *
 * await program("echo hi");
 * //=> "hi"
 */
export const replace = async <ReplacementType>({
	modulePath,
	importMeta,
	strict,
	localMocks = {},
	globalMocks = {},
}: ReplaceOptions): Promise<ReplacementType> => {
	if (!importMeta?.url) {
		throw new TypeError("The `importMeta` option is required. Its value must be `import.meta`.");
	}

	if (typeof modulePath !== "string") {
		modulePath = fileURLToPath(modulePath);
	}

	// Resolve module path in case of subpath imports
	const absolutePath = fileURLToPath(importMeta.resolve(modulePath));
	fixRelativePaths(localMocks, absolutePath);

	mockGlobalScope(localMocks);
	mockGlobalScope(globalMocks);

	return esmock(modulePath, importMeta.url, localMocks, globalMocks, { strict });
};
