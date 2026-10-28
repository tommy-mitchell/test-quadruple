# Mocks

A mock is a partial object that behaves as a full object on the type level.

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

## mock(object?)

Partially mocks an object.

### object

Type: `object`\
Default: `{}`

The partially-mocked object.
