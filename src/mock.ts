import mapObject from "map-obj";
import type { PartialDeep as PartialDeepInternal } from "type-fest";

type UnknownRecord = Record<string, unknown>;

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
export const mock = <MockType>(object?: PartialMock<MockType>): MockType => (
	mapObject(object ?? {}, (key, value) => [
		key,
		typeof value === "function" // Define function name if missing
			? Object.defineProperty(value, "name", { value: key })
			: value,
	], { deep: true }) as MockType
);
