/** type equivalent of the `!` operator */
export type Not<Types extends boolean> = {
    [T in `${Types}`]: T extends 'true' ? false : true
}[`${Types}`]

/**
 * type equivalent of the `||` operator.
 *
 * note that an `And` type is not necessary, as `IsGreaterThan<1, 0> & IsGreaterThan<3, 0>` will resolve to `true` but
 * `IsGreaterThan<1, 0> | IsGreaterThan<1, 2>` will resolve to `boolean`
 * @example
 * type Foo = Or<IsGreaterThan<1, 0> | IsGreaterThan<1, 2>> //true
 *
 */
export type Or<T extends boolean> = true extends T ? true : false
