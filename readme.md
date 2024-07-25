# test-quadruple

Simple and declarative mocks, spies, and replacements.

Combine with your unit test framework of choice.

## Install

```sh
npm install --save-dev test-quadruple
```

<details>
<summary>Other Package Managers</summary>
<p>

```sh
yarn add --dev test-quadruple
```

```sh
pnpm add --save-dev test-quadruple
```

</p>
</details>

## Usage

```ts
import test from "ava";
import * as tq from "test-quadruple";

test("test-quadrule", async t => {
  const logger = tq.spy();

  const { bar, baz } = await tq.replace<typeof import("./foo.js")>({
    modulePath: new URL("path/to/foo.js", import.meta.url),
    importMeta: import.meta,
    localMocks: {
      "./bar.js": {
        bar: tq.spy([
          tq.returns("Hello, world!"),
          tq.returns("lorem ipsum"),
        ]),
        baz: tq.mock<Baz>({
          bizz: "buzz",
        }),
      },
    },
    globalMocks: {
      console: {
        log: logger,
      },
    },
  });

  bar();
  bar();
  baz();

  t.like(tq.explain(logger), {
    callCount: 3,
    called: true,
    calls: [
      { arguments: ["Hello, world!"] },
      { arguments: ["lorem ipsum"] },
      { arguments: ["buzz"] },
    ],
    flatCalls: [
      "Hello, world!",
      "lorem ipsum",
      "buzz",
    ],
  });
});
```

## Definitions

| *Word*          | *Definition*                                                                     |
|-----------------|----------------------------------------------------------------------------------|
| **Mock**        | A partial object that behaves as a full object on the type level.                |
| **Spy**         | A wrapped (fake) function that tracks its calls.                                 |
| **Fake**        | A function that behaves in a specific manner, used in place of another function. |
| **Replacement** | A (partially) mocked/spied/faked module.                                         |

## Mocks

A mock is a partial object that behaves as a full object on the type level.

### mock(object?)

Partially mocks an object.

<details>
<summary>Example</summary>
<p>

```ts
import * as tq from "test-quadruple";

type Person = {
  name: string;
  getAge: () => number;
  parents?: {
    mother?: Person;
    father?: Person;
  };
};

declare const storePerson: (person: Person) => void;

storePerson(tq.mock({
  name: "John Doe",
  parents: {
    mother: {
      name: "Jane Doe",
      getAge: () => 42,
    },
  },
}));
```

</p>
</details>

#### object

Type: `object`\
Default: `{}`

The partially-mocked object.

## Spies

A spy is a wrapped function or set of fake functions that tracks its calls.

### spy(fn)

Wraps a function and tracks its calls.

<details>
<summary>Example</summary>
<p>

```ts
import * as tq from "test-quadruple";

const add = (a: number, b: number) => a + b;
const spy = tq.spy(add);
//    ^? const spy: (a: number, b: number) => number

spy(1, 2);
//=> 3

spy(3, 4);
//=> 7

console.log(tq.explain(spy));
//=> { callCount: 2, called: true, calls: [{ arguments: [1, 2] }, { arguments: [3, 4] }] }
```

</p>
</details>

#### fn

Type: `function`

The function to spy on.

### spy(fakes?)

### spy(...fakes)

Creates a spy that uses the provided [fakes](#fakes-1), in order. Subsequent calls will use the last provided fake.

<details>
<summary>Example</summary>
<p>

```ts
import * as tq from "test-quadruple";

const fn = tq.spy([tq.returns(1), tq.returns(2)]);
// OR: tq.spy(tq.returns(1), tq.returns(2));

fn();
//=> 1

fn();
//=> 2

fn();
//=> 2
```

</p>
</details>

#### fakes

Type: `function[]`

An optional array of fakes to use, in order.

### explain(spy): Explanation

List the tracked calls of a spy. Throws if the given function is not a spy.

<details>
<summary>Example</summary>
<p>

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

</p>
</details>

#### spy

Type: `function`

The spy to explain.

#### Explanation

Type: `object`

An object with information about the spy.

##### callCount

Type: `number`

The number of times the given spy was called.

##### called

Type: `boolean`

Whether or not the given spy was called.

##### calls

Type: `Array<{ arguments: unknown[] }>`

An array of calls to the given spy.

##### flatCalls

Type: `unknown[]`

A flattened array of calls to the given spy.

## Fakes

A fake is a function that behaves in a specific manner, used in place of another function. `test-quadruple` provides a few utils to assist in faking behaviors.

<details>
<summary>Example</summary>
<p>

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

fn();
//=> 1

fn();
//=> 2

fn();
//=> Error: "Oops! All errors!"

await fn();
//=> 3

await fn();
//=> "Oops! Not an error!"

fn();
//=> void
```

</p>
</details>

### returns(value)

Creates a function that returns the given `value`.

### throws(error)

Creates a function that throws the given `error`.

### resolves(value)

Creates an async function that resolves to the given `value`.

### rejects(error)

Creates an async function that rejects with the given `error`.

### noop()

Creates a function that does nothing.

## Replacements

A replacement is a (partially) mocked, spied, or faked module. Replacements are done asynchronously via [`esmock`](https://github.com/iambumblehead/esmock).

### replace\<ModuleType>(options)

Partially replaces local or global imports of a module.

<details>
<summary>Example</summary>
<p>

```ts
import { execa } from "execa";
import { match, P } from "ts-pattern";
import * as tq from "test-quadruple";

const { program } = await tq.replace<typeof import('./program.js')>({
  modulePath: new URL("program.js", import.meta.url),
  importMeta: import.meta, // Required
  localMocks: {
    execa: {
      execa: tq.spy(args => match(args)
        .with("foo", tq.resolves("bar"))
        .with([42, true], tq.resolves("The Ultimate Answer to Life, The Universe and Everything"))
        .otherwise(execa)
      ),
    },
  },
});

await program("foo");
//=> "bar"

await program(42, true);
//=> "The Ultimate Answer to Life, The Universe and Everything"

await program("echo hi");
//=> "hi"
```

</p>
</details>

#### options

Type: `object`

##### modulePath

Type: `string | URL`

The path to the module to replace.

##### importMeta

Type: `object`

Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta).

##### localMocks?

Type: `object`

Mock modules directly imported by the source module.

##### globalMocks?

Type: `object`

Mock modules or globals imported anywhere in the source tree.

## Related

- [testtriple](https://github.com/VanCoding/testtriple) - A handy little mocking library.
- [testdouble.js](https://github.com/testdouble/testdouble.js) - A minimal test double library for TDD with JavaScript.
- [tinyspy](https://github.com/tinylibs/tinyspy) - A minimal fork of nanospy, with more features. Also tracks spy returns.
- [@fluffy-spoon/substitute](https://github.com/ffMathy/FluffySpoon.JavaScript.Testing.Faking) - A TypeScript port of NSubstitute.
- [Sinon](https://github.com/sinonjs/sinon) - Standalone and test framework agnostic JavaScript test spies, stubs and mocks.
- [esmock](https://github.com/iambumblehead/esmock) - ESM import and globals mocking for unit tests.
