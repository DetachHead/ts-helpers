import {
  Email,
  FileName,
  IP,
  LengthGreaterOrEqual,
  LengthGreaterThan,
  UriString,
  UrlString,
  CaseInsensitive,
} from '../String'
import { testType } from '../../utilityFunctions/misc'

test('UriString', () => {
  // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
  testType<UriString>('asdf')
  testType<UriString>('asdf://asdf.com')
  // @ts-expect-error TS2345: Argument of type '"asdf://asdf.com"' is not assignable to parameter of type '`foo://${string}`'.
  testType<UriString<'foo'>>('asdf://asdf.com')
})
test('UrlString', () => {
  // @ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
  testType<UrlString>('asdf')
  testType<UrlString>('https://asdf.com')
})
test('Email', () => {
  // @ts-expect-error TS2345: Argument of type '"asdf.com"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
  testType<Email>('asdf.com')
  // @ts-expect-error TS2345: Argument of type '"foo@asdf"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
  testType<Email>('foo@asdf')
  testType<Email>('foo@bar.com')
})

test('IP', () => {
  // @ts-expect-error invalid ip
  testType<IP>('a.b.c.d')
  // @ts-expect-error invalid ip (one too many)
  testType<IP>('192.168.0.1.2')
  testType<IP>('192.168.0.1')
})

test('FileName', () => {
  testType<FileName>('asdf')
  testType<FileName<'png'>>('asdf.png')
  // @ts-expect-error wrong filetype
  testType<FileName<'png'>>('asdf.jpg')
})

test('LengthGreaterOrEqual', () => {
  testType<LengthGreaterOrEqual<'asdf', 4>>(true)
  testType<LengthGreaterOrEqual<'asdf', 5>>(false)
  testType<LengthGreaterOrEqual<'asdf', 3>>(true)
})

test('LengthGreaterThan', () => {
  testType<LengthGreaterThan<'asdf', 4>>(false)
  testType<LengthGreaterThan<'asdf', 5>>(false)
  testType<LengthGreaterThan<'asdf', 3>>(true)
})

test('CaseInsensitive', () => {
  testType<CaseInsensitive<'abc'>>('abc')
  testType<CaseInsensitive<'abc'>>('AbC')
  testType<CaseInsensitive<'abc'>>('aBC')
  testType<CaseInsensitive<'abc'>>('ABC')
  testType<CaseInsensitive<'abc'>>('aBc')
  testType<CaseInsensitive<'abc'>>('Abc')
  // @ts-expect-error wrong value
  testType<CaseInsensitive<'abc'>>('ABd')
})
