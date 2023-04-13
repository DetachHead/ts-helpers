import { RequiredKeys } from 'utility-types'

/** type equivalent of the `!` operator */
export type Not<Types extends boolean> = {
    [T in `${Types}`]: T extends 'true' ? false : true
}[`${Types}`]

/**
 * type equivalent of the `||` operator.
 * @example
 * type Foo = Or<IsGreaterThan<1, 0> | IsGreaterThan<1, 2>> //true
 */
export type Or<T extends boolean> = true extends T ? true : false

type A = RequiredKeys

/**
 * type equivalent of the `&&` operator.
 * @example
 * type Foo = And<IsGreaterThan<1, 0> & IsGreaterThan<1, 2>> //false
 */
export type And<T extends boolean> = (T extends never ? false : true) extends never
    ? false
    : T extends false
    ? false
    : true

/**
 * `true` if `Subtype` extends `Supertype`, else `false
 *
 * like `ts-toolbelt`'s `Extends` but doesn't have special functionality for `never`
 * (ie. this one behaves exactly like a regular `extends` check ina  conditional type)
 */
export type Extends<Subtype, Supertype> = Subtype extends Supertype ? true : false
