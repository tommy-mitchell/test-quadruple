import { expectError, expectType } from "tsd";
import * as tq from "../src/index.ts";

// Require at least one argument
expectError(tq.reset());

// Works for individual spies
const spy = tq.spy();
expectType<void>(tq.reset(spy));

// Works as array or variadic
const spy1 = tq.spy();
const spy2 = tq.spy();
expectType<void>(tq.reset([spy1, spy2]));
expectType<void>(tq.reset(spy1, spy2));

// Works for empty array
expectType<void>(tq.reset([]));
