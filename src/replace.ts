import path from "node:path";
import { fileURLToPath } from "node:url";
import esmock from "esmock";
import mapObject from "map-obj";

type Replacement = Record<string, unknown>;

const fixRelativeMocks = (mocks: Replacement, modulePath: string) => {
	return mapObject(mocks, (key, value) => {
		if (key.startsWith("./")) {
			const resolvedPath = path.resolve(path.dirname(modulePath), key);
			return [resolvedPath, value];
		}

		return [key, value];
	}, { deep: true });
};

export type ReplaceOptions = {
	/** The path to the module to replace. */
	modulePath: string | URL;
	/** Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta). */
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
 *   importMeta: import.meta, // Required
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

	return esmock(modulePath, importMeta.url, fixRelativeMocks(localMocks, modulePath), globalMocks);
};
