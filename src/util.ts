/** Spreads the given values into a single array. */
export const arrify = <T>(value: T | T[], ...rest: T[]): T[] => ([
	...(Array.isArray(value) ? value : [value]),
	...rest,
].filter(Boolean));
