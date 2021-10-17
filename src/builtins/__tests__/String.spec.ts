import { exactly } from '../../utilityFunctions/misc'

describe('toString', () => {
    exactly('asdf', 'asdf'.toString())
})

test('charAt', () => {
    exactly('d', 'asdf'.charAt(2))
})

test('substring', () => {
    exactly('bar', 'foobarbaz'.substring(3, 6))
})

test('split', () => {
    exactly(['1', '2', '3'], '1,2,3'.split(','))
})

describe('indexOf', () => {
    test('substring exists', () => {
        exactly(3, 'foobarbaz'.indexOf('bar'))
    })
    test("substring doesn't exist", () => {
        exactly(-1, 'foobarbaz'.indexOf('qux'))
    })
})

describe('includes', () => {
    test('true', () => {
        exactly(true, 'foobar'.includes('bar'))
    })
    test('false', () => {
        exactly(false, 'foobar'.includes('baz'))
    })
})

test('replace', () => {
    exactly('foo.bar,baz', 'foo,bar,baz'.replace(',', '.'))
})

test('replaceAll', () => {
    exactly('foo.bar.baz', 'foo,bar,baz'.replaceAll(',', '.'))
})

describe('startsWith', () => {
    test('true', () => {
        exactly(true, 'foobar'.startsWith('foo'))
        exactly<true>()(('foobar' as `foo${string}`).startsWith('foo'))
    })
    test('false', () => {
        exactly(false, 'foobar'.startsWith('baz'))
    })
    test('not known at compiletime', () => {
        exactly<boolean>()(('foobar' as string).startsWith('baz'))
        exactly<boolean>()('foobar'.startsWith('baz' as string))
    })
})

describe('endsWith', () => {
    test('true', () => {
        exactly(true, 'foobar'.endsWith('bar'))
        exactly<true>()(('foobar' as `${string}bar`).endsWith('bar'))
    })
    test('false', () => {
        exactly(false, 'foobar'.endsWith('baz'))
    })
    test('not known at compiletime', () => {
        exactly<boolean>()(('foobar' as string).endsWith('baz'))
        exactly<boolean>()('foobar'.endsWith('baz' as string))
    })
})

describe('case', () => {
    describe('toLowerCase', () => {
        test('known at compiletime', () => {
            exactly('foo', 'FOO'.toLowerCase())
        })
        test('not known at compiletime', () => {
            exactly<string>()(('FOO' as string).toLowerCase())
        })
    })
    describe('toUpperCase', () => {
        test('known at compiletime', () => {
            exactly('FOO', 'foo'.toUpperCase())
        })
        test('not known at compiletime', () => {
            exactly<string>()(('foo' as string).toUpperCase())
        })
    })
})

describe('padStart', () => {
    // TODO: figure out why value fails to narrow unless assigned to a variable first
    test('padString cut off', () => {
        const value = 'foo'.padStart(6, 'ab')
        exactly('abafoo', value)
    })
    test('padString not cut off', () => {
        const value = 'foo'.padStart(12, 'bar')
        exactly('barbarbarfoo', value)
    })
    test('default pad', () => {
        exactly('  foo', 'foo'.padStart(5))
    })
    test('string not known at compiletime', () => {
        exactly<string>()(('foo' as string).padStart(6, 'ab'))
    })
    test('padstring not known at compiletime', () => {
        exactly<string>()('foo'.padStart(6, 'ab' as string))
    })
})
