import path from "node:path";
import { fileURLToPath } from "node:url";
import esmock from "esmock";
import { isRelative } from "./util.ts";

type Replacement = Record<string, unknown>;

/** Turns all relative module paths into absolute paths. */
const fixRelativePaths = (mocks: Replacement, modulePath: string) => {
	for (const key of Object.keys(mocks)) {
		if (!isRelative(key)) {
			continue;
		}

		const resolvedPath = path.resolve(path.dirname(modulePath), key);
		mocks[resolvedPath] = mocks[key];
		delete mocks[key]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
	}
};

export type ReplaceOptions = {
	/** The path to the module to replace. Supports {@link https://nodejs.org/api/packages.html#subpath-imports subpath imports}. */
	modulePath: URL | string;
	/** Pass in {@link https://mdn.io/import.meta `import.meta`}. */
	importMeta: ImportMeta;
	/** Mock modules directly imported by the source module. */
	localMocks?: Replacement;
	/** Mock modules or globals imported anywhere in the source tree. */
	globalMocks?: Replacement;
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

	return esmock(modulePath, importMeta.url, localMocks, globalMocks);
};
