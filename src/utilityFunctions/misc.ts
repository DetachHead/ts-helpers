import { Stringable, TemplateLiteralStringable, ToString } from '../utilityTypes/String'
import { Equals, OnlyInfer, Entries } from '../utilityTypes/misc'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import assert from 'assert'
import { Throw } from 'throw-expression'
import { AnyKey } from 'tsdef'
import { IntersectOf } from 'ts-toolbelt/out/Union/IntersectOf'
import { NoInfer } from 'ts-toolbelt/out/Function/NoInfer'

/**
 * narrows the given value from type `Base` to type `Narrowed` without having to assign it to a new variable
 * due to limitions in generics and assertion functions, you have to provide the value twice.
 * first to declare the variable that gets narrowed, and second to cast it to the new type
 * @example
 * declare const foo: number
 * cast(foo, foo  as 1 | 2)
 * type Bar = typeof foo //1|2
 */
export const cast: <_ extends OnlyInfer, Base, Narrowed extends Base>(
    _value: Base,
    _castedValue: Narrowed,
) => asserts _value is Narrowed = (_value) => {
    // do nothing
}

/**
 * unsafely casts the given value to type `T` without having to assign it to a new variable.
 *
 * because of how assertion functions work, the type will narrow to `never` if the types don't overlap
 * @example
 * //safe example:
 * declare const foo: number
 * unsafeCast<1|2>(foo)
 * type Bar = typeof foo //1|2
 *
 * //unsafe example:
 * declare const foo: string
 * unsafeCast<1|2>(foo)
 * type Bar = typeof foo //never
 */
export const unsafeCast: <T>(_value: unknown) => asserts _value is T = (_value) => {
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
export const assertType: {
    <T>(_value: NoInfer<T>): void
    <_Expected, _Actual extends _Expected>(): void
} = (_value?: unknown) => undefined

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
     * This is implemented as a higher order function to allow partial inference on the Expected type.
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

/**
 * throws an error stating that the operation is not yet implemented. useful for shutting up the type checker
 * during development
 */
export const TODO = (reason = 'no reason provided'): never =>
    Throw(`operation not implemented (TODO): ${reason}`)

/**
 * returns whether the given object has the given propertyName and narrows the type of the object to either:
 * - the specified generic (if provided)
 * - OR adds the specified key to the type, if a generic is not provided
 */
export const hasPropertyPredicate: {
    /**
     * returns whether the given object has the given propertyName and narrows the type of the object to add the
     * specified key to the type
     */
    // this overload is only really needed because of https://github.com/microsoft/TypeScript/issues/46107
    <Key extends AnyKey>(object: unknown, propertyName: Key): object is string extends Key
        ? unknown
        : {
              // need an intersection of these types instead of a union, otherwise when Key is a union of two possible
              //  properties it would incorrectly narrow to a type that has both
              [K in IntersectOf<Key> &
                  // https://github.com/microsoft/TypeScript/issues/46176#issuecomment-933422434
                  Key]: unknown
          }
    /**
     * returns whether the given object has the given propertyName and narrows the type of the object to the specified generic
     */
    <Narrowed>(object: unknown, propertyName: keyof Narrowed): object is Narrowed
} = <T>(object: unknown, propertyName: keyof T): object is T =>
    typeof object !== 'undefined' &&
    object !== null &&
    Object.prototype.hasOwnProperty.call(object, propertyName)

/**
 * Object.entries but preserves the key types
 *
 * this is probably not 100% safe in some edge cases (see the issue linked below), but it's not worth the headaches that
 * treating all keys as `string[]` causes
 * @see https://github.com/Microsoft/TypeScript/issues/12870
 */
export const entries = <T extends object>(object: T): Entries<T> => Object.entries(object) as never

/**
 * runs the given `callback` until it returns `true` or `timeoutMs` is reached
 */
export const runUntil = async (
    callback: () => Promise<boolean>,
    timeoutMs: number,
): Promise<void> => {
    let timedOut = false as boolean
    const timer = setTimeout(() => {
        timedOut = true
    }, timeoutMs)
    while (!timedOut)
        if (await callback()) {
            clearTimeout(timer)
            return
        }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- typescript is narrowing the type because it doesn't know the timer changes it
    if (timedOut)
        throw new Error(
            `runUntil failed because the predicate didn't return true in ${timeoutMs} ms`,
        )
    throw new Error('this should never happen what the hack')
}

export const isNullOrUndefined = <T>(
    value: T,
):
    | (undefined extends T ? true : null extends T ? true : never)
    | (T extends null | undefined ? true : false) =>
    (value === null || value === undefined) as never
