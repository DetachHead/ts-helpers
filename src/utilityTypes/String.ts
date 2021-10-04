import { Primitive } from 'utility-types'
import { Add, Decrement, Increment, IsGreaterThan, IsLessOrEqual, Subtract } from './Number'
import { Length } from 'ts-toolbelt/out/String/Length'
import { AnyKey, IsNever } from 'tsdef'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { IndexOfLongestString, TupleOf } from './Array'
import { Keys } from './Any'
import { ListOf } from 'ts-toolbelt/out/Union/ListOf'
import { Head as ArrayHead } from 'ts-toolbelt/out/List/Head'
import { Tail as ArrayTail } from 'ts-toolbelt/out/List/Tail'
import { Literal } from 'ts-toolbelt/out/String/_Internal'

/**
 * a type that can be converted to a string in a template literal type
 */
export type TemplateLiteralStringable = Exclude<Primitive, symbol>

/**
 * creates a stringified version of `T`
 * @example
 * type Foo = ToString<1|2> //'1'|'2'
 */
export type ToString<T extends TemplateLiteralStringable> = `${T}`

/**
 * a URI that starts with the given `Protocol`
 * @example
 * const foo: UriString<'http'> = 'foo' //error
 * const bar: UriString<'http'> = 'http://foo.com' //no error
 */
export type UriString<Protocol extends string = string> = `${Protocol}://${Domain | IP}${string}`

/**
 * a URL with either the http or https protocol.
 * @example
 * const foo: UrlString = 'foo://bar' //error
 * const bar: UrlString = 'http://foo' //no error
 */
export type UrlString = UriString<'http' | 'https'>

/** a domain name */
export type Domain = `${string}.${string}`

export type IPv4 = Join<TupleOf<bigint, 4>, '.'> // use bigint instead of number to prevent additional dots

export type IPv6 = Join<TupleOf<string, 8>, ':'>

/** an IP address */
export type IP = IPv4 | IPv6

/** an email address */
export type Email = `${string}@${Domain}`

/**
 * the name of a file with an `Extension`.
 * if `Extension` is not provided an empty string then it's treated as a file with no extension
 *
 * @example
 * type File: FileName //string, anything goes
 * type Image: FileName<'png'|'jpg'> // `${string}.png` | `${string}.jpg`
 */
export type FileName<Extension extends string = never> = `${string}${IsNever<
    Extension,
    '',
    `.${Extension}`
>}`

type DuplicateStringTailRec<T extends string, N extends number, Result extends string> = N extends 0
    ? Result
    : DuplicateStringTailRec<T, Decrement<N>, `${Result}${T}`>

/**
 * duplicates a string a given number of times
 * @example
 * type Foo = DuplicateString<'foo', 3> //'foofoofoo'
 */
export type DuplicateString<T extends string, N extends number> = DuplicateStringTailRec<T, N, ''>

/**
 * anything that can be represented as a string (ie. has a {@link toString} method)
 */
export interface Stringable {
    toString: () => string
}

/**
 * gets the first character in a string
 */
export type Head<String extends string> = String extends `${infer R}${string}` ? R : never

/**
 * removes the first character off the start of a string
 */
export type Tail<String extends string> = TrimStart<String, 1>

type _TrimStart<
    String extends string,
    Index extends number,
    Iterator extends number
> = Iterator extends Index
    ? String
    : _TrimStart<
          String extends `${Head<String>}${infer R}` ? R : never,
          Index,
          // @ts-expect-error see documentation for Increment type
          Increment<Iterator>
      >

/**
 * trims the characters up to `Index` off the start of `String` (inclusive)
 * @example
 * type Foo = TrimStart<'foobar', 2> //'bar'
 */
export type TrimStart<String extends string, Index extends number> = _TrimStart<String, Index, 0>

/**
 * trims the characters past `Index` off the end of `String` (exclusive)
 * @example
 * type Foo = TrimEnd<'foobar', 2> //'foo'
 */
export type TrimEnd<String extends string, Index extends number> = Substring<String, 0, Index>

/**
 * gets the characters of `String` between `StartIndex` (inclusive) and `EndIndex` (exclusive)
 */
export type Substring<
    String extends string,
    StartIndex extends number,
    EndIndex extends number
