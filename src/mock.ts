import mapObject from "map-obj";
import type { PartialDeep as PartialDeepInternal } from "type-fest";

type UnknownRecord = Record<string, unknown>;

type PartialDeep<ObjectType extends UnknownRecord> = {
	[KeyType in keyof ObjectType]?: PartialDeepInternal<ObjectType[KeyType], { recurseIntoArrays: true; }>;
};

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
export const mock = <MockType extends UnknownRecord>(object: PartialDeep<MockType> = {}): MockType => (
	mapObject(object as UnknownRecord, (key, value) => [
		key,
		typeof value === "function" // Define function name if missing
			? Object.defineProperty(value, "name", { value: key })
			: value,
	], { deep: true }) as MockType
);
