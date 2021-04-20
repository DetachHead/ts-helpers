# ts-helpers

various typescript helper functions and utility types

[![npm](https://img.shields.io/npm/v/@detachhead/ts-helpers)](https://npmjs.org/@detachhead/ts-helpers)

## features

### value tracking

this library includes many helper types and functions such as `add`, `subtract`, and `substring` which allow the values
to be known at compile time

![asdf](./readme%20pics/functions.gif)

### `noUncheckedIndexedAccess` support

the `noUncheckedIndexedAccess` compiler flag is epic, but there's room for improvement. for example, the following
issue:

```ts
if (foo.length > 2) {
  const bar: string = foo[1] //error: string | undefined not assignable to string
}
```

can be solved with `lengthGreaterThan`

```ts
import { lengthGreaterThan } from '@detachhead/ts-helpers'

if (lengthGreaterThan(foo, 2)) {
  const bar: string = foo[1] //no error, foo is casted to [string, string]
}
```

there's also `lengthLessThan`, `lengthGreaterOrEqual`, etc.

most of the array functions in this library keep track of the length, mostly thanks
to [this `TupleOf` utility type](https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787)

### date formatter type

this library contains a helper type and function for formatting dates using
the [`date-fns`](https://date-fns.org/v2.21.1/docs/format) format.

```ts
const date = formatDate(new Date(), 'dd-MM-yyyy')

assert(date === '01/01/2021') //compile error, wrong date format
```

you can use any date format that `date-fns` accepts, and the `FormatDate` utility type will generate a template literal
type to match your desired date format.
