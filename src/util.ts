import path from "node:path";

/** Spreads the given values into a single array. */
export const arrify = <T>(value: T | T[], ...rest: T[]): T[] => ([
	...(Array.isArray(value) ? value : [value]),
	...rest,
].filter(Boolean));

/** Returns true if the given path is relative. */
export const isRelative = (value: string): boolean => !path.isAbsolute(value) && value.startsWith(".");
