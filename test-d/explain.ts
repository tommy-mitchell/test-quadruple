import { expectType } from "tsd";
import * as tq from "test-quadruple";

declare const explanation: tq.Explanation;

expectType<number>(explanation.callCount);
expectType<boolean>(explanation.called);
expectType<tq.FunctionCall[]>(explanation.calls);
expectType<unknown[]>(explanation.calls[0]!.arguments);

expectType<tq.Explanation>(tq.explain(tq.spy()));
expectType<tq.Explanation>(tq.explain(tq.noop()));
