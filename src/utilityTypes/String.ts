import { Primitive } from 'utility-types'
import { Add, Decrement, Increment, IsGreaterThan, IsLessOrEqual, Subtract } from './Number'
import { Length } from 'ts-toolbelt/out/String/Length'
import { AnyKey, IsNever } from 'tsdef'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { IndexOfLongestString, TupleOf } from './Array'
import { Keys } from './Any'
import { ListOf } from 'ts-toolbelt/out/Union/ListOf'
import { Join } from 'ts-toolbelt/out/String/Join'
import { Head as ArrayHead } from 'ts-toolbelt/out/List/Head'
import { Tail as ArrayTail } from 'ts-toolbelt/out/List/Tail'

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

/** an IP address */
export type IP = `${bigint}.${bigint}.${bigint}.${bigint}` // use bigint instead of number to prevent additional dots

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

/**
 * duplicates a string a given number of times
 * @example
 * type Foo = DuplicateString<'foo', 3> //'foofoofoo'
 */
export type DuplicateString<T extends string, N extends number> = N extends 1
    ? T
    : `${T}${DuplicateString<T, Subtract<N, 1>>}`

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
> = TrimStart<String, StartIndex> extends `${infer R}${TrimStart<String, EndIndex>}` ? R : never

export type CharAt<String extends string, Index extends number> = Head<TrimStart<String, Index>>

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
              : `${DuplicateStringUntilLength<PadString, Subtract<Size, Length<Key>>>}${Key}`
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

/** a map of values where the keys are to be replaced by the values in {@link ReplaceValuesWithMap} */
type ReplaceValuesMap = Record<Exclude<AnyKey, symbol>, unknown>

type ReplaceValuesWithMapToken = { replaceable: boolean; value: string }

type _TokenizeString<
    Value extends string,
    Map extends ReplaceValuesMap,
    EscapeIn extends string,
    Unescape extends string
> = '' extends Value
    ? []
    : Value extends `${Unescape}${EscapeIn}${infer Rest}`
    ? [{ value: EscapeIn; replaceable: false }, ..._TokenizeString<Rest, Map, EscapeIn, Unescape>]
    : Value extends `${EscapeIn}${infer EscapedValue}${EscapeIn}${infer Rest}`
    ? [
          { value: EscapedValue; replaceable: false },
          ..._TokenizeString<Rest, Map, EscapeIn, Unescape>
      ]
    : LongestString<MatchStart<Value, Keys<Map>>> extends infer ValueToReplace
    ? ValueToReplace extends string
        ? [
              { value: ValueToReplace; replaceable: true },
              ..._TokenizeString<TrimStart<Value, Length<ValueToReplace>>, Map, EscapeIn, Unescape>
          ]
        : IndexOf<
              Value,
              Keys<Map> | `${Unescape}${EscapeIn}` | `${EscapeIn}${string}${EscapeIn}`
          > extends infer NextTokenIndex
        ? NextTokenIndex extends -1
            ? [{ value: Value; replaceable: false }]
            : [
                  {
                      value: TrimEnd<
                          Value,
                          // @ts-expect-error i think there's a bug in ts with inferred generics not narrowing properly
                          NextTokenIndex
                      >
                      replaceable: false
                  },
                  ..._TokenizeString<
                      TrimStart<
                          Value,
                          // @ts-expect-error see comment above
                          NextTokenIndex
                      >,
                      Map,
                      EscapeIn,
                      Unescape
                  >
              ]
        : never
    : never

type _ReplaceValuesWithMap<
    Tokens extends ReplaceValuesWithMapToken[],
    Map extends ReplaceValuesMap
> = Tokens extends []
    ? []
    : // @ts-expect-error stack depth error but it's fine
      [
          ArrayHead<Tokens>['replaceable'] extends false
              ? ArrayHead<Tokens>['value']
              : ArrayHead<Tokens>['value'] extends Keys<Map>
              ? Map[ArrayHead<Tokens>['value']]
              : ArrayHead<Tokens>['value'],
          ..._ReplaceValuesWithMap<ArrayTail<Tokens>, Map>
      ]

/**
 * replaces all instances in `Value` of the first string with the second string with each tuple in `Map`.
 *
 * **generics:**
 * - `Value` - the string to replace values in
 * - `Map` - an object where instances of the keys within `Value` to replace and the values
 * - `EscapeIn` - a string that disables replacing for any section of `Value` within it. see examples below
 * - `Unescape` - a string that un-escapes the `EscapeIn` value if placed before it - see examples below
 * @example
 * type Foo = ReplaceValuesWithMap<'foobarbaz', {foo: 'bar', baz: 'qux'}> // "barbarqux"
 * type Bar = ReplaceValuesWithMap<"foo'baz'quux", {foo: 'bar', baz: 'qux', quux: 'quuz'}> // "barbazquuz"
 */
export type ReplaceValuesWithMap<
    Value extends string,
    Map extends ReplaceValuesMap,
    EscapeIn extends string = never,
    Unescape extends string = never
> = Join<_ReplaceValuesWithMap<_TokenizeString<Value, Map, EscapeIn, Unescape>, Map>>

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

type _SplitByUnion<
    T extends string,
    SplitBy extends string
> = T extends `${infer Char}${infer Rest}`
    ? Char extends SplitBy
        ? ''
        : `${Char}${_SplitByUnion<Rest, SplitBy>}`
    : T

/**
 * like `Split` from `ts-toolbelt` but works properly with unions
 * @example
 * type Foo = SplitByUnion<'foo,bar.baz', '.' | ','> //'foo'|'bar'|'baz'
 */
export type SplitByUnion<T extends string, SplitBy extends string> = T extends `${_SplitByUnion<
    T,
    SplitBy
>}${infer Char}${infer Rest}`
    ? Char extends SplitBy
        ? _SplitByUnion<T, SplitBy> | SplitByUnion<Rest, SplitBy>
        : never
    : T

/**
 * splits a string into an array of strings with a specified length
 * @example
 * type Foo = SplitByLength<'foobarbaz', 3> //['foo', 'bar', 'baz']
 */
export type SplitByLength<T extends string, Len extends number> = [
    TrimEnd<T, Len>,
    ...(Length<T> extends Len ? [] : SplitByLength<TrimStart<T, Len>, Len>)
]

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
