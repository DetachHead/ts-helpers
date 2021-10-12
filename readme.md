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

### Type Testing

With the `exactly` function you can test if types or values are an exact match to a type

```ts
const a: 1 | 2 = 1
//values (also does a runtime assertion on the values)
exactly(1 as number, a) // error as `1 | 2` is not an exact match of `number`
exactly(1 as number, a as number) // no error
exactly(1 as 1 | 2, a) // no error

// mixed
exactly<number>()(a) // error as `1 | 2` is not an exact match of `number`
exactly<number>()(a as number) // no error
exactly<1 | 2>()(a) // no error

// types
type Foo = 1 | 2
exactly<1, Foo>() // error as `1 | 2` is not an exact match of `1`
exactly<1 | 2, Foo>() // no error
```

The `Equals` type allows you to check if two types are equal at the type level

```ts
Equals<number, 1 | 2> // false
Equals<any, 10> // false
Equals<unknown, never> // false
```

## requirements

### typescript

this package is designed for typescript 4.5. you will probably have issues trying to use it with older versions, tho it will probably still work if you set `skipLibCheck` to `true` in your `tsconfig.json` (which isn't recommended)

### supported js runtimes

-   [x] nodejs
-   [x] browser
-   [x] deno (using esm.sh - eg. `import { exactly } from 'http://esm.sh/@detachhead/ts-helpers/dist/utilityFunctions/misc'`)
