import { expectType } from "tsd";
import * as tq from "../src/index.js";

type Person = {
	name: string;
	getAge: () => number;
	parents?: {
		mother?: Person;
		father?: Person;
	};
};

expectType<Person>(tq.mock());
expectType<Person>(tq.mock({}));

// TODO:
// expectType<Person>(tq.mock({
// 	name: "John Doe",
// 	parents: {
// 		mother: {
// 			name: "Jane Doe",
// 		},
// 	},
// }));

expectType<Person>(tq.mock<Person>());
expectType<Person>(tq.mock<Person>({}));
expectType<Person>(tq.mock<Person>({
	name: "John Doe",
	parents: {
		mother: {
			name: "Jane Doe",
		},
	},
}));

type Human = {
	name: string;
	getAge: () => number;
	relatives: Human[];
};

expectType<Human>(tq.mock<Human>({
	name: "John Doe",
	relatives: [{}, {
		name: "Jane Doe",
		getAge: () => 42,
	}],
}));