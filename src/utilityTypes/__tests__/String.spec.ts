import {
    Email,
    FileName,
    LengthGreaterOrEqual,
    LengthGreaterThan,
    UriString,
    UrlString,
    CaseInsensitive,
    IPv4,
    IPv6,
    ReplaceValuesWithMap,
    SplitByUnion,
    SplitByLength,
    DuplicateString,
    GUID,
} from '../String'
import { assertType, exactly } from '../../utilityFunctions/misc'

test('UriString', () => {
    // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
    assertType<UriString>('asdf')
    assertType<UriString>('asdf://asdf.com')
    // @ts-expect-error TS2345: Argument of type '"asdf://asdf.com"' is not assignable to parameter of type '`foo://${string}`'.
    assertType<UriString<'foo'>>('asdf://asdf.com')
})
test('UrlString', () => {
    // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
    assertType<UrlString>('asdf')
    assertType<UrlString>('https://asdf.com')
})
test('Email', () => {
    // @ts-expect-error TS2345: Argument of type '"asdf.com"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
    assertType<Email>('asdf.com')
    // @ts-expect-error TS2345: Argument of type '"foo@asdf"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
    assertType<Email>('foo@asdf')
    assertType<Email>('foo@bar.com')
})

test('Guid', () => {
    exactly<`${string}-${string}-${string}-${string}-${string}`, GUID>()
})

describe('IP', () => {
    test('v4', () => {
        // @ts-expect-error invalid ip
        assertType<IPv4>('a.b.c.d')
        // @ts-expect-error invalid ip (one too many)
        assertType<IPv4>('192.168.0.1.2')
        assertType<IPv4>('192.168.0.1')
    })
    test('v6', () => {
        // @ts-expect-error invalid ip
        assertType<IPv6>('asdf')
        assertType<IPv6>('2001:0db8:0000:0000:0000:ff00:0042:8329')
        // @ts-expect-error invalid ip (not enough)
        assertType<IPv6>('2001:0db8:0000:0000:0000:ff00:0042')
    })
})

test('FileName', () => {
    assertType<FileName>('asdf')
    assertType<FileName<'png'>>('asdf.png')
    // @ts-expect-error wrong filetype
    assertType<FileName<'png'>>('asdf.jpg')
})

test('LengthGreaterOrEqual', () => {
    assertType<LengthGreaterOrEqual<'asdf', 4>>(true)
    assertType<LengthGreaterOrEqual<'asdf', 5>>(false)
    assertType<LengthGreaterOrEqual<'asdf', 3>>(true)
})

test('LengthGreaterThan', () => {
    assertType<LengthGreaterThan<'asdf', 4>>(false)
    assertType<LengthGreaterThan<'asdf', 5>>(false)
    assertType<LengthGreaterThan<'asdf', 3>>(true)
})

test('CaseInsensitive', () => {
    assertType<CaseInsensitive<'abc'>>('abc')
    assertType<CaseInsensitive<'abc'>>('AbC')
    assertType<CaseInsensitive<'abc'>>('aBC')
    assertType<CaseInsensitive<'abc'>>('ABC')
    assertType<CaseInsensitive<'abc'>>('aBc')
    assertType<CaseInsensitive<'abc'>>('Abc')
    // @ts-expect-error wrong value
    assertType<CaseInsensitive<'abc'>>('ABd')
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
    type Foo = SplitByLength<'foobarbaz', 3> // $ExpectType ["foo", "bar", "baz"]
    assertType<Foo>(['foo', 'bar', 'baz'])
})
