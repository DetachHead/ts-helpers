import { Keys as TsToolbeltKeys } from 'ts-toolbelt/out/Any/Keys'

/** like ts-toolbelt's `Keys` except it doesn't include number (for objects where you know all of the keys) */
export type Keys<T> = Exclude<TsToolbeltKeys<T>, number>
