import type { PartialDeep as PartialDeepInternal, UnknownRecord } from "type-fest";
import { SPY_NAME_SYMBOL } from "./spy.ts";
import { objectForEach } from "./util.ts";

/** Deeply sets names of spies and anonymous functions to their associated keys. */
const defineFunctionNames = (object: UnknownRecord) => (
	objectForEach(object, (key, value) => {
		if (typeof value === "function" && (!value.name || value.name === SPY_NAME_SYMBOL)) {
			Object.defineProperty(value, "name", { value: key });
		}
	})
);

type PartialDeep<ObjectType> = {
	[KeyType in keyof ObjectType]?: PartialDeepInternal<ObjectType[KeyType], { recurseIntoArrays: true; }>;
};

type PartialMock<MockType> = MockType extends UnknownRecord ? PartialDeep<MockType> : Partial<MockType>;

/**
 * Partially mocks an object.
 *
 * @example
 * import * as tq from "test-quadruple";
 *
 * type Person = {
 *   name: string;
 *   getAge: () => number;
 *   parents?: {
 *     mother?: Person;
 *     father?: Person;
 *   };
 * };
 *
 * declare const storePerson: (person: Person) => void;
 *
 * storePerson(tq.mock({
 *   name: "John Doe",
 *   parents: {
 *     mother: {
 *       name: "Jane Doe",
 *       getAge: () => 42,
 *     },
 *   },
 * }));
 */
export const mock = <MockType>(object?: PartialMock<MockType>): MockType => {
	object ??= {} as PartialMock<MockType>; // eslint-disable-line @typescript-eslint/consistent-type-assertions

	defineFunctionNames(object);
	return object as MockType;
};
