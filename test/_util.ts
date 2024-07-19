import { fileURLToPath } from "node:url";

export const atFixture = (fixture: string) => fileURLToPath(new URL(`fixtures/${fixture}/fixture.ts`, import.meta.url));
