import path from "node:path";
import type { UnknownRecord } from "type-fest";

/** Spreads the given values into a single array. */
export const arrify = <T>(value: T | T[], ...rest: T[]): T[] => ([
	...(Array.isArray(value) ? value : [value]),
	...rest,
].filter(Boolean));

/** Returns true if the given path is relative. */
const isRelative = (value: string): boolean => !path.isAbsolute(value) && value.startsWith(".");

/** Returns true if the given path is relative or a subpath import. */
export const isRelativeOrSubpath = (value: string): boolean => isRelative(value) || value.startsWith("#");

type GroupByRelativeResult = [hasRelative: boolean, relative: Record<string, unknown>, other: Record<string, unknown>];

/** Groups object keys by whether they are module IDs that need resolving (relative paths or subpath imports). */
export const groupByRelative = (object: Record<string, unknown>): GroupByRelativeResult => {
	const grouped = Object.groupBy(Object.entries(object), ([key]) => isRelativeOrSubpath(key) ? "relative" : "other");

	return [
		Boolean(grouped.relative),
		Object.fromEntries(grouped.relative ?? []),
		Object.fromEntries(grouped.other ?? []),
	];
};

export const isPlainObject = (object: unknown): object is UnknownRecord => (
	typeof object === "object" && object !== null
	&& (Object.getPrototypeOf(object) === null || Object.getPrototypeOf(object) === Object.prototype)
);
