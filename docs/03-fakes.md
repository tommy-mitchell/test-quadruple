# Fakes

A fake is a function that behaves in a specific manner, used in place of another function. `test-quadruple` provides a few utils to assist in faking behaviors.

```ts
import * as tq from "test-quadruple";

const fn = tq.spy([
  tq.returns(1),
  tq.returns(2),
  tq.throws(new Error("Oops! All errors!")),
  tq.resolves(3),
  tq.rejects("Oops! Not an error!"),
  tq.noop(),
]);

fn();       //=> 1
fn();       //=> 2
fn();       //=> Throws Error("Oops! All errors!")
await fn(); //=> 3
await fn(); //=> Rejects with "Oops! Not an error!"
fn();       //=> void
```

## returns(value)

Creates a function that returns the given `value`.

## throws(error)

Creates a function that throws the given `error`.

## resolves(value)

Creates an async function that resolves to the given `value`.

## rejects(error)

Creates an async function that rejects with the given `error`.

## noop()

Creates a function that does nothing.
