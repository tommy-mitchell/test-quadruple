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
        "./baz.js": tq.mock<typeof import("./baz.js")>({
          bizz: "buzz",
        }),
      },
    },
    globalMocks: {
      global: {
        console: {
          log: logger,
        },
      }
    },
  });

  bar();
  bar();

  t.like(tq.explain(logger), {
    callCount: 2,
    called: true,
    calls: [
      { arguments: ["Hello, world!"] },
      { arguments: ["lorem ipsum"] },
    ],
    flatCalls: [
      "Hello, world!",
      "lorem ipsum",
    ],
  });

  tq.reset(logger);
  baz();

  t.like(tq.explain(logger), {
    callCount: 1,
    called: true,
    calls: [{ arguments: ["buzz"] }],
    flatCalls: ["buzz"],
  });
});
```

## Definitions

| *Word*                                              | *Definition*                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Mock** ([docs](./docs/01-mocks.md))               | A partial object that behaves as a full object on the type level.                |
| **Spy** ([docs](./docs/02-spies.md))                | A wrapped (fake) function that tracks its calls.                                 |
| **Fake** ([docs](./docs/03-fakes.md))               | A function that behaves in a specific manner, used in place of another function. |
| **Replacement** ([docs](./docs/04-replacements.md)) | A (partially) mocked/spied/faked module.                                         |

## Related

- [testtriple](https://github.com/VanCoding/testtriple) - A handy little mocking library.
- [testdouble.js](https://github.com/testdouble/testdouble.js) - A minimal test double library for TDD with JavaScript.
- [tinyspy](https://github.com/tinylibs/tinyspy) - A minimal fork of nanospy, with more features. Also tracks spy returns.
- [Sinon](https://github.com/sinonjs/sinon) - Standalone and test framework agnostic JavaScript test spies, stubs and mocks.
- [esmock](https://github.com/iambumblehead/esmock) - ESM import and globals mocking for unit tests.
