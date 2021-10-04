import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'
import { Decrement } from './Number'

/**
 * makes typescript evaluate the result of a type when you hover over it
 * @example
 * //without EvaluateType:
 * type Entries<T> = [Keys<T>, T[Keys<T>]][]
 * declare const foo: Entries<{ foo: number, bar: string }> //hovering over foo will show `[Keys<T>, T[Keys<T>]][]`
 *
 * //with EvaluateType:
 * type Entries<T> = EvaluateType<[Keys<T>, T[Keys<T>]][]>
 * declare const foo: Entries<{ foo: number, bar: string }> //hovering over foo will show `[("foo" | "bar"), (string | number)][]`
 * @see https://stackoverflow.com/a/57683652
 */
// TODO: figure out why this doesnt work on everything, eg. TupleOfUpTo<number, 3>
export type EvaluateType<T, Depth extends number = 1> = T extends object
    ? Depth extends 0
        ? T
        : T extends infer O
        ? { [K in keyof O]: EvaluateType<O[K], Decrement<Depth>> }
        : never
    : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never

/** like ts-toolbelt's `Keys` except it doesn't include number (for objects where you know all of the keys) */
export type Keys<T> = Exclude<TsToolbeltKeys<T>, number>

/** compiletime version of {@link ObjectConstructor.entries} */
export type Entries<T> = EvaluateType<[Keys<T>, T[Keys<T>]][]>
