import * as configs from "@tommy-mitchell/eslint-config-xo";

/** @type {import('xo').FlatXoConfig} */
export default [...configs.xo, ...configs.dprint, {
	rules: {
		"perfectionist/sort-objects": "off",
		"perfectionist/sort-object-types": "off",
		"simple-import-sort/imports": ["error", {
			groups: [[String.raw`^\u0000`, "^node:", "^tsd", String.raw`^@?\w`, "^", String.raw`^\.`]],
		}],
	},
}, {
	ignores: ["test/fixtures"],
}];
