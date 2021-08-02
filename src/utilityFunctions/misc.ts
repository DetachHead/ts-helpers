import { Stringable, TemplateLiteralStringable, ToString } from '../utilityTypes/String'
import { Equals } from '../utilityTypes/misc'
import isCI from 'is-ci'
import { hasPropertyPredicate } from './Any'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import assert from 'assert'

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
/**
 * @deprecated use `exactly` instead for testing types
 * @see exactly
 */
export const testType = <T>(_value: T): void => {
    // do nothing
}

export const exactly: {
    /**
     * Used to check that two types are an exact match. Useful for testing types.<br/>
     * Comes in three forms:
     * - type form: `exactly<ExpectedType, ActualType>()`
     * - mixed form: `exactly<Type>()(value)`<br/>
     * - value form: `exactly(expectedValue, actualValue)`<br/>
     * Correctly checks `any` and `never`.
     * @see Equals
     * # Value Form
     * ## `exactly` function
     * ### generics
     *
     * - **`Expected`:** The expected type.<br/>
     *
     * ## curried function
     * This is implemented as a higher order function to allow partial inference on the Expected type.
     * ### generics
     * - **`_Actual`:** The actual type, ***DO NOT*** specify this parameter. it's inferred when you provide the `value`
     * parameter<br/>
     *
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
    <Expected>(): <_Actual>(
        value: _Actual,
        ..._this_parameter_will_be_expected_if_the_types_dont_match: Equals<
            Expected,
            _Actual
        > extends true
            ? []
            : [never]
    ) => _Actual

    /**
     * Used to check that two types are an exact match. Useful for testing types<br/>
     * Comes in three forms:
     * - type form: `exactly<ExpectedType, ActualType>()`
     * - mixed form: `exactly<Type>()(value)`<br/>
     * - value form: `exactly(expectedValue, actualValue)`<br/>
     * Correctly checks `any` and `never`.
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
     * # value form
     * checks that the values match at runtime as well!
     * ## generics
     * - **`_Expected`:**  The expected type. ***DO NOT*** specify this parameter, it should be inferred from the value
     * you provide.
     * - **`_Actual`:**  The actual type. ***DO NOT*** specify this parameter, it should be inferred from the valuu you
     * provide.
     * - **`_Bound`:** Used to bind the two types together, ***DO NOT*** specify this parameter.<br/>
     * @param expected the expected value. its type gets automatically narrowed using the {@link Narrow} type
     * @param actual the actual value. its type gets automatically narrowed using the {@link Narrow} type
     * @example
     * type Foo = 1 | 2;
     * exactly<1, Foo>();  // error as `1 | 2` is not an exact match of `1`
     * exactly<1 | 2, Foo>();  // no error
     */
    <
        _Expected extends Equals<_Expected, _Actual> extends true ? _Actual : never,
        _Actual extends _Bound,
        _Bound = _Expected
    >(
        expected: Narrow<_Expected>,
        actual: Narrow<_Actual>,
    ): unknown
} = ((...values: [unknown, unknown] | []) => {
    if (values.length === 2) {
        const [expected, actual] = values
        if (typeof values === 'object') assert.deepStrictEqual(expected, actual)
        else assert.strictEqual(expected, actual)
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
