/**
 * returns whether the given object has the given propertyName and narrows the type of the object to the specified generic
 */
import { Entries } from '../utilityTypes/Any'

export const hasPropertyPredicate = <T>(object: unknown, propertyName: keyof T): object is T =>
    Object.prototype.hasOwnProperty.call(object, propertyName)

/**
 * Object.entries but preserves the key types
 *
 * this is probably not 100% safe in some edge cases (see the issue linked below), but it's not worth the headaches that
 * treating all keys as `string[]` causes
 * @see https://github.com/Microsoft/TypeScript/issues/12870
 */
export const entries = <T>(object: T): Entries<T> => Object.entries(object) as never
