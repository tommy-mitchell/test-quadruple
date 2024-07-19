import { expectAssignable, expectType } from "tsd";
import * as tq from "../src/index.js";

declare const anyFunction: tq.AnyFunction;

expectAssignable<() => any>(anyFunction);

expectAssignable<tq.AnyFunction>(tq.returns(1));
expectAssignable<tq.AnyFunction>(tq.throws(new Error("foo")));
expectAssignable<tq.AnyFunction>(tq.resolves(1));
expectAssignable<tq.AnyFunction>(tq.rejects(new Error("foo")));
expectAssignable<tq.AnyFunction>(tq.noop());

expectType<() => number>(tq.returns(1));
expectType<1>(tq.returns(1 as const)());

expectType<() => never>(tq.throws(new Error("foo")));
expectType<() => never>(tq.throws("foo"));

expectType<() => Promise<number>>(tq.resolves(1));
expectType<Promise<number>>(tq.resolves(1)());
expectType<1>(await (tq.resolves(1 as const)()));

expectType<() => Promise<never>>(tq.rejects(new Error("foo")));
expectType<() => Promise<never>>(tq.rejects("foo"));

expectType<() => void>(tq.noop());
