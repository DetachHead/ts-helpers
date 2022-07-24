import { Extends, Not } from './Boolean'
import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'

/**
 * "normalizes" types to be compared using {@link FunctionComparisonEquals}
 * - converts intersections of object types to normal object types
 *   (ie. converts `{foo: number} & {bar: number}` to `{foo: number, bar: number}`).
 *   see [this comment](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650)
 * - removes empty object types (`{}`) from intersections (which [actually means any non-nullish
 *   value](https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492)) - see
 *   [this comment](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-778623742)
 */
type FunctionComparisonEqualsWrapped<T> = T extends (
    T extends NonNullish ? NonNullable<infer R> : infer R
)
    ? {
          [P in keyof R]: R[P]
      }
    : never

/**
 * compares two types using the technique described [here](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-931205995)
 *
 * # benefits
 * - correctly handles `any`
 *
 * # drawbacks
 * - doesn't work properly with object types (see {@link FunctionComparisonEqualsWrapped}) and the fixes it applies don't work recursively
 */
type FunctionComparisonEquals<A, B> = (<T>() => T extends FunctionComparisonEqualsWrapped<A>
    ? 1
    : 2) extends <T>() => T extends FunctionComparisonEqualsWrapped<B> ? 1 : 2
    ? true
    : false

/**
 * makes `T` invariant for use in conditional types
 * @example
 * type Foo = InvariantComparisonEqualsWrapped<string> extends InvariantComparisonEqualsWrapped<string | number> ? true : false //false
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface -- who asked
interface InvariantComparisonEqualsWrapped<in out _T> {}

/**
 * compares two types by creating invariant wrapper types for the `Expected` and `Actual` types, such that `extends`
 * in conditional types only return `true` if the types are equivalent
 * # benefits
 * - far less hacky than {@link FunctionComparisonEqualsWrapped}
 * - works properly with object types
 *
 * # drawbacks
 * - doesn't work properly with `any` (if the type itself is `any` it's handled correctly by a workaround here but not
 * if the type contains `any`)
 */
type InvariantComparisonEquals<Expected, Actual> =
    InvariantComparisonEqualsWrapped<Expected> extends InvariantComparisonEqualsWrapped<Actual>
        ? IsAny<Expected | Actual> extends true
            ? IsAny<Expected> | IsAny<Actual> extends true
                ? true
                : false
            : true
        : false

/**
 * Checks if two types are equal at the type level.
 *
 * correctly checks `any` and `never`
 *
 * **WARNING:** there are several cases where this doesn't work properly, which is why i'm using two different methods to
 * compare the types. see [these issues](https://github.com/DetachHead/ts-helpers/labels/type%20testing)
 */
export type Equals<Expected, Actual> = InvariantComparisonEquals<Expected, Actual> extends true
    ? FunctionComparisonEquals<Expected, Actual>
    : false

/**
 * the compiler sees this as `undefined` if `noUncheckedIndexedAccess` is enabled, and `never` if it's not.
 * used by {@link NoUncheckedIndexedAccess}
 */
const indexedAccessCheck = ([] as never[])[0]

/**
 * `true` if `noUncheckedIndexedAccess` is set, else `false`. useful when creating types that need to behave differently
 * based on this compiler option
 */
export type NoUncheckedIndexedAccess = undefined extends typeof indexedAccessCheck ? true : false

/**
 * allows you to specify that a function parameter is optional but only if a generic type extends the specified
 * `Extends` type.
 *
 * requires you to define the parameter as a rest parameter (ie. `...value`), however the length of the rest type only
 * goes up to 1, so it behaves the same as a normal optional parameter (`value?`).
 * @example
 * function getValue<T = undefined>(value?: T): T {
 *     // Type 'T | undefined' is not assignable to type 'T'.
 *     //  'T' could be instantiated with an arbitrary type which could be unrelated to 'T | undefined'.(2322)
 *     return value
 * }
 *
 * //this is annoying, because you obviously want the function to be called like this:
 * getValue()
 * getValue<number>(2)
 * getValue<undefined>()
 *
 * //but don't want it to be called like this:
 * getValue<number>() //invalid, but no compile error (that's why you get the compile error when returtning the value)
 *
 * //so with this type, you can rewrite the function like so:
 * function getValue<T = undefined>(...value: OptionalParameterFromGeneric<T, undefined>): T {
 *     // you can now (probably) safely cast the value to suppress the compile error
 *     return value[0] as T
 * }
 *
 * //now you get a compile error when calling the function like this:
 * getValue<number>()
 */
