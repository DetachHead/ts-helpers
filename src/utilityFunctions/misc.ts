import { Stringable, TemplateLiteralStringable, ToString } from '../utilityTypes/String'
import { Equals } from '../utilityTypes/misc'
import isCI from 'is-ci'
import { hasPropertyPredicate } from './Any'

/**
 * narrows the given value from type `Base` to type `Narrowed` without having to assign it to a new variable
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
export const cast = <Base, Narrowed extends Base>(_value: Base): asserts _value is Narrowed => {
    // do nothing
}

/**
 * unsafely casts the given value to type `T` without having to assign it to a new variable.
 * @example
 * declare const foo: number
 * cast<number, 1|2>(foo)
 * type Bar = typeof foo //1|2
 */
export const unsafeCast = <T>(_value: unknown): asserts _value is T => {
    // do nothing
}

/**
 * converts the given `value` to a string, preserving its value at compiletime where possible
 */
export const toStringType = <T extends Stringable>(
    value: T,
): T extends TemplateLiteralStringable ? ToString<T> : string => value.toString() as never

// TODO: find a type testing library that doesnt suck
export const testType = <T>(_value: T): void => {
    // do nothing
}

/**
 * creates a function that can be used to check that a type exactly equals another type. sometimes useful for testing types
 * @example
 * const exactlyNumber = exactly<number>() //create the "type"
 * const foo = exactlyNumber(1 as number) //no error
 * const bar = exactlyNumber(1) //error
 * @see Equals
 */
export const exactly = <Expected>() => {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- don't think it's possible to get the return type from this scope, as this wrapper function is a workaround to create types where the value needs to be checked against the generic
    return <Actual>(value: Actual & (Equals<Expected, Actual> extends true ? unknown : never)) =>
        value
}

/** throws an error if running in CI. useful if you want to remind yourself to fix something later */
export const failCI = (message?: string): void => {
    if (isCI) throw new Error(message)
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => hasPropertyPredicate<NodeJS.ErrnoException>(error, 'code')