> = TrimStart<String, StartIndex> extends `${infer R}${
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
    TrimStart<String, EndIndex>
}`
    ? R
    : never

export type CharAt<String extends string, Index extends number> = Head<
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
    TrimStart<String, Index>
>

/**
 * `true` if `String` contains `Substring`, else `false`
 */
export type Includes<
    String extends string,
    Substring extends string
> = String extends `${string}${Substring}${string}` ? true : false

type _IndexOf<
    String extends string,
    Substr extends string,
    CurrentIndex extends number
> = Substring<
    String,
    CurrentIndex,
    // @ts-expect-error see Add documentation
    Add<CurrentIndex, Length<Substr>>
> extends Substr
    ? CurrentIndex
    : _IndexOf<
          String,
          Substr,
          // @ts-expect-error see Increment documentation
          Increment<CurrentIndex>
      >

/**
 * gets the index of a `Substring` within a `String`. returns `-1` if it's not present
 */
export type IndexOf<String extends string, Substring extends string> = Includes<
    String,
    Substring
> extends true
    ? _IndexOf<String, Substring, 0>
    : -1

type _Replace<
    String extends string,
    Find extends TemplateLiteralStringable,
    ReplaceWith extends TemplateLiteralStringable
> = String extends `${infer BS}${Find}${infer AS}`
    ? Replace<`${BS}${ReplaceWith}${AS}`, Find, ReplaceWith>
    : String

/**
 * replaces all instances of `Find` with `ReplaceWith`. the type equivalent of {@link String.prototype.replace}
 *
 * modified version of [`String/Replace` from `ts-toolbelt`](https://millsp.github.io/ts-toolbelt/modules/string_replace.html)
 * that also allows `undefined` and `null` (ie. anything that template literal types allow)
 */
export declare type Replace<
    String extends string,
    Find extends TemplateLiteralStringable,
    ReplaceWith extends TemplateLiteralStringable
> = _Replace<String, Find, ReplaceWith> extends infer X ? Cast<X, string> : never

/**
 * replaces the first instance of `Find` with `ReplaceWith`. the type equivalent of {@link String.prototype.replace}
 */
export type ReplaceOne<
    String extends TemplateLiteralStringable,
    Find extends TemplateLiteralStringable,
    ReplaceWith extends TemplateLiteralStringable
> = String extends `${infer Start}${Find}${infer End}` ? `${Start}${ReplaceWith}${End}` : String

/**
 * checks whether the length of type `String` is **greater than or equal to** the length of type `Length`
 */
export type LengthGreaterOrEqual<String extends string, Length extends number> = CharAt<
    String,
    Decrement<Length>
> extends never
    ? false
    : true

/**
 * checks whether the length of type `String` is **greater than** the length of type `Length`
 */
export type LengthGreaterThan<String extends string, Length extends number> = LengthGreaterOrEqual<
    String,
    // @ts-expect-error see Increment documentation
    Increment<Length>
>

/**
 * creates a union of every possible capitalization of the given string
 *
 * only works on short strings
 * @example
 * type Foo = CaseInsensitive<'abc'> //"abc" | "Abc" | "ABc" | "ABC" | "AbC" | "aBc" | "aBC" | "abC"
 */
export type CaseInsensitive<T extends string> = T extends ''
    ? ''
    : `${Uppercase<Head<T>> | Lowercase<Head<T>>}${CaseInsensitive<Tail<T>>}`

type _DuplicateStringUntilLength<
    String extends string,
    Size extends number,
    CurrentString extends string
> = Length<CurrentString> extends Size
    ? CurrentString
    : LengthGreaterThan<`${CurrentString}${String}`, Size> extends true
    ? TrimEnd<`${CurrentString}${String}`, Size>
    : _DuplicateStringUntilLength<String, Size, `${CurrentString}${String}`>

/**
 * like {@link DuplicateString} except it duplicates until the exact provided `Size`, instead of a number of repetitions
 *
 * @example
 * type Foo = DuplicateStringUntilLength<'abc', 8> //'abcabcab'
 */
export type DuplicateStringUntilLength<
    String extends string,
    Size extends number
> = _DuplicateStringUntilLength<String, Size, String>

/**
 * the type equivalent of {@link String.prototype.padStart}
 */
export type PadStart<
    String extends string,
    Size extends number,
    PadString extends string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need to make sure it's a string literal or union of string literal, to prevent invalid results such as `000${number}`
