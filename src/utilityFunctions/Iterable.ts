import { MaybePromise } from 'tsdef'

const findErrorHandler = (error: boolean, hasUndefined: boolean): void => {
    const errorMessage = 'predicate did not return true for any values in the iterator.'
    if (error) {
        throw new Error(errorMessage)
    }
    if (hasUndefined) {
        throw new Error(
            `${errorMessage} cannot return undefined because it's ambiguous as an undefined value was also returned from the iterator`,
        )
    }
}

/** finds the first item in the `iterable` where the `predicate` returns `true` */
export const find = <T>(
    iterable: Iterable<T>,
    predicate: (value: T) => boolean,
    error = true,
): T | undefined => {
    let hasUndefined = false
    for (const value of iterable) {
        if (!hasUndefined && typeof value === 'undefined') {
            hasUndefined = true
        }
        if (predicate(value)) return value
    }
    findErrorHandler(error, hasUndefined)
    return undefined
}

/**
 * finds the first item in the `iterable` where the `predicate` returns `true`.
 * runs one at a time
 */
export const findAsync = async <T>(
    iterable: AsyncIterable<T> | Iterable<Promise<T>>,
    predicate: (value: T) => MaybePromise<boolean>,
    error = true,
): Promise<T | undefined> => {
    let hasUndefined = false
    for await (const value of iterable) {
        if (!hasUndefined && typeof value === 'undefined') {
            hasUndefined = true
        }
        if (await predicate(value)) return value
    }
    findErrorHandler(error, hasUndefined)
    return undefined
}
