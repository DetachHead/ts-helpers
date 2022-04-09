import { Stringable, TemplateLiteralStringable, ToString } from '../utilityTypes/String'
import { Equals, OnlyInfer } from '../utilityTypes/misc'
import isCI from 'is-ci'
import { hasPropertyPredicate } from './Any'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import assert from 'assert'
import { Throw } from 'throw-expression'
import { NoInfer } from 'ts-toolbelt/out/Function/NoInfer'

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
export const toStringType: {
    <T extends TemplateLiteralStringable>(value: T): ToString<T>
    <T extends Stringable>(value: T): string
} = (value: Stringable) => value.toString() as never

/**
 * asserts that a value matches the given type
 *
 * **WARNING**: for most type-testing scenarios, you probably want to use {@link exactly} instead, as it does an exact
 * match whereas this function only verifies that the value `extends` the given type
 */
export const assertType = <T = never>(_value: NoInfer<T>): void => undefined

export const exactly: {
    /**
     * Used to check that two types are an exact match. Useful for testing types.<br/>
     * Comes in three forms:
     * - type form: `exactly<ExpectedType, ActualType>()`
     * - mixed form: `exactly<Type>()(value)`<br/>
     * - value form: `exactly(expectedValue, actualValue)`<br/>
     * Correctly checks `any` and `never`.
     * <br>
     * **WARNING:** there are several cases where this doesn't work properly,
     * see [these issues](https://github.com/DetachHead/ts-helpers/labels/type%20testing)
     * @see Equals
     * # Mixed Form
     * ## `exactly` function
     * ### generics
     *
     * - **`Expected`:** The expected type.<br/>
     *
     * ## curried function
     * This is implemented as a higher order function to allow partial inference on the Expected type.     *
     * ### parameters
     *
     * * **`value`:** The value that will be checked.
     * * **`_this_parameter_will_be_expected_if_the_types_dont_match`:** An unused parameter used to cause a compile error
     * when the `Expected` and `Actual` types don't match. ***DO NOT*** specify this parameter if prompted to, as it
     * means your types don't match.<br/>
     * @example
     * let a: 1 | 2 = 1;
     * exactly<number>()(a); // error as `number` is not an exact match of `1 | 2`
     * exactly<number>()(a as number); // no error
     * exactly<1 | 2>()(a); // no error
     */
    <Expected>(): <_ extends OnlyInfer, Actual>(
        value: Actual,
        ..._this_parameter_will_be_expected_if_the_types_dont_match: Equals<
            Expected,
            Actual
        > extends true
            ? []
            : [never]
    ) => Actual

    /**
     * Used to check that two types are an exact match. Useful for testing types<br/>
     * Comes in three forms:
     * - type form: `exactly<ExpectedType, ActualType>()`
     * - mixed form: `exactly<Type>()(value)`<br/>
     * - value form: `exactly(expectedValue, actualValue)`<br/>
     * Correctly checks `any` and `never`.
     * <br>
     * **WARNING:** there are several cases where this doesn't work properly,
     * see [these issues](https://github.com/DetachHead/ts-helpers/labels/type%20testing)
     * # Type form
     * ## generics
     * - **`Expected`:**  The expected type.
     * - **`Actual`:**  The actual type
     * - **`_Bound`:** Used to bind the two types together, ***DO NOT*** specify this parameter.<br/>
     * @example
     * type Foo = 1 | 2;
     * exactly<1, Foo>();  // error as `1 | 2` is not an exact match of `1`
     * exactly<1 | 2, Foo>();  // no error
     */
    // return type is unknown instead of void because technically at runtime this still returns the curried function
    // from the value overload. seems safer to say it's unknown instead of void when it's not actually returning void
    <
        Expected extends Equals<Expected, Actual> extends true ? Actual : never,
        Actual extends _Bound,
        _Bound = Expected
    >(): unknown
    /**
     * Used to check that two types are an exact match. Useful for testing types<br/>
     * Comes in three forms:
     * - type form: `exactly<ExpectedType, ActualType>()`
     * - mixed form: `exactly<Type>()(value)`<br/>
     * - value form: `exactly(expectedValue, actualValue)`<br/>
     * Correctly checks `any` and `never`.
     * <br>
     * **WARNING:** there are several cases where this doesn't work properly,
     * see [these issues](https://github.com/DetachHead/ts-helpers/labels/type%20testing)
     * # value form
     * checks that the values match at runtime as well!
     * @param expected the expected value. its type gets automatically narrowed using the {@link Narrow} type
     * @param actual the actual value. its type gets automatically narrowed using the {@link Narrow} type
     * @example
     * declare const foo: 1 | 2;
     * exactly(foo, 1);  // error as `1 | 2` is not an exact match of `1`
     * exactly(foo, 1 as 1 | 2);  // no error
     */
    <
        _ extends OnlyInfer,
        Expected extends Equals<Expected, Actual> extends true ? Actual : never,
        Actual extends Bound,
        Bound = Expected
    >(
        expected: Narrow<Expected>,
        actual: Narrow<Actual>,
    ): void
} = ((...values: [unknown, unknown] | []) => {
    if (values.length === 2) {
        const [expected, actual] = values
        if (typeof expected === 'object') assert.deepStrictEqual(actual, expected)
        else assert.strictEqual(actual, expected)
        return undefined
    } else {
        return (value: unknown) => value
    }
}) as never

/** throws an error if running in CI. useful if you want to remind yourself to fix something later */
export const failCI = (message?: string): void => {
    if (isCI) throw new Error(message)
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException =>
    hasPropertyPredicate<NodeJS.ErrnoException>(error, 'code')

/**
 * throws an error stating that the operation is not yet implemented. useful for shutting up the type checker
 * during development
 */
export const TODO = (reason = 'no reason provided'): never =>
    Throw(`operation not implemented (TODO): ${reason}`)
