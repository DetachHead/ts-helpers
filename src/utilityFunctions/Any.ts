import { Entries } from '../utilityTypes/Any'
import { AnyKey } from 'tsdef'
import { IntersectOf } from 'ts-toolbelt/out/Union/IntersectOf'

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
export const entries = <T>(object: T): Entries<T> => Object.entries(object) as never

/**
 * runs the given `callback` until `predicate` returns `true` or `timeoutMs` is reached
 */
export const runUntil = async <T>(
    callback: () => Promise<T>,
    predicate: (result: T) => boolean,
    timeoutMs: number,
): Promise<void> => {
    let timedOut = false as boolean
    const timer = setTimeout(() => {
        timedOut = true
    }, timeoutMs)
    while (!timedOut)
        if (predicate(await callback())) {
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
