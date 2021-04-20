import {
  charAt,
  endsWith,
  includes,
  indexOf,
  join,
  match,
  padStart,
  replaceAll,
  replaceOne,
  split,
  startsWith,
  substring,
} from '../String'
import { PowerAssert } from 'typed-nodejs-assert'
import { exactly, toStringType } from '../misc'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('match', () => {
  const foo = match('', /a/)
  if (foo !== null) {
    // noinspection BadExpressionStatementJS
    foo[0] // $ExpectType string
    // noinspection BadExpressionStatementJS
    foo[1] // $ExpectType string | undefined
  }
})

describe('toStringType', () => {
  test('value known at compiletime', () => {
    const value = toStringType(123 as const) // $ExpectType "123"
    assert(value === '123')
  })
  test('not known at compiletime', () => {
    const value = toStringType({ foo: 1 }) // $ExpectType string
    assert(value === '[object Object]')
  })
})

test('charAt', () => {
  const value = charAt('asdf', 2) // $ExpectType "d"
  assert(value === 'd')
})

test('substring', () => {
  const value = substring('foobarbaz', 3, 6) // $ExpectType "bar"
  assert(value === 'bar')
})

test('join', () => {
  const value = join([1, 2, 3], ',') // $ExpectType "1,2,3"
  assert(value === '1,2,3')
})

test('split', () => {
  const value = split('1,2,3', ',') // $ExpectType ["1", "2", "3"]
  assert.deepStrictEqual(value, ['1', '2', '3'])
})

describe('indexOf', () => {
  test('substring exists', () => {
    const value = indexOf('foobarbaz', 'bar') // $ExpectType 3
    assert(value === 3)
  })
  test("substring doesn't exist", () => {
    const value = indexOf('foobarbaz', 'qux') // $ExpectType -1
    assert(value === -1)
  })
})

describe('includes', () => {
  test('true', () => {
    const value = includes('foobar', 'bar') // $ExpectType true
    assert(value)
  })
  test('false', () => {
    const value = includes('foobar', 'baz') // $ExpectType false
    assert(!value)
  })
})

test('replaceOne', () => {
  const value = replaceOne('foo,bar,baz', ',', '.') // $ExpectType "foo.bar,baz"
  assert(value === 'foo.bar,baz')
})

test('replaceAll', () => {
  const value = replaceAll('foo,bar,baz', ',', '.') // $ExpectType "foo.bar.baz"
  assert(value === 'foo.bar.baz')
})

test('exactly', () => {
  const exactlyNumber = exactly<number>()
  exactlyNumber(1 as number) // $ExpectType number
  // @ts-expect-error type isn't exactly number
  exactlyNumber(1) // $ExpectType never
})

describe('padStart', () => {
  test('padString cut off', () => {
    const value = padStart('foo', 6, 'ab') // $ExpectType "abafoo"
    assert(value === 'abafoo')
  })
  test('padString not cut off', () => {
    const value = padStart('foo', 12, 'bar') // $ExpectType "barbarbarfoo"
    assert(value === 'barbarbarfoo')
  })
  test('default pad', () => {
    const value = padStart('foo', 5) // $ExpectType "  foo"
    assert(value === '  foo')
  })
  test('string not known at compiletime', () => {
    padStart('foo' as string, 6, 'ab') // $ExpectType string
  })
  test('padstring not known at compiletime', () => {
    padStart('foo', 6, 'ab' as string) // $ExpectType string
  })
})

describe('startsWith', () => {
  test('true', () => {
    const result = startsWith('foobar', 'foo') // $ExpectType true
    assert(result)
    startsWith('foobar' as `foo${string}`, 'foo') // $ExpectType true
  })
  test('false', () => {
    const result = startsWith('foobar', 'baz') // $ExpectType false
    assert(!result)
  })
  test('not known at compiletime', () => {
    startsWith('foobar' as string, 'baz') // $ExpectType boolean
    startsWith('foobar', 'baz' as string) // $ExpectType boolean
  })
})

describe('endsWith', () => {
  test('true', () => {
    const result = endsWith('foobar', 'bar') // $ExpectType true
    assert(result)
    endsWith('foobar' as `${string}bar`, 'bar') // $ExpectType true
  })
  test('false', () => {
    const result = endsWith('foobar', 'baz') // $ExpectType false
    assert(!result)
  })
  test('not known at compiletime', () => {
    endsWith('foobar' as string, 'baz') // $ExpectType boolean
    endsWith('foobar', 'baz' as string) // $ExpectType boolean
  })
})
