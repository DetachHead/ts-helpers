import _ from 'lodash'
import {
    CharAt,
    CountInString,
    EndsWith,
    Includes,
    IndexOf,
    LeftOf,
    MakeEndsWith,
    MakeStartsWith,
    MidOf,
    PadStart,
    Replace,
    ReplaceOne,
    RightOf,
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
    str.replace(new RegExp(_.escapeRegExp(find), 'gu'), replace) as never

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

const defaultEllipsis = '…'

/**
 * truncates a string to the specified `maxLength`, concatenating an `ellipsis` if the string is too long.
 * values are preserved at compiletime where possible
 * @example
 * const foo = truncate('foobarbaz', 4) // 'foo…'
 * const bar = truncate('foobarbaz', 4, '--') // 'fo--'
 */
export const truncate: {
    <
        Str extends string,
        MaxLength extends number,
        Ellipsis extends string = typeof defaultEllipsis
    >(
        string: Str,
        maxLength: MaxLength,
        ellipsis: Ellipsis,
    ): Truncate<Str, MaxLength, Ellipsis>
    <Str extends string, MaxLength extends number>(string: Str, maxLength: MaxLength): Truncate<
        Str,
        MaxLength
    >
} = <Str extends string, MaxLength extends number, Ellipsis extends string>(
    string: Str,
    maxLength: MaxLength,
    optionalEllipsis?: Ellipsis,
): typeof defaultEllipsis extends Ellipsis
    ? Truncate<Str, MaxLength>
    : Truncate<Str, MaxLength, Ellipsis> => {
    const ellipsis = optionalEllipsis ?? defaultEllipsis
    return (ellipsis.length > maxLength
        ? Throw(
              `can't truncate string: "${string}" with "${ellipsis}" because it's longer than the max length: ${maxLength}`,
          )
        : string.length < maxLength
        ? string
        : `${string.substring(0, maxLength - ellipsis.length)}${ellipsis}`) as never
}

/**
 * if the given `str` doesn't already start with the given `prefix`, then append the prefix to the start of the string.
 *
 * if the `str` already starts with the `prefix`, then returns the string as is
 * @example
 * makeStartsWith('foo', '.') // '.foo'
 * makeStartsWith('.foo', '.') // '.foo'
 */
export const makeStartsWith = <Str extends string, Prefix extends string>(
    str: Str,
    prefix: Prefix,
): MakeStartsWith<Str, Prefix> => (startsWith(str, prefix) ? str : `${prefix}${str}`) as never

/**
 * if the given `str` doesn't already end with the given `suffix`, then append the suffix to the end of the string.
 *
 * if the `str` already ends with the `suffix`, then returns the string as is
 * @example
 * makeEndsWith('foo', '.') // 'foo.'
 * makeEndsWith('foo.', '.') // 'foo.'
 */
export const makeEndsWith = <Str extends string, Suffix extends string>(
    str: Str,
    suffix: Suffix,
): MakeEndsWith<Str, Suffix> => (endsWith(str, suffix) ? str : `${str}${suffix}`) as never

/**
 * gets the string to the left of the given `substring`
 * @example
 * leftOf('foo.bar', '.') //'foo'
 */
export const leftOf = <Str extends string, Substring extends string>(
    str: Str,
    substring: Substring,
): LeftOf<Str, Substring> => (str.split(substring)[0] ?? -1) as never

/**
 * gets the string to the right of the given `substring`
 * @example
 * rightOf('foo.bar', '.') //'bar'
 */
export const rightOf = <Str extends string, Substring extends string>(
    str: Str,
    substring: Substring,
): RightOf<Str, Substring> => str.slice(str.indexOf(substring) + substring.length) as never

/**
 * gets the string between the given `start` and `end` strings
 * @example
 * midOf('foo(bar)baz', '(', ')') //'bar'
 */
export const midOf = <Str extends string, Start extends string, End extends string>(
    str: Str,
    start: Start,
    end: End,
): MidOf<Str, Start, End> => rightOf(leftOf(str, end), start)

/**
 * counts how many instances of the given `substring` are in `str`
 * @example
 * countInString('1,2,3,4', ',') //3
 */
export const countInString = <Str extends string, Substring extends string>(
    str: Str,
    substring: Substring,
): CountInString<Str, Substring> => (str.split(substring).length - 1) as never

/** wrapper for {@link String.toLowerCase} that returns a {@link Lowercase} of the given `value` */
export const toLowerCase = <T extends string>(value: T): Lowercase<T> =>
    value.toLowerCase() as never

/** wrapper for {@link String.toUpperCase} that returns a {@link Uppercase} of the given `value` */
export const toUpperCase = <T extends string>(value: T): Uppercase<T> =>
    value.toUpperCase() as never

/** converts the first character of a string to uppercase */
export const capitalize = <T extends string>(value: T): Capitalize<T> =>
    _.capitalize(value) as never

/** converts the first character of a string to lowercase */
export const uncapitalize = <T extends string>(value: T): Uncapitalize<T> =>
    `${value.charAt(0).toLowerCase()}${value.slice(1)}` as never
