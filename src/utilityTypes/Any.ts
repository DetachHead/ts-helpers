import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'
import { Cast } from 'ts-toolbelt/out/Any/Cast'

/**
 * like ts-toolbelt's `Keys` except it doesn't include number (for objects where you know all of the keys)
 *
 * in some cases, `ts-toolbelt`'s `KnownKeys` will probably work for you, but it doesn't seem to work properly for arrays
 */
export type Keys<T> = Exclude<TsToolbeltKeys<T>, number>

/** compiletime version of {@link ObjectConstructor.entries} */
export type Entries<T> = [Keys<T>, T[Keys<T>]][]

/**
 * Replace in `T` those types that are assignable to `Find` with the types that are assignable to `ReplaceWith`
 */
export type Replace<T, Find, ReplaceWith> =
    | (Find extends T ? ReplaceWith : never)
    | Exclude<T, Find>

/**
 * recursively replaces all instances of the `Find` type with the `ReplaceWith` type. any instance of it anywhere in the type will be replaced:
 *
 * - object/array values
 * - union values
 * - function/constructor parameters
 * - function/constructor return type
 * - function `this` types
 *
 * **WARNING: does not work on intersections/overloads!** any types that create an intersection (`&`) result in loss of type information.
 * for example:
 * ```ts
 * type Foo = number & string //never
 * ```
 * what was this `never` type made up of? the compiler can't tell. so `ReplaceRecursive<string & number, string, boolean>` will do nothing.
 *
 * that means overloads too. `{ (arg: string): string; (): void }` is actually `((arg: string) => string) & (() => void)`
 */
export type ReplaceRecursive<T, Find, ReplaceWith> = T extends Find
    ? ReplaceWith
    : T extends object
    ? Cast<
          // if it's an object of any kind, recursively replace all its values (if it's an array it gets narrowed back later)
          {
              [K in keyof T]: ReplaceRecursive<T[K], Find, ReplaceWith>
          } &
              // if it's a function
              (T extends (this: infer This, ...args: infer Args) => infer Result
                  ? (
                        this: ReplaceRecursive<This, Find, ReplaceWith>,
                        ...args: Cast<ReplaceRecursive<Args, Find, ReplaceWith>, unknown[]>
                    ) => ReplaceRecursive<Result, Find, ReplaceWith>
                  : // if it's a constructor (which it can't be if it has a this type)
                  T extends new (...args: infer Args) => infer Result
                  ? new (
                        ...args: Cast<ReplaceRecursive<Args, Find, ReplaceWith>, unknown[]>
                    ) => ReplaceRecursive<Result, Find, ReplaceWith>
                  : unknown),
          // if it's an array, narrow it back to either an Array or a ReadonlyArray using Cast
          T extends readonly unknown[]
              ? readonly unknown[]
              : T extends unknown[]
              ? unknown[]
              : unknown
      >
    : // if it's a primitive, use a simple union replace
      Replace<T, Find, ReplaceWith>
