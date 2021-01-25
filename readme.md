# ts-helpers

various typescript helper functions and utility types

[![npm](https://img.shields.io/npm/v/@detachhead/ts-helpers)](https://npmjs.org/@detachhead/ts-helpers)

## features

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
