import { Email, IP, UriString, UrlString } from '../String'
import { testType } from '../../utilityFunctions/misc'

test('UriString', () => {
	//@ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
	testType<UriString>('asdf')
	testType<UriString>('asdf://asdf.com')
	//@ts-expect-error TS2345: Argument of type '"asdf://asdf.com"' is not assignable to parameter of type '`foo://${string}`'.
	testType<UriString<'foo'>>('asdf://asdf.com')
})
test('UrlString', () => {
	//@ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
	testType<UrlString>('asdf')
	testType<UrlString>('https://asdf.com')
})
test('Email', () => {
	//@ts-expect-error TS2345: Argument of type '"asdf.com"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
	testType<Email>('asdf.com')
	//@ts-expect-error TS2345: Argument of type '"foo@asdf"' is not assignable to parameter of type '`${string}@${string}.${string}`'.
	testType<Email>('foo@asdf')
	testType<Email>('foo@bar.com')
})

test('IP', () => {
	//@ts-expect-error invalid ip
	testType<IP>('a.b.c.d')
	testType<IP>('192.168.0.1')
})
