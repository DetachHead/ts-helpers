import {
    castArray,
    concat,
    containsDuplicates,
    findDuplicates,
    findIndexWithHighestNumber,
    flat,
    forEach,
    indexOf,
    indexOfLongestString,
    lengthGreaterOrEqual,
    lengthGreaterThan,
    lengthIs,
    lengthLessOrEqual,
    lengthLessThan,
    map,
    removeDuplicates,
    slice,
    sortByLongestStrings,
    splice,
} from '../Array'
import { PowerAssert } from 'typed-nodejs-assert'
import { Throw } from 'throw-expression'
import { exactly } from '../misc'
import { subtract } from '../Number'
import { TupleOf } from '../../utilityTypes/Array'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('lengthGreaterOrEqual', () => {
    const foo: string[] = []
    // noinspection BadExpressionStatementJS
    foo[0] // $ExpectType string | undefined
    if (lengthGreaterOrEqual(foo, 3)) {
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[2] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[3] // $ExpectType string | undefined
        // noinspection BadExpressionStatementJS
        foo[4] // $ExpectType string | undefined
    }
})

test('lengthGreaterThan', () => {
    const foo: string[] = []
    // noinspection BadExpressionStatementJS
    foo[0] // $ExpectType string | undefined
    if (lengthGreaterThan(foo, 3)) {
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[2] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[3] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[4] // $ExpectType string | undefined
    }
})

// TODO: figure out how to cast it like `lengthGreaterThan` in the else branh on `lengthLessOrEqual` and `lengthLessThan`

test('lengthLessOrEqual', () => {
    const foo: string[] = []
    if (lengthLessOrEqual(foo, 3)) {
        // noinspection BadExpressionStatementJS
        foo
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType string | undefined
        // noinspection BadExpressionStatementJS
        foo[2] // $ExpectType string | undefined
        // @ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '4'.
        // noinspection BadExpressionStatementJS
        foo[4] // error: tuple of length '3' has no element at index '3'
    }
})

test('lengthLessThan', () => {
    const foo: string[] = []
    if (lengthLessThan(foo, 3)) {
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType string | undefined
        // @ts-expect-error TS2339: Property '2' does not exist on type 'TupleOfUpToButNotIncluding '.
        // noinspection BadExpressionStatementJS
        foo[2]
    }
})

test('lengthIs', () => {
    const foo: string[] = []
    // noinspection BadExpressionStatementJS
    foo[0] // $ExpectType string | undefined
    if (lengthIs(foo, 3)) {
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType string
        // noinspection BadExpressionStatementJS
        foo[2] // $ExpectType string
        // @ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '3'.
        // noinspection BadExpressionStatementJS
        foo[3]
    }
})

describe('duplicate functions', () => {
    describe('containsDuplicates', () => {
        test('true', () => assert(containsDuplicates([1, 2, 3, 3])))
        test('false', () => assert(!containsDuplicates(['asdf', 'sdfg', 'dfgh'])))
    })

    test('duplicates', () => assert.deepStrictEqual(findDuplicates([1, 1, 2, 3, 3, 3]), [1, 3]))

    test('removeDuplicates', () =>
        assert.deepStrictEqual(removeDuplicates([1, 1, 2, 3, 3, 3]), [1, 2, 3]))
})

test('concat', () => {
    const value = concat([1, 2, 3], [1, 2, 3, 4]) // $ExpectType [1, 2, 3, 1, 2, 3, 4]
    assert.deepStrictEqual(value, [1, 2, 3, 1, 2, 3, 4])
})

describe('indexOf', () => {
    test('normal', () => {
        const value = indexOf(['foo', 'bar', 'baz'], 'baz') // $ExpectType 2
        assert(value === 2)
    })
    test('union', () => {
        const value = indexOf(['foo', 'bar', 'baz'], 'baz' as 'foo' | 'baz')

        // MY GOD WHY IS THERE NO GOOD WAY TO TEST TYPES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // possible value (just checking for no type error)
        // noinspection BadExpressionStatementJS
        value !== 0
        // @ts-expect-error impossibru value
        // noinspection BadExpressionStatementJS
        value !== 1
        // the actual value
        assert(value === 2)
    })
    test('string', () => {
        const value = indexOf(['foo', 'bar', 'baz'] as string[], 'baz' as string)
        // need to check that the type is number this way instead since ExpectType shits itself on these types
        // noinspection BadExpressionStatementJS
        value === 100
    })
})

