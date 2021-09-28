import { Entries } from '../utilityTypes/Any'
import { AnyKey } from 'tsdef'
import { IntersectOf } from 'ts-toolbelt/out/Union/IntersectOf'

/**
 * returns whether the given object has the given propertyName and narrows the type of the object to either:
 * - the specified generic (if provided)
 * - OR adds the specified key to the type, if a generic is not provided
 */
export const hasPropertyPredicate: {
    // this overload is only really needed because of https://github.com/microsoft/TypeScript/issues/46107
    <Key extends AnyKey>(object: unknown, propertyName: Key): object is string extends Key
        ? unknown
        : {
              // need an intersection of these types instead of a union, otherwise when Key is a union of two possible
              //  properties it would incorrectly narrow to a type that has both
              // @ts-expect-error TODO: figure out whats causing this, it seems to work just fine when suppressed
              [K in IntersectOf<Key>]: unknown
          }
    <Narrowed>(object: unknown, propertyName: keyof Narrowed): object is Narrowed
} = <T>(object: unknown, propertyName: keyof T): object is T =>
    Object.prototype.hasOwnProperty.call(object, propertyName)

/**
 * Object.entries but preserves the key types
 *
 * this is probably not 100% safe in some edge cases (see the issue linked below), but it's not worth the headaches that
 * treating all keys as `string[]` causes
 * @see https://github.com/Microsoft/TypeScript/issues/12870
 */
export const entries = <T>(object: T): Entries<T> => Object.entries(object) as never
