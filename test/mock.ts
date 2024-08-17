import test from "ava";
import { returns } from "../src/fakes.js";
import { mock } from "../src/mock.js";
import { spy } from "../src/spy.js";

type Person = {
	name: string;
	getAge: () => number;
	parents: {
		mother: Person;
		father: Person;
	};
};

test("partially mocks a type", t => {
	const person = mock<Person>({
		name: "Bobby",
		parents: {
			mother: {
				name: "Alice",
				getAge: () => 30,
			},
		},
	});

	t.like(person, {
		name: "Bobby",
		getAge: undefined,
		parents: {
			mother: {
				name: "Alice",
			},
			father: undefined,
		},
	});

	t.is(person.parents.mother.getAge(), 30);
});

test("empty mock", t => {
	const person = mock<Person>();

	t.like(person, {
		name: undefined,
		getAge: undefined,
		parents: undefined,
	});
});

test("sets names of spies", t => {
	const obj = {
		getAge: returns(30),
	};

	t.is(obj.getAge.name, "");

	const person = mock<Person>({
		getAge: spy(returns(30)),
		parents: {
			mother: {
				getAge: spy(returns(55)),
			},
		},
	});

	t.is(person.getAge.name, "getAge");
	t.is(person.parents.mother.getAge.name, "getAge");
});
