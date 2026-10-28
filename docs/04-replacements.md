# Replacements

A replacement is a (partially) mocked, spied, or faked module. Replacements are done asynchronously via [`esmock`](https://github.com/iambumblehead/esmock).

```ts
import { execa } from "execa";
import { match, P } from "ts-pattern";
import * as tq from "test-quadruple";

const { program } = await tq.replace<typeof import("./program.js")>({
  modulePath: new URL("program.js", import.meta.url),
  importMeta: import.meta,
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

## replace\<ModuleType>(options)

Partially replaces local or global imports of a module.

In [`localMocks`](#localmocks) and [`globalMocks`](#globalmocks), you can use the `global` key to replace items in the [global scope](https://mdn.io/global-scope):

<details>
<summary>Example</summary>
<p>

```js
// foo.js
export const foo = () => console.log("foo");
export const bar = () => globalThis.console.log("bar");
export { baz } from "./baz.js"
```

```js
// bar.js
export const baz = () => console.log("bar");
```

```js
import * as tq from "test-quadruple";

const loggerLocal = tq.spy();
const loggerGlobal = tq.spy();

const { foo, bar, baz } = await tq.replace({
  modulePath: "./foo.js",
  importMeta: import.meta,
  localMocks: {
    global: {
      console: { log: loggerLocal }
    }
  },
  globalMocks: {
    global: {
      console: { log: loggerGlobal },
      globalThis: {
        console: { log: loggerGlobal }
      }
    }
  }
});

foo();
bar();
baz();

console.log(tq.explain(loggerLocal));
//=> { flatCalls: ["foo"], … }

console.log(tq.explain(loggerGlobal));
//=> { flatCalls: ["bar", "baz"], … }
```

</p>
</details>

### options

Type: `object`

#### modulePath

Type: `string | URL`

The path to the module to replace. Supports [subpath imports](https://nodejs.org/api/packages.html#subpath-imports).

#### importMeta

Type: `object`

Pass in [`import.meta`](https://mdn.io/import.meta).

#### strict?

Type: `boolean`

By default, mocks are merged with the original modules. Set this to `true` to override the mocked modules instead.

#### localMocks?

Type: `object`

Mock modules directly imported by the source module.

#### globalMocks?

Type: `object`

Mock modules imported anywhere in the source tree.
