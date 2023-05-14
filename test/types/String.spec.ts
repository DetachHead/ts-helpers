import { exactly } from '../../src/functions/misc'
import {
    CaseInsensitive,
    DuplicateString,
    Email,
    FileName,
    GUID,
    IPv4,
    IPv6,
    LengthGreaterOrEqual,
    LengthGreaterThan,
    ReplaceValuesWithMap,
    SplitByLength,
    SplitByUnion,
    UriString,
} from '../../src/types/String'

test('UriString', () => {
    // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
    'asdf' satisfies UriString
    'asdf://asdf.com' satisfies UriString
    // @ts-expect-error TS2345: Argument of type '"asdf://asdf.com"' is not assignable to parameter of type '`foo://${string}`'.
    'asdf://asdf.com' satisfies UriString<'foo'>
})
test('UrlString', () => {
    // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
    'asdf' satisfies UriString
    'https://asdf.com' satisfies UriString
})
test('Email', () => {
    exactly<`${string}@${string}.${string}`, Email>()
})

test('Guid', () => {
    exactly<`${string}-${string}-${string}-${string}-${string}`, GUID>()
})

describe('IP', () => {
    test('v4', () => {
        // @ts-expect-error invalid ip
        'a.b.c.d' satisfies IPv4
        // @ts-expect-error invalid ip (one too many)
        '192.168.0.1.2' satisfies IPv4
        '192.168.0.1' satisfies IPv4
    })
    test('v6', () => {
        // @ts-expect-error invalid ip
        'asdf' satisfies IPv6
        '2001:0db8:0000:0000:0000:ff00:0042:8329' satisfies IPv6
        // @ts-expect-error invalid ip (not enough)
        '2001:0db8:0000:0000:0000:ff00:0042' satisfies IPv6
    })
})

test('FileName', () => {
    'asdf' satisfies FileName
    'asdf.png' satisfies FileName<'png'>
    // @ts-expect-error wrong filetype
    'asdf.jpg' satisfies FileName<'png'>
})

test('LengthGreaterOrEqual', () => {
    exactly<true, LengthGreaterOrEqual<'asdf', 4>>()
    exactly<false, LengthGreaterOrEqual<'asdf', 5>>()
    exactly<true, LengthGreaterOrEqual<'asdf', 3>>()
})

test('LengthGreaterThan', () => {
    exactly<false, LengthGreaterThan<'asdf', 4>>()
    exactly<false, LengthGreaterThan<'asdf', 5>>()
    exactly<true, LengthGreaterThan<'asdf', 3>>()
})

test('CaseInsensitive', () => {
    exactly<'abc' | 'aBC' | 'ABC' | 'abC' | 'AbC' | 'aBc' | 'ABc' | 'Abc', CaseInsensitive<'abc'>>()
})

describe('ReplaceValuesWithMap', () => {
    test('basic', () => {
        exactly<'barbarqux', ReplaceValuesWithMap<'foobarbaz', { foo: 'bar'; baz: 'qux' }>>()
    })
    test('non-replaced value at end of string', () => {
        exactly<'barbarquxqux', ReplaceValuesWithMap<'foobarbazqux', { foo: 'bar'; baz: 'qux' }>>()
    })
    test('stack depth (tail recursion optimization)', () => {
        exactly<
            DuplicateString<'bye', 100>,
            ReplaceValuesWithMap<DuplicateString<'hi', 100>, { hi: 'bye' }>
        >()
    })
})

test('SplitByUnion', () => {
    exactly<'foo' | 'bar' | 'baz', SplitByUnion<'foo.bar,baz', '.' | ','>>()
})

test('SplitByLength', () => {
    exactly<['foo', 'bar', 'baz'], SplitByLength<'foobarbaz', 3>>()
})
