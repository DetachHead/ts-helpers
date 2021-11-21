import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'
import { AnyFunction } from 'tsdef'

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
export type Replace<T, Find, ReplaceWith> = Exclude<T, Find> | ReplaceWith

export type ReplaceRecursive<T, Find, ReplaceWith> = T extends object
    ? {
          [K in keyof T]: ReplaceRecursive<T[K], Find, ReplaceWith>
      } &
          T extends AnyFunction
        ? (
              ...args: ReplaceRecursive<Parameters<T & AnyFunction>, Find, ReplaceWith> & unknown[]
          ) => ReplaceRecursive<ReturnType<T & AnyFunction>, Find, ReplaceWith>
        : unknown & T extends readonly unknown[]
        ? readonly unknown[]
        : T extends unknown[]
        ? unknown[]
        : unknown
    : Replace<T, Find, ReplaceWith>
