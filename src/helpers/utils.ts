import path from "node:path";
import type { UnknownRecord } from "type-fest";

/** Spreads the given values into a single array. */
export const arrify = <T>(value: T | T[], ...rest: T[]): T[] => ([
	...(Array.isArray(value) ? value : [value]),
	...rest,
].filter(Boolean));

/** Returns true if the given path is relative. */
export const isRelative = (value: string): boolean => !path.isAbsolute(value) && value.startsWith(".");

const isPlainObject = (object: unknown): object is UnknownRecord => (
	Boolean(object) && typeof object === "object"
	&& (Object.getPrototypeOf(object) === null || Object.getPrototypeOf(Object.getPrototypeOf(object)) === null)
);

type ObjectForEachCallback = (key: string, value: unknown) => void;

/** Deeply traverses an object and its nested objects/arrays, calling the given `callback` for each entry. */
export const objectForEach = (object: UnknownRecord, callback: ObjectForEachCallback, seen = new WeakSet()) => {
	for (const [key, value] of Object.entries(object)) {
		callback(key, value);

		if (isPlainObject(value)) {
			if (object === value || seen.has(value)) {
				continue;
			}

			seen.add(value);
			objectForEach(value, callback, seen);
		}

		if (!Array.isArray(value)) {
			continue;
		}

		const traverseArray = (array: unknown[]) => {
			if (seen.has(array)) {
				return;
			}

			seen.add(array);

			for (const element of array) {
				if (element !== object && isPlainObject(element) && !seen.has(element)) {
					objectForEach(element, callback, seen);
				} else if (Array.isArray(element)) {
					traverseArray(element);
				}
			}
		};

		traverseArray(value);
	}
};