> = `${any}` extends String | PadString
    ? string
    : {
          [Key in String]: number extends Size
              ? string
              : `${
                    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
                    DuplicateStringUntilLength<PadString, Subtract<Size, Length<Key>>>
                }${Key}`
      }[String]

/**
 * takes a `String` and a `MatchString` (ideally a union) and returns the string in the union that `String` started with
 * @example
 * type Foo: MatchStart<'foo', 'bar' | 'foo' | 'baz'>
 */
export type MatchStart<String extends string, MatchString extends string> = string extends
    | String
    | MatchString
    ? string
    : String extends `${MatchString}${infer End}`
    ? String extends `${infer Start}${End}`
        ? Start
        : never
    : never

/**
 * `true` if `Full` starts with the given `CheckStart`, else `false`
 */
export type StartsWith<Full extends string, CheckStart extends string> = string extends
    | Full
    | CheckStart
    ? boolean
    : Full extends `${CheckStart}${string}`
    ? true
    : false

/**
 * `true` if `Full` ends with the given `CheckEnd`, else `false`
 */
export type EndsWith<Full extends string, CheckEnd extends string> = string extends Full | CheckEnd
    ? boolean
    : Full extends `${string}${CheckEnd}`
    ? true
    : false

type _Join<T extends ReadonlyArray<unknown>, D extends string, Result extends string> = T extends []
    ? Result
    : T extends [Literal]
    ? `${Result}${T[0]}`
    : T extends [Literal, ...infer R]
    ? _Join<R, D, `${Result}${T[0]}${D}`>
    : string

/**
 * Concat many literals together
 *
 * like `ts-toolbelt`'s `Join` but tail-recursive, to allow for a higher stack depth in ts 4.5
 * @param T to concat
 * @param D to delimit
 * @see https://github.com/millsp/ts-toolbelt/issues/255
 */
// TODO: remove this once https://github.com/millsp/ts-toolbelt/issues/255 is merged
export type Join<T extends ReadonlyArray<Literal>, D extends string = ''> = _Join<
    T,
    D,
    ''
> extends infer X
    ? Cast<X, string>
    : never

/** a map of values where the keys are to be replaced by the values in {@link ReplaceValuesWithMap} */
type ReplaceValuesMap = Record<Exclude<AnyKey, symbol>, unknown>

type _TokenizeString<
    Value extends string,
    Map extends ReplaceValuesMap,
    Tokens extends string[]
> = '' extends Value
    ? Tokens
    : LongestString<MatchStart<Value, Keys<Map>>> extends infer Token
    ? Token extends string
        ? _TokenizeString<
              // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
              TrimStart<Value, Length<Token>>,
              Map,
              [...Tokens, Token]
          >
        : IndexOf<Value, Keys<Map>> extends infer NextTokenIndex
        ? NextTokenIndex extends -1
            ? [...Tokens, Value]
            : _TokenizeString<
                  // @ts-expect-error see above
                  TrimStart<Value, IndexOf<Value, Keys<Map>>>,
                  Map,
                  [
                      ...Tokens,
                      TrimEnd<
                          Value,
                          // @ts-expect-error https://github.com/microsoft/TypeScript/issues/43736
                          NextTokenIndex
                      >,
                  ]
              >
        : never
    : never

type _ReplaceValuesWithMap<
    InputTokens extends string[],
    Map extends ReplaceValuesMap,
    OutputTokens extends string[]
> = string[] extends InputTokens
    ? InputTokens
    : InputTokens extends []
    ? OutputTokens
    : _ReplaceValuesWithMap<
          ArrayTail<InputTokens>,
          Map,
          // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
          [
              ...OutputTokens,
              ArrayHead<InputTokens> extends Keys<Map>
                  ? Map[ArrayHead<InputTokens>]
                  : ArrayHead<InputTokens>,
          ]
      >

/**
 * replaces all instances in `Value` of the first string with the second string with each tuple in `Map`
 * @example
 * type Foo = ReplaceValuesWithMap<'foobarbaz', {foo: 'bar', baz: 'qux'}> // "barbarqux"
 */
export type ReplaceValuesWithMap<Format extends string, Map extends ReplaceValuesMap> =
    // @ts-expect-error stack depth error due to generic failing to narrow https://github.com/microsoft/TypeScript/issues/46171
    Join<_ReplaceValuesWithMap<_TokenizeString<Format, Map, []>, Map, []>>

