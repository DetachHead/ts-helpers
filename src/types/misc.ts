import { Extends, Not } from './Boolean'
import { ExactOptionalPropertyTypes } from './compilerOptions'
import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'
import { OptionalKeys as OptionalKeysList } from 'ts-toolbelt/out/List/OptionalKeys'
import { RequiredKeys as RequiredKeysList } from 'ts-toolbelt/out/List/RequiredKeys'
import { OptionalKeys as OptionalKeysObject } from 'ts-toolbelt/out/Object/OptionalKeys'
import { RequiredKeys as RequiredKeysObject } from 'ts-toolbelt/out/Object/RequiredKeys'
import { ListOf } from 'ts-toolbelt/out/Union/ListOf'
import { Replace } from 'ts-toolbelt/out/Union/Replace'
import { Primitive } from 'utility-types'

/**
 * "normalizes" types to be compared using {@link FunctionComparisonEquals}
 * - converts intersections of object types to normal object types
 *   (ie. converts `{foo: number} & {bar: number}` to `{foo: number, bar: number}`).
 *   see [this comment](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650)
 * - removes empty object types (`{}`) from intersections (which [actually means any non-nullish
 *   value](https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492)) - see
 *   [this comment](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-778623742)
 */
type FunctionComparisonEqualsWrapped<T> = T extends ( // eslint-disable-next-line @typescript-eslint/no-unused-vars -- https://github.com/typescript-eslint/typescript-eslint/issues/6253
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
 * getValue<number>() //invalid, but no compile error (that's why you get the compile error when returning the value)
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
export type TODO<in out Reason extends string = 'no reason provided'> = {
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
 * requires the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
 * compiler option to be enabled. will return `never` if it's not
 *
 * @example
 * type Foo = {a?: number, b: number | undefined, c: number}
 * declare const foo: IsExactOptionalProperty<Foo, 'a'> // true
 * declare const bar: IsExactOptionalProperty<Foo, 'b'> // false
 * declare const baz: IsExactOptionalProperty<Foo, 'a'> // false
 */
export type IsExactOptionalProperty<
    T,
    Key extends keyof T,
> = ExactOptionalPropertyTypes extends false
    ? never
    : undefined extends T[Key]
    ? Not<Extends<{ [K in Key]: T[Key] }, { [k in Key]-?: T[Key] }>>
    : false

/**
 * makes all properties in the object `T` required. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = RequiredProperties<{ a?: string | undefined }, true> // { a: string | undefined }
 * type Bar = RequiredProperties<{ a?: string | undefined }, false> // { a: string }
 */
export type RequiredProperties<
    T extends object,
    ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = RequiredBy<T, keyof T, ExactOptionalProperties>

/**
 * recursively makes all properties in the object `T` required. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = RequiredRecursive<{ a: { a?: string | undefined } }, true> // { a: { a: string | undefined } }
 * type Bar = RequiredRecursive<{ a: { a?: string | undefined } }, fa;se> // { a: { a: string } }
 */
export type RequiredRecursive<
    out T extends object,
    out ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = {
    [K in keyof T]-?: ListOf<
        // first check if undefined is in the union:
        ExactOptionalProperties extends false
            ? [undefined] extends [T[K]]
                ? Replace<T[K], undefined, never>
                : T[K]
            : T[K]
    > extends infer Union
        ? // now iterate over the union and recursively call this type on any object types within the union:
          {
              [UnionIndex in keyof Union]: Union[UnionIndex] extends object
                  ? RequiredRecursive<Union[UnionIndex], ExactOptionalProperties>
                  : Union[UnionIndex]
          }[Keys<Union>]
        : never
}

/**
 * makes `Keys` in the object `T` required. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = RequiredBy<{ a?: string | undefined, b?: string | undefined }, true> // { a: string | undefined, b?: string | undefined }
 * type Bar = RequiredBy<{ a?: string | undefined, b?: string | undefined }, true> // { a: string, b?: string | undefined }
 */
export type RequiredBy<
    T extends object,
    Keys extends keyof T,
    ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = { [K in Keys]-?: ExactOptionalProperties extends true ? T[K] : Exclude<T[K], undefined> } & T

/**
 * makes all properties in the object `T` optional. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = OptionalProperties<{ a?: string | undefined }, true> // { a: string | undefined }
 * type Bar = OptionalProperties<{ a?: string | undefined }, false> // { a: string }
 */
export type OptionalProperties<
    T extends object,
    ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = OptionalBy<T, keyof T, ExactOptionalProperties>

/**
 * recursively makes all properties in the object `T` optional. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = OptionalRecursive<{ a: { a: string } }, true> // { a: { a?: string } }
 * type Bar = OptionalRecursive<{ a: { a: string } }, false> // { a: { a: string | undefined } }
 */
export type OptionalRecursive<
    out T extends object,
    out ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = {
    [K in keyof T]?: ListOf<
        T[K] | (ExactOptionalProperties extends false ? undefined : never)
    > extends infer Union
        ? // now iterate over the union and recursively call this type on any object types within the union:
          {
              [UnionIndex in keyof Union]: Union[UnionIndex] extends object
                  ? OptionalRecursive<Union[UnionIndex], ExactOptionalProperties>
                  : Union[UnionIndex]
          }[Keys<Union>]
        : never
}

/**
 * makes `Keys` in the object `T` optional. if `ExactOptionalProperties` is `true`,
 * keys that are optional but also have `undefined` in their type will keep `undefined` in their type.
 *
 * @example
 * type Foo = OptionalBy<{ a?: string | undefined, b?: string | undefined }, true> // { a: string | undefined, b?: string | undefined }
 * type Bar = OptionalBy<{ a?: string | undefined, b?: string | undefined }, true> // { a: string, b?: string | undefined }
 */
export type OptionalBy<
    T extends object,
    Keys extends keyof T,
    ExactOptionalProperties extends boolean = ExactOptionalPropertyTypes,
> = { [K in Keys]?: ExactOptionalProperties extends true ? T[K] : T[K] | undefined } & Omit<T, Keys>

/**
 * useful when using dynamic imports that have a default export
 * @example
 * const foo: HasDefaultExport = await import('./foo')
 * console.log(foo.default)
 */
export interface HasDefaultExport<in out T = unknown> {
    default: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- InstanceType from the stdlib uses any so i have to use it here to avoid incorrect behavior when using it
export type AbstractConstructor = abstract new (...args: any[]) => unknown

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment on AbstractConstructor
export type Constructor = new (...args: any[]) => unknown

/**
 * an instance of a class with a typed `constructor` property, used by the {@link New} function
 * @see https://github.com/microsoft/TypeScript/issues/3841
 */
export type HasTypedConstructor<T extends AbstractConstructor = AbstractConstructor> =
    InstanceType<T> & {
        constructor: T
    }

/**
 * reduces a type to `never` if it's an intersection between a primitive type and a non-primitive type
 * (which means they do not overlap)
 *
 * **WARNING:** this will break any "branded" types as they rely on non-overlapping intersections
 *
 * @see https://stackoverflow.com/a/65908955
 */
export type CheckNever<T> = T extends Primitive ? (T extends object ? never : T) : T

/**
 * intersects two types, correctly merging key types & index signatures
 *
 * **WARNING:** this will break any "branded" types as they rely on non-overlapping intersections
 *
 * @see https://github.com/microsoft/TypeScript/issues/52931
 */
export type Intersection<Left, Right> = Left extends infer DistributedLeft
    ? Right extends infer DistributedRight
        ? {
              [K in keyof (DistributedLeft | DistributedRight)]: Intersection<
                  DistributedLeft[K],
                  DistributedRight[K]
              >
          } & CheckNever<DistributedLeft & DistributedRight>
        : never
    : never

/**
 * recursively replaces value types in `T` that extend `Find` with `Replace`
 *
 * @example
 * type Foo = ReplaceValuesRecursive<
 *     { a: number; b: { a: number; b: boolean } },
 *     boolean,
 *     string
 * > // { a: number; b: { a: number; b: string } }
 */
export type ReplaceValuesRecursive<in out T, in out Find, out ReplaceWith> = {
    [K in keyof T]: ListOf<
        // first check if the Find type is in the union:
        [Find] extends [T[K]] ? Replace<T[K], Find, ReplaceWith> : T[K]
    > extends infer Union
        ? // now iterate over the union and recursively call this type on any object types within the union:
          {
              [UnionIndex in keyof Union]: Union[UnionIndex] extends object
                  ? ReplaceValuesRecursive<Union[UnionIndex], Find, ReplaceWith>
                  : Union[UnionIndex]
          }[Keys<Union>]
        : never
}

/**
 * gets the keys of `T` that are optional. works on both objects and arrays
 */
export type OptionalKeys<T extends object> = T extends readonly unknown[]
    ? OptionalKeysList<T>
    : OptionalKeysObject<T>

/**
 * gets the keys of `T` that are required. works on both objects and arrays
 */
export type RequiredKeys<T extends object> = T extends readonly unknown[]
    ? RequiredKeysList<T>
    : RequiredKeysObject<T>
