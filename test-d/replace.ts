import { expectAssignable, expectType } from "tsd";
import * as tq from "../src/index.js";

declare const options: tq.ReplaceOptions;

expectType<string | URL>(options.modulePath);
expectType<ImportMeta>(options.importMeta);
expectAssignable<Record<string, unknown>>(options.localMocks!);
expectAssignable<Record<string, unknown>>(options.globalMocks!);

const { replace } = await tq.replace<typeof tq>({
	modulePath: "../src/index.js",
	importMeta: import.meta,
	localMocks: {
		explain: tq.noop(),
	},
	globalMocks: {
		import: {
			console: {
				log: tq.noop(),
			},
		},
	},
});

expectType<typeof tq.replace>(replace);
