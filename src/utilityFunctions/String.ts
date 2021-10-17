import _ from 'lodash'
import {
    CountInString,
    LeftOf,
    MakeEndsWith,
    MakeStartsWith,
    MidOf,
    RightOf,
    Truncate,
} from '../utilityTypes/String'
import { Join } from 'ts-toolbelt/out/String/Join'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import { Throw } from 'throw-expression'
import { Literal } from 'ts-toolbelt/out/String/_Internal'
import { List } from 'ts-toolbelt/out/List/List'

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
): MakeStartsWith<Str, Prefix> => (str.startsWith(prefix) ? str : `${prefix}${str}`) as never

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
): MakeEndsWith<Str, Suffix> => (str.endsWith(suffix) ? str : `${str}${suffix}`) as never

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

/** converts the first character of a string to uppercase */
export const capitalize = <T extends string>(value: T): Capitalize<T> =>
    _.capitalize(value) as never

/** converts the first character of a string to lowercase */
export const uncapitalize = <T extends string>(value: T): Uncapitalize<T> =>
    `${value.charAt(0).toLowerCase()}${value.slice(1)}` as never
