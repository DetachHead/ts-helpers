import { Primitive } from 'utility-types'
import { Stringable, ToString } from '../utilityTypes/String'

/**
 * narrows the given value from type `Base` to type `Narrowed` without having to assign it to a new variable
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function cast<Base, Narrowed extends Base>(_value: Base): asserts _value is Narrowed {}

/**
 * unsafely casts the given value to type `T` without having to assign it to a new variable.
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function unsafeCast<T>(_value: unknown): asserts _value is T {}

/**
 * converts the given `value` to a string, preserving its value at compiletime where possible
 */
export function toStringType<T extends Stringable>(
	value: T
): T extends Exclude<Primitive, symbol> ? ToString<T> : string {
	return value.toString() as never
}

// TODO: find a type testing library that doesnt suck
// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
export function testType<T>(_value: T): void {}