/**
 * a stringified version of {@link Enumerate}
 *
 * the advantage of this one is that it works for much higher values, as it currently doesn't seem possible to do this
 * with numbers
 */
export type EnumerateAsString<Num extends number> = Keys<TupleOf<never, Num>>

/**
 * a stringified version of {@link RangeType}
 *
 * the advantage of this one is that it works for much higher values, as it currently doesn't seem possible to do this
 * with numbers
 */
export type RangeAsString<From extends number, To extends number> =
    | Exclude<EnumerateAsString<To>, EnumerateAsString<From>>
    | ToString<To>

/** gets the longest string in a union of strings */
export type LongestString<Strings extends string> = ListOf<Strings>[IndexOfLongestString<
    ListOf<Strings>
>]

type SplitByUnionTailRec<
    Value extends string,
    SplitBy extends string,
    CurrentResult extends string
> = Value extends ''
    ? never
    : IndexOf<Value, SplitBy> extends -1
    ? CurrentResult | Value
    : IndexOf<Value, SplitBy> extends 0
    ? SplitByUnionTailRec<
          // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
          TrimStart<Value, Length<SplitBy>>,
          SplitBy,
          CurrentResult
      >
    : SplitByUnionTailRec<
          // @ts-expect-error see above
          TrimStart<Value, Add<Length<SplitBy>, IndexOf<Value, SplitBy>>>,
          SplitBy,
          | CurrentResult
          | TrimEnd<
                Value,
                // @ts-expect-error see above
                IndexOf<Value, SplitBy>
            >
      >

/**
 * like `Split` from `ts-toolbelt` but works properly with unions
 * @example
 * type Foo = SplitByUnion<'foo,bar.baz', '.' | ','> //'foo'|'bar'|'baz'
 */
export type SplitByUnion<Value extends string, SplitBy extends string> = SplitByUnionTailRec<
    Value,
    SplitBy,
    never
>

type SplitByLengthTailRec<
    T extends string,
    Len extends number,
    Result extends string[]
> = Length<T> extends Len
    ? [...Result, T]
    : SplitByLengthTailRec<
          // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
          TrimStart<T, Len>,
          Len,
          [...Result, TrimEnd<T, Len>]
      >

/**
 * splits a string into an array of strings with a specified length
 * @example
 * type Foo = SplitByLength<'foobarbaz', 3> //['foo', 'bar', 'baz']
 */
export type SplitByLength<T extends string, Len extends number> = SplitByLengthTailRec<T, Len, []>

/**
 * truncates a string to the specified `MaxLength`, concatenating an `Ellipsis` if the string is too long
 */
export type Truncate<
    Str extends string,
    MaxLength extends number,
    Ellipsis extends string = '…'
> = IsGreaterThan<Length<Ellipsis>, MaxLength> extends true
    ? never
    : IsLessOrEqual<Length<Str>, MaxLength> extends true
    ? Str
    : `${Substring<Str, 0, Subtract<MaxLength, Length<Ellipsis>>>}${Ellipsis}`

/**
 * if the given `Str` doesn't already start with the given `Prefix`, then append the prefix to the start of the string.
 *
 * if the `Str` already starts with the `Prefix`, then returns the string as is
 * @example
 * type Foo = MakeStartsWith<'foo', '.'> // '.foo'
 * type Bar = MakeStartsWith<'.foo', '.'> // '.foo'
 */
export type MakeStartsWith<Str extends string, Prefix extends string> = string extends Str | Prefix
    ? string
    : StartsWith<Str, Prefix> extends true
    ? Str
    : `${Prefix}${Str}`

/**
 * if the given `Str` doesn't already end with the given `Suffix`, then append the suffix to the end of the string.
 *
 * if the `Str` already ends with the `Suffix`, then returns the string as is
 * @example
 * type Foo = MakeEndsWith<'foo', '.'> // 'foo.'
 * type Bar = MakeEndsWith<'foo.', '.'> // 'foo.'
 */
export type MakeEndsWith<Str extends string, Suffix extends string> = string extends Str | Suffix
    ? string
    : EndsWith<Str, Suffix> extends true
    ? Str
    : `${Str}${Suffix}`
