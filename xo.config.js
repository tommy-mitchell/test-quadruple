import * as configs from "@tommy-mitchell/configs/xo";

/** @type {import('xo').FlatXoConfig} */
export default [...configs.xo, ...configs.dprint, { ignores: ["test-d", "test/fixtures"] }, {
	rules: {
		"perfectionist/sort-objects": "off",
		"perfectionist/sort-object-types": "off",
	},
}];