describe('flat', () => {
    test('default depth', () => {
        const value = flat([
            ['foo', 'bar'],
            ['baz, qux', ['asdf']],
        ])
        // noinspection BadExpressionStatementJS ExpectType was failing to find the node so have to put it here
        value // $ExpectType ["foo", "bar", "baz, qux", ["asdf"]]
        assert.deepStrictEqual(value, ['foo', 'bar', 'baz, qux', ['asdf']])
    })
    test('deeper', () => {
        const arrayToFlatten = [
            ['foo', 'bar'],
            ['baz, qux', ['asdf', ['asdf']]],
        ] as const

        const flattenedDepth2 = flat(arrayToFlatten, 2) // $ExpectType ["foo", "bar", "baz, qux", "asdf", readonly ["asdf"]]
        assert.deepStrictEqual(flattenedDepth2, ['foo', 'bar', 'baz, qux', 'asdf', ['asdf']])
        const flattenedDepth3 = flat(arrayToFlatten, 3) // $ExpectType ["foo", "bar", "baz, qux", "asdf", "asdf"]
        assert.notDeepStrictEqual(flattenedDepth3, ['foo', 'bar', 'baz, qux', 'asdf', ['asdf']])
    })
})

test('splice', () => {
    const value = splice([1, 2, 3, 4, 5, 6], 2, 3) // $ExpectType [1, 2, 6]
    assert.deepStrictEqual(value, [1, 2, 6])
})

describe('findIndexOfHighestNumber', () => {
    test('returns number', () => {
        const value = findIndexWithHighestNumber(
            ['a', 'foo', 'barbaz', 'qux'],
            (string) => string.length,
        )
        // noinspection BadExpressionStatementJS
        value // $ExpectType number
        assert(value === 2)
    })
    test('empty array', () => {
        const value = findIndexWithHighestNumber([], () => Throw('waaaaaat?'))
        // noinspection BadExpressionStatementJS
        value // $ExpectType undefined
        assert(value === undefined)
    })
})

describe('indexOfLongestString', () => {
    test('known at compiletime', () => {
        const value = indexOfLongestString(['foo', 'barbaz', 'qux']) // $ExpectType 1
        assert(value === 1)
    })
    test('not known at compiletime', () => {
        indexOfLongestString(['foo', 'barbaz', 'qux'] as string[]) // $ExpectType number
    })
})

test('sortByLongestStrings', () => {
    const value = sortByLongestStrings(['foo', 'barbaz', 'foobarbaz', 'a', 'ab']) // $ExpectType ["foobarbaz", "barbaz", "foo", "ab", "a"]
    assert.deepStrictEqual(value, ['foobarbaz', 'barbaz', 'foo', 'ab', 'a'])
})

describe('slice', () => {
    test('no end', () => {
        const value = slice([1, 2, 3, 4, 5, 6], 3) // $ExpectType [4, 5, 6]
        assert.deepStrictEqual(value, [4, 5, 6])
    })
    test('start and end', () => {
        const value = slice([1, 2, 3, 4, 5, 6], 2, 4) // $ExpectType [3, 4]
        assert.deepStrictEqual(value, [3, 4])
    })
    describe('not known at compiletime', () => {
        test('array', () => {
            const value = slice([1, 2, 3, 4, 5, 6] as number[], 2, 4) // $ExpectType number[]
            assert.deepStrictEqual(value, [3, 4])
        })
        test('start', () => {
            const value = slice([1, 2, 3, 4, 5, 6], 2 as number, 4)
            // can't use ExpectType due to unreliabvle positioning of items in unions
            exactly<(1 | 2 | 3 | 4 | 5 | 6)[]>()(value)
        })
    })
})

describe('forEach', () => {
    const values = [1, 2, 3, 4, 5] as const
    test('next/previous', () => {
        forEach(values, (_, index, prev, next) => {
            assert(values[index - 1] === prev())
            assert(values[index + 1] === next())
        })
    })
    test('no undefined when index access with known index', () => {
        forEach(values, (_, index) => {
            if (index !== 0) {
                const value = values[subtract(index, 1)] // $ExpectType 1 | 2 | 3 | 4
                assert([1, 2, 3, 4].includes(value))
            }
        })
    })
    test('not known at compiletime', () => {
        forEach(values as readonly number[], (_, __, prev, next) => {
            prev() // $ExpectType number
            next() // $ExpectType number
        })
    })
})

describe('map', () => {
    const values = [1, 2, 3, 4, 5] as const
    test('fixed length return value', () =>
        // TODO: make it narrow
        exactly(
            ['', ''] as [string, string],
            map(['', ''], (value) => value),
        ))
    test('next/previous', () => {
        exactly<TupleOf<1 | 2 | 3 | 4 | 5, 5>>()(
            map(values, (value, index, prev, next) => {
                assert(values[index - 1] === prev())
                assert(values[index + 1] === next())
                return value
            }),
        )
    })
})

describe('castArray', () => {
    test('already an array', () => {
        exactly([1, 2, 3], castArray([1, 2, 3]))
    })
    test('not an array', () => {
        exactly([1], castArray(1))
    })
})
