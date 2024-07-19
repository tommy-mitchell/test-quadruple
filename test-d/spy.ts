import { expectAssignable, expectType } from "tsd";
import * as tq from "../src/index.js";

declare const add: (a: number, b: number) => number;

const spy = tq.spy(add);

expectAssignable<typeof add>(spy);
expectType<number>(spy(1, 2));

// eslint-disable-next-line unicorn/prefer-native-coercion-functions
const anonymousSpy = tq.spy(args => Boolean(args));

expectAssignable<tq.AnyFunction>(anonymousSpy);
expectType<boolean>(anonymousSpy(0));

expectAssignable<tq.AnyFunction>(tq.spy());
expectAssignable<tq.AnyFunction>(tq.spy([tq.returns(1), tq.returns(2)]));
expectAssignable<tq.AnyFunction>(tq.spy(tq.returns(1), tq.returns(2)));
