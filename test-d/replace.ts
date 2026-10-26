import { expectAssignable, expectType } from "tsd";
import * as tq from "../src/index.ts";

type PropertyKey = string | number | symbol;

declare const options: tq.ReplaceOptions;

expectType<URL | string>(options.modulePath);
expectType<ImportMeta>(options.importMeta);

expectAssignable<Record<string, unknown>>(options.localMocks!);
expectAssignable<Record<PropertyKey, unknown>>(options.localMocks!);

declare const localReplacements: NonNullable<typeof options.localMocks>;
expectType<unknown>(localReplacements["foo"]);
expectType<Record<PropertyKey, unknown>>(localReplacements.global!);

expectAssignable<Record<string, unknown>>(options.globalMocks!);
expectAssignable<Record<PropertyKey, unknown>>(options.globalMocks!);

declare const globalReplacements: NonNullable<typeof options.globalMocks>;
expectType<unknown>(globalReplacements["foo"]);
expectType<Record<PropertyKey, unknown>>(globalReplacements.global!);

const { replace } = await tq.replace<typeof tq>({
	modulePath: "../src/index.js",
	importMeta: import.meta,
	localMocks: {
		explain: tq.noop(),
	},
	globalMocks: {
		global: {
			console: {
				log: tq.noop(),
			},
		},
	},
});

expectType<typeof tq.replace>(replace);
