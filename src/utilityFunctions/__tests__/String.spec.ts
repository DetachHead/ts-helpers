import {
    charAt,
    countInString,
    endsWith,
    includes,
    indexOf,
    join,
    leftOf,
    makeEndsWith,
    makeStartsWith,
    match,
    midOf,
    padStart,
    replaceAll,
    replaceOne,
    rightOf,
    split,
    startsWith,
    substring,
    truncate,
} from '../String'
import { exactly, toStringType } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('match', () => {
    const foo = match('', /a/u)
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

describe('truncate', () => {
    test('default ellipsis', () => exactly('foo…', truncate('foobarbaz', 4)))
    test('custom ellipsis', () => exactly('foo--', truncate('foobarbaz', 5, '--')))
    test('value not known at compiletime', () => {
        exactly<string>()(truncate('foobar' as string, 4))
    })
})

describe('makeStartsWith', () => {
    test("doesn't already start with prefix", () => {
        exactly('.foobar', makeStartsWith('foobar', '.'))
    })
    test('already starts with prefix', () => {
        exactly('.foobar', makeStartsWith('.foobar', '.'))
    })
    describe('strings not known at compiletime', () => {
        test('original string', () => {
            exactly<string>()(makeStartsWith('.foobar' as string, '.'))
        })
        test('second string', () => {
            exactly<string>()(makeStartsWith('.foobar', '.' as string))
        })
        test('both', () => {
            exactly<string>()(makeStartsWith('.foobar' as string, '.' as string))
        })
    })
})

describe('makeEndsWith', () => {
    test("doesn't already end with suffix", () => {
        exactly('foobar.', makeEndsWith('foobar', '.'))
    })
    test('already ends with suffix', () => {
        exactly('foobar.', makeEndsWith('foobar.', '.'))
    })
    describe('strings not known at compiletime', () => {
        test('original string', () => {
            exactly<string>()(makeEndsWith('foobar.' as string, '.'))
        })
        test('second string', () => {
            exactly<string>()(makeEndsWith('foobar.', '.' as string))
        })
        test('both', () => {
            exactly<string>()(makeEndsWith('foobar.' as string, '.' as string))
        })
    })
})

describe('leftOf', () => {
    test('known at compiletime', () => {
        exactly('foo', leftOf('foobarbaz', 'bar'))
    })
    describe('not known at compiletime', () => {
        test('string', () => {
            exactly<string>()(leftOf('foobarbaz' as string, 'bar'))
        })
        test('substring', () => {
            exactly<string>()(leftOf('foobarbaz', 'bar' as string))
        })
        test('both', () => {
            exactly<string>()(leftOf('foobarbaz' as string, 'bar' as string))
        })
    })
})

describe('rightOf', () => {
    test('known at compiletime', () => {
        exactly('baz', rightOf('foobarbaz', 'bar'))
    })
    describe('not known at compiletime', () => {
        test('string', () => {
            exactly<string>()(rightOf('foobarbaz' as string, 'bar'))
        })
        test('substring', () => {
            exactly<string>()(rightOf('foobarbaz', 'bar' as string))
        })
        test('both', () => {
            exactly<string>()(rightOf('foobarbaz' as string, 'bar' as string))
        })
    })
})

describe('midOf', () => {
    test('known at compiletime', () => {
        exactly('baz', midOf('foobarbazquxquux', 'bar', 'qux'))
    })
    describe('not known at compiletime', () => {
        test('string', () => {
            exactly<string>()(midOf('foobarbazquxquux' as string, 'bar', 'qux'))
        })
        test('start', () => {
            exactly<string>()(midOf('foobarbazquxquux', 'bar' as string, 'qux'))
        })
        test('end', () => {
            exactly<string>()(midOf('foobarbazquxquux', 'bar', 'qux' as string))
        })
    })
})

describe('countInString', () => {
    test('known at compiletime', () => {
        exactly(3, countInString('1,2,3,4', ','))
    })
    describe('not known at compiletime', () => {
        test('string', () => {
            exactly<number>()(countInString('1,2,3,4' as string, ','))
        })
        test('substring', () => {
            exactly<number>()(countInString('1,2,3,4', ',' as string))
        })
        test('both', () => {
            exactly<number>()(countInString('1,2,3,4' as string, ',' as string))
        })
    })
})
