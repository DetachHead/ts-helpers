import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'

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
 */
export type EvaluateType<T> = T extends infer R ? R : never

/** like ts-toolbelt's `Keys` except it doesn't include number (for objects where you know all of the keys) */
export type Keys<T> = Exclude<TsToolbeltKeys<T>, number>

/** compiletime version of {@link ObjectConstructor.entries} */
export type Entries<T> = EvaluateType<[Keys<T>, T[Keys<T>]][]>
