import test from "ava";
import { returns } from "#src/fakes.ts";
import { mock } from "#src/mock.ts";
import { spy } from "#src/spy.ts";

type Person = {
	name: string;
	getAge: () => number;
	parents: {
		mother: Person;
		father: Person;
	};
	relatives: Array<Person | Person[]>;
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
		relatives: undefined,
	});

	t.is(person.parents.mother.getAge(), 30);
});

test("empty mock", t => {
	const person = mock<Person>();

	t.like(person, {
		name: undefined,
		getAge: undefined,
		parents: undefined,
		relatives: undefined,
	});
});

test("sets names of spies and anonymous functions", t => {
	const foo = {
		getAge: returns(30),
	};

	t.is(foo.getAge.name, "");

	const person = mock<Person>({
		getAge: spy(returns(30)),
		parents: {
			mother: {
				getAge: spy(returns(55)),
			},
		},
		relatives: [{
			name: "Doe",
			getAge: returns(40),
			relatives: [{
				name: "Twig",
				getAge: function otherName() { // eslint-disable-line func-name-matching, func-names
					return 10;
				},
			}],
		}, [{
			name: "Smith",
			getAge: returns(50),
		}]],
	});

	t.is(person.getAge.name, "getAge");

	const { mother } = person.parents;
	t.is(mother.getAge.name, "getAge");

	const doe = person.relatives[0]! as Person;
	t.is(doe.getAge.name, "getAge");

	const twig = doe.relatives[0]! as Person;
	t.is(twig.getAge.name, "otherName");

	const smith = (person.relatives[1]! as Person[])[0]!;
	t.is(smith.getAge.name, "getAge");
});

test("preserves object identities", t => {
	const object = {};
	t.is(mock(object), object);
});

test("handles circular references", t => {
	type A = { self?: A; others: A[]; };
	const a: A = { others: [] };
	a.self = a;
	a.others.push(a);

	const b = mock({ a });
	t.is(b.a.self, b.a);
	t.is(b.a.others[0], b.a);
});
