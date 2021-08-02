import _ from 'lodash'
import {
    CharAt,
    EndsWith,
    Includes,
    IndexOf,
    PadStart,
    Replace,
    ReplaceOne,
    StartsWith,
    Substring,
    Truncate,
} from '../utilityTypes/String'
import { List } from 'ts-toolbelt/out/List/List'
import { Literal } from 'ts-toolbelt/out/String/_Internal'
import { Join } from 'ts-toolbelt/out/String/Join'
import { Split } from 'ts-toolbelt/out/String/Split'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import { Throw } from 'throw-expression'
import { OptionalParameterFromGeneric } from '../utilityTypes/misc'

/**
 * replaces the first occurrence of `find` with `replace`
 */
export const replaceOne = <
    String extends string,
    Find extends string,
    ReplaceWithString extends string
>(
    str: String,
    find: Find,
    replace: ReplaceWithString,
): ReplaceOne<String, Find, ReplaceWithString> => str.replace(find, replace) as never

/**
 * replaces all occurrences of `find` in the given string with `replace`
 */
export const replaceAll = <
    String extends string,
    Find extends string,
    ReplaceWithString extends string
>(
    str: String,
    find: Find,
    replace: ReplaceWithString,
): Replace<String, Find, ReplaceWithString> =>
    str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace) as never

/**
 * better version of {@link String.prototype.match} that doesn't allow for empty match arrays
 *
 * useful when using the `noUncheckedIndexedAccess` compiler option
 * @see https://github.com/microsoft/TypeScript/issues/42296
 */
export const match = (str: string, regex: RegExp): (RegExpMatchArray & [string]) | null =>
    str.match(regex) as (RegExpMatchArray & [string]) | null

/**
 * gets the character at the given `index` at compiletime
 */
export const charAt = <T extends string, I extends number>(string: T, index: I): CharAt<T, I> =>
    string.charAt(index) as CharAt<T, I>

/**
 * does {@link String.substring} but at compiletime
 */
export const substring = <
    String extends string,
    StartIndex extends number,
    EndIndex extends number
>(
    string: String,
    start: StartIndex,
    end: EndIndex,
): Substring<String, StartIndex, EndIndex> =>
    string.substring(start, end) as Substring<String, StartIndex, EndIndex>

/**
 * concatenates strings while keeping their values known at compiletime
 * @example
 * const foo = concatenate('foo', 'bar', 'baz') //'foobarbaz'
 */
export const concatenate = <T extends string[]>(...strings: T): Join<T, ''> =>
    // Narrow often causes false positives when the function is called, and we don't need it to narrow the type here
    // because of rest parameters. instead, cast it when calling join which does rely on Narrow to work
    join(strings as Narrow<T>, '')

/**
 * joins a string by the given `delimiter` at compiletime
 */
export const join = <T extends List<Literal>, D extends string>(
    items: Narrow<T>,
    delimiter: D,
): Join<T, D> => items.join(delimiter) as Join<T, D>

/**
 * splits a string by the given `delimiter` at compiletime
 */
export const split = <T extends string, D extends string>(string: T, delimiter: D): Split<T, D> =>
    string.split(delimiter) as Split<T, D>

/**
 * does {@link String.indexOf} but at compiletime
 */
export const indexOf = <String extends string, Substring extends string>(
    string: String,
    substring: Substring,
): IndexOf<String, Substring> => string.indexOf(substring) as IndexOf<String, Substring>

/**
 * does {@link String.includes} but at compiletime
 */
export const includes = <String extends string, Substring extends string>(
    string: String,
    substring: Substring,
): Includes<String, Substring> => string.includes(substring) as Includes<String, Substring>

/**
 * does {@link String.padStart} at compiletime
 */
export const padStart = <
    String extends string,
    Size extends number,
    PadString extends string = ' '
>(
    string: String,
    length: Size,
    padString?: PadString,
): PadStart<String, Size, PadString> => string.padStart(length, padString) as never

/**
 * {@link String.startsWith} at compile-time
 */
export const startsWith = <Full extends string, CheckStart extends string>(
    full: Full,
    checkStart: CheckStart,
): StartsWith<Full, CheckStart> => full.startsWith(checkStart) as never

/**
 * {@link String.endsWith} at compile-time
 */
export const endsWith = <Full extends string, CheckEnd extends string>(
    full: Full,
    checkEnd: CheckEnd,
): EndsWith<Full, CheckEnd> => full.endsWith(checkEnd) as never

export const truncate = <
    Str extends string,
    MaxLength extends number,
    Ellipsis extends string = '…'
>(
    string: Str,
    maxLength: MaxLength,
    ...optionalEllipsis: OptionalParameterFromGeneric<Ellipsis, '…'>
): Truncate<Str, MaxLength, Ellipsis> => {
    const ellipsis = optionalEllipsis[0] ?? '…'
    return (ellipsis.length > maxLength
        ? Throw(
              `can't truncate string: "${string}" with "${ellipsis}" because it's longer than the max length: ${maxLength}`,
          )
        : string.length < maxLength
        ? string
        : `${string.substring(0, maxLength - ellipsis.length)}${ellipsis}`) as never
}
