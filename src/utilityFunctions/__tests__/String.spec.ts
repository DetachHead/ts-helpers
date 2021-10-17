import {
    capitalize,
    countInString,
    join,
    leftOf,
    makeEndsWith,
    makeStartsWith,
    midOf,
    rightOf,
    truncate,
    uncapitalize,
} from '../String'
import { exactly } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('join', () => {
    const value = join([1, 2, 3], ',') // $ExpectType "1,2,3"
    assert(value === '1,2,3')
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

describe('case', () => {
    describe('capitalize', () => {
        test('known at compiletime', () => {
            exactly('Foo', capitalize('foo'))
        })
        test('not known at compiletime', () => {
            exactly<string>()(capitalize('foo' as string))
        })
    })
    describe('uncapitalize', () => {
        test('known at compiletime', () => {
            exactly('foo', uncapitalize('Foo'))
        })
        test('not known at compiletime', () => {
            exactly<string>()(uncapitalize('Foo' as string))
        })
    })
})
