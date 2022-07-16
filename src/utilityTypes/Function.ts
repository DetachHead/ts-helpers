import { AnyFunction } from 'tsdef'
import { PickByValue } from 'utility-types'

/**
 * converts a non-arrow function type to an arrow function type. arrow functions are checked more strictly than
 * non-arrow functions
 * @see https://github.com/microsoft/TypeScript/pull/18654
 * @example
 * declare class Foo<T = unknown> {
 *     notArrowFunction(value: T): void
 *     isArrowFunction: (value: T) => void
 * }
 * type ArrowFunction = ToArrowFunction<Foo['notArrowFunction']>
 */
export type ToArrowFunction<T extends AnyFunction> = {
    fn: (...args: Parameters<T>) => ReturnType<T>
}['fn']

/**
 * converts an arrow function type to a non-arrow function type. arrow functions are checked more strictly than
 * non-arrow functions
 * @see https://github.com/microsoft/TypeScript/pull/18654
 * @example
 * declare class Foo<T = unknown> {
 *     notArrowFunction(value: T): void
 *     isArrowFunction: (value: T) => void
 * }
 * type NotArrowFunction = ToNonArrowFunction<Foo['isArrowFunction']>
 */
export type ToNonArrowFunction<T extends AnyFunction> = {
    fn(...args: Parameters<T>): ReturnType<T>
}['fn']

/**
 * transforms all methods in `T` into arrow functions, which makes typescript check it more strictly
 * @see https://github.com/microsoft/TypeScript/pull/18654
 */
export type SafeVariance<T> = {
    wrapped: T &
        {
            [Key in keyof T]: T[Key] extends AnyFunction ? ToArrowFunction<T[Key]> : T[Key]
        }
}['wrapped']

/**
 * transforms all methods in `T` into non-arrow functions, which turns off variance checks
 *
 * **WARNING:** doesn't work properly with private/protected methods
 * @see https://github.com/microsoft/TypeScript/pull/18654
 */
// TODO: fix private methods, probs dependent on https://github.com/microsoft/TypeScript/issues/22677
export type UnsafeVariance<T> = {
    wrapped: {
        [Key in keyof T]: T[Key] extends AnyFunction ? ToNonArrowFunction<T[Key]> : T[Key]
    }
}['wrapped']

/**
 * filters out properties of `T` that aren't a method of `T` (ie. its `this` type must be `T`)
 * @example
 * class A {
 *     foo(value: number) {return 1}
 *     bar = () => {}
 *     baz(this: number) {}
 *     qux = 1
 * }
 * type B = Methods<A> // { foo(value: number); bar: () => void; }
 **/
export type Methods<T> = PickByValue<T, (this: T, ...args: never[]) => unknown>