export type OptionalParameterFromGeneric<Type, Extends> = Type extends Extends
    ? [] | [Type]
    : [Type]

/**
 * a type to be used as a bound on a generic to document that its generics must be inferred and not explicitly
 * specified. basically the opposite of [`NoInfer`](https://millsp.github.io/ts-toolbelt/modules/function_noinfer.html)
 *
 * this works by specifying an unused generic parameter along with the other generic(s) in your function, making it
 * difficult for the caller to specify the generics
 *
 * **WARNING:** this does **not** make it impossible to specify said generics. the caller can still bypass this by
 * simply passing `never` or `any`, or even the `OnlyInfer` type itself. treat this as a documentation tool for how your
 * function is supposed to be used.
 * @example
 * const foo = <T, _ extends OnlyInfer>(value: T) => {}
 * foo(1) //no error
 * foo<number>(1) // error
 */
export type OnlyInfer =
    '__do not specify any of the generics here, as they have been marked as `OnlyInfer`' & {
        _: never
    }

/**
 * creates an "error type" stating that the operation is not yet implemented. useful for shutting up the type checker
 * during development
 */
export type TODO<Reason extends string = 'no reason provided'> = {
    '_type not implemented (TODO)': never
    _reason: Reason
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- checking for any type
export type IsAny<T> = FunctionComparisonEquals<T, any>

/**
 * prevents `any` from being passed as a parameter. useful when using a badly typed lib with `any`'s all over the place
 * @example
 * declare const foo: <T extends number>(value: NoAny<T>) => void
 * foo(1) //no error
 * foo(1 as any) //error
 */
export type NoAny<T> = IsAny<T> extends true ? never : T

/**
 * any value that's not `null` or `undefined`
 *
 * useful when banning the `{}` type with `@typescript-eslint/ban-types`
 *
 * @see https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
 */
// eslint-disable-next-line @typescript-eslint/ban-types -- duh
export type NonNullish = {}

/**
 * like ts-toolbelt's `Keys` except it doesn't include number (for objects where you know all of the keys)
 *
 * in some cases, `ts-toolbelt`'s `KnownKeys` will probably work for you, but it doesn't seem to work properly for arrays
 */
export type Keys<T> = Exclude<TsToolbeltKeys<T>, number>

/** compiletime version of {@link ObjectConstructor.entries} */
export type Entries<T> = [Keys<T>, T[Keys<T>]][]

/**
 * checks whether `Key` is an "exact" optional property of `T`. (ie. the property is defined with a `?` prefix).
 * required the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
 * compiler option to be enabled.
 *
 * @example
 * type Foo = {a?: number, b: number | undefined, c: number}
 * declare const foo: IsExactOptionalProperty<Foo, 'a'> // true
 * declare const bar: IsExactOptionalProperty<Foo, 'b'> // false
 * declare const baz: IsExactOptionalProperty<Foo, 'a'> // false
 */
export type IsExactOptionalProperty<T, Key extends keyof T> = undefined extends T[Key]
    ? Not<Extends<{ [K in Key]: T[Key] }, { [k in Key]-?: T[Key] }>>
    : false

/**
 * useful when using dynamic imports that have a default export
 * @example
 * const foo: HasDefaultExport = await import('./foo')
 * console.log(foo.default)
 */
export interface HasDefaultExport<T = unknown> {
    default: T
}
