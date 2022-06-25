import { AnyFunction } from 'tsdef'

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
    wrapped: {
        [Key in keyof T]: T[Key] extends AnyFunction ? ToArrowFunction<T[Key]> : T[Key]
    }
}['wrapped']

/**
 * transforms all methods in `T` into non-arrow functions, which turns off variance checks
 * @see https://github.com/microsoft/TypeScript/pull/18654
 */
export type UnsafeVariance<T> = {
    wrapped: {
        [Key in keyof T]: T[Key] extends AnyFunction ? ToNonArrowFunction<T[Key]> : T[Key]
    }
}['wrapped']
