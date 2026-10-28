# Spies

A spy is a wrapped function or set of fake functions that tracks its calls.

```ts
import * as tq from "test-quadruple";

const add = (a: number, b: number) => a + b;
const spy = tq.spy(add);
//    ^?  (a: number, b: number) => number

spy(1, 2); //=> 3
spy(3, 4); //=> 7

console.log(tq.explain(spy));
//=> { calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }], … }
```

## spy(fn)

Wraps a function and tracks its calls.

### fn

Type: `function`

The function to spy on.

## spy(fakes?)

## spy(...fakes)

Creates a spy that uses the provided [fakes](./03-fakes.md), in order. Subsequent calls will use the last provided fake.

```ts
import * as tq from "test-quadruple";

const fn = tq.spy([tq.returns(1), tq.returns(2)]);
// OR: tq.spy(tq.returns(1), tq.returns(2));

fn(); //=> 1
fn(); //=> 2
fn(); //=> 2
```

### fakes

Type: `function[]`

An optional array of fakes to use, in order.

## spy()

Creates an anonymous spy.

```ts
import * as tq from "test-quadruple";

const { add } = await tq.replace({
  modulePath: "./module.js",
  importMeta: import.meta,
  localMocks: {
    "./some-dep.js": {
      add: tq.spy()
      //      ^?  tq.spy<(a: number, b: number) => number>
    },
  },
});

add(1, 2);
add(3, 4);

console.log(tq.explain(add));
//=> { calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }], … }
```

## explain(spy): Explanation

List the tracked calls of a spy. Throws if the given function is not a spy.

```ts
import test from "ava";
import * as tq from "test-quadruple";

test("tracks calls of a spy", async t => {
  const fn = tq.spy(tq.resolves(1));

  t.is(await fn(), 1);

  t.like(tq.explain(fn), {
    callCount: 1,
    called: true,
    calls: [{ arguments: [1, 2] }],
    flatCalls: [1, 2],
  });
});
```

### spy

Type: `function`

The spy to explain.

### Explanation

Type: `object`

An object with information about the spy.

#### callCount

Type: `number`

The number of times the given spy was called.

#### called

Type: `boolean`

Whether or not the given spy was called.

#### calls

Type: `Array<{ arguments: unknown[] }>`

An array of calls to the given spy.

#### flatCalls

Type: `unknown[]`

A flattened array of calls to the given spy.

## reset(spy)

Resets the tracked calls and fakes sequence of a spy. Throws if the given function is not a spy.

```ts
import * as tq from "test-quadruple";

const fn = tq.spy([tq.returns(1), tq.returns(2)]);

fn(); //=> 1
fn(); //=> 2
fn(); //=> 2

console.log(tq.explain(fn));
//=> { called: true, … }

tq.reset(fn);
console.log(tq.explain(fn));
//=> { called: false, … }

fn();
//=> 1
```

### spy

Type: `function`

The spy to reset.

## reset(spies)

## reset(...spies)

Resets the tracked calls and fakes sequences of the provided spies. Throws if the given functions are not spies.

```ts
import * as tq from "test-quadruple";

const fn1 = tq.spy();
const fn2 = tq.spy();

fn1();
console.log(tq.explain(fn1));
//=> { called: true, … }

fn2();
console.log(tq.explain(fn2));
//=> { called: true, … }

tq.reset([fn1, fn2]);
// OR: tq.reset(fn1, fn2);

console.log(tq.explain(fn1));
//=> { called: false, … }

console.log(tq.explain(fn2));
//=> { called: false, … }
```

### spies

Type: `function[]`

An array of spies to reset.
