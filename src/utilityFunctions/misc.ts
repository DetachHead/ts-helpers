import { Stringable, TemplateLiteralStringable, ToString } from '../utilityTypes/String'
import { Equals } from '../utilityTypes/misc'

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
): T extends TemplateLiteralStringable ? ToString<T> : string {
  return value.toString() as never
}

// TODO: find a type testing library that doesnt suck
// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
export function testType<T>(_value: T): void {}

/**
 * creates a function that can be used to check that a type exactly equals another type. sometimes useful for testing types
 * @example
 * const exactlyNumber = exactly<number>() //create the "type"
 * const foo = exactlyNumber(1 as number) //no error
 * const bar = exactlyNumber(1) //error
 * @see Equals
 */
export function exactly<Expected>() {
  // don't think it's possible to get the return type from this scope, as this wrapper function is a workaround to create
  // types where the value needs to be checked against the generic ()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return <Actual>(value: Actual & (Equals<Expected, Actual> extends true ? unknown : never)) =>
    value
}
