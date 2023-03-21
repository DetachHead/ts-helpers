import { FindResult } from '../types/_internal'
import { MaybePromise } from 'tsdef'

/** finds the first item in the `iterable` where the `predicate` returns `true` */
export const find = <T>(iterable: Iterable<T>, predicate: (value: T) => boolean): FindResult<T> => {
    let hasUndefined = false
    let index = 0
    for (const value of iterable) {
        if (!hasUndefined && typeof value === 'undefined') {
            hasUndefined = true
        }
        if (predicate(value)) return { result: value, index }
        index++
    }
    return undefined
}

/**
 * finds the first item in the `iterable` where the `predicate` returns `true`.
 * runs one at a time
 */
export const findAsync = async <T>(
    iterable: AsyncIterable<T> | Iterable<Promise<T>>,
    predicate: (value: T) => MaybePromise<boolean>,
): Promise<T | undefined> => {
    let hasUndefined = false
    for await (const value of iterable) {
        if (!hasUndefined && typeof value === 'undefined') {
            hasUndefined = true
        }
        if (await predicate(value)) return value
    }
    return undefined
}
