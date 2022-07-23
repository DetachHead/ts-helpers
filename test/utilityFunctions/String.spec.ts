import {
    capitalize,
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
    toLowerCase,
    toUpperCase,
    truncate,
    uncapitalize,
} from '../../src/utilityFunctions/String'
import { exactly, toStringType } from '../../src/utilityFunctions/misc'

test('match', () => {
    const foo = match('', /a/u)
    if (foo !== null) {
        exactly<string>()(foo[0])
        exactly<string | undefined>()(foo[1])
    }
})

describe('toStringType', () => {
    test('value known at compiletime', () => {
        exactly('123', toStringType(123))
    })
    test('not known at compiletime', () => {
        exactly('[object Object]' as string, toStringType({ foo: 1 }))
    })
})

test('charAt', () => {
    exactly('d', charAt('asdf', 2))
})

test('substring', () => {
    exactly('bar', substring('foobarbaz', 3, 6))
})

test('join', () => {
    exactly('1,2,3', join([1, 2, 3], ','))
})

test('split', () => {
    exactly(['1', '2', '3'], split('1,2,3', ','))
})

describe('indexOf', () => {
    test('substring exists', () => {
        exactly(3, indexOf('foobarbaz', 'bar'))
    })
    test("substring doesn't exist", () => {
        exactly(-1, indexOf('foobarbaz', 'qux'))
    })
})

describe('includes', () => {
    test('true', () => {
        exactly(true, includes('foobar', 'bar'))
    })
    test('false', () => {
        exactly(false, includes('foobar', 'baz'))
    })
})

test('replaceOne', () => {
    exactly('foo.bar,baz', replaceOne('foo,bar,baz', ',', '.'))
})

test('replaceAll', () => {
    exactly('foo.bar.baz', replaceAll('foo,bar,baz', ',', '.'))
})

describe('padStart', () => {
    test('padString cut off', () => {
        exactly('abafoo', padStart('foo', 6, 'ab'))
    })
    test('padString not cut off', () => {
        exactly('barbarbarfoo', padStart('foo', 12, 'bar'))
    })
    test('default pad', () => {
        exactly('  foo', padStart('foo', 5))
    })
    test('string not known at compiletime', () => {
        exactly<string>()(padStart('foo' as string, 6, 'ab'))
    })
    test('padstring not known at compiletime', () => {
        exactly<string>()(padStart('foo', 6, 'ab' as string))
    })
})

describe('startsWith', () => {
    test('true', () => {
        exactly(true, startsWith('foobar', 'foo'))
        exactly(true, startsWith('foobar' as `foo${string}`, 'foo'))
    })
    test('false', () => {
        exactly(false, startsWith('foobar', 'baz'))
    })
    test('not known at compiletime', () => {
        exactly<boolean>()(startsWith('foobar' as string, 'baz'))
        exactly<boolean>()(startsWith('foobar', 'baz' as string))
    })
})

describe('endsWith', () => {
    test('true', () => {
        exactly(true, endsWith('foobar', 'bar'))
        exactly(true, endsWith('foobar' as `${string}bar`, 'bar'))
    })
    test('false', () => {
        exactly(false, endsWith('foobar', 'baz'))
    })
    test('not known at compiletime', () => {
        exactly<boolean>()(endsWith('foobar' as string, 'baz'))
        exactly<boolean>()(endsWith('foobar', 'baz' as string))
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

describe('case', () => {
    describe('toLowerCase', () => {
        test('known at compiletime', () => {
            exactly('foo', toLowerCase('FOO'))
        })
        test('not known at compiletime', () => {
            exactly<Lowercase<string>>()(toLowerCase('FOO' as string))
        })
    })
    describe('toUpperCase', () => {
        test('known at compiletime', () => {
            exactly('FOO', toUpperCase('foo'))
        })
        test('not known at compiletime', () => {
            exactly<Uppercase<string>>()(toUpperCase('foo' as string))
        })
    })
    describe('capitalize', () => {
        test('known at compiletime', () => {
            exactly('Foo', capitalize('foo'))
        })
        test('not known at compiletime', () => {
            exactly<Capitalize<string>>()(capitalize('foo' as string))
        })
    })
    describe('uncapitalize', () => {
        test('known at compiletime', () => {
            exactly('foo', uncapitalize('Foo'))
        })
        test('not known at compiletime', () => {
            exactly<Uncapitalize<string>>()(uncapitalize('Foo' as string))
        })
    })
})
