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
    mapAsync,
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
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('lengthGreaterOrEqual', () => {
    const foo: string[] = []
    exactly<string | undefined>()(foo[0])
    if (lengthGreaterOrEqual(foo, 3)) {
        exactly<string>()(foo[0])
        exactly<string>()(foo[2])
        exactly<string | undefined>()(foo[3])
        exactly<string | undefined>()(foo[4])
    }
})

test('lengthGreaterThan', () => {
    const foo: string[] = []
    exactly<string | undefined>()(foo[0])
    if (lengthGreaterThan(foo, 3)) {
        exactly<string>()(foo[0])
        exactly<string>()(foo[2])
        exactly<string>()(foo[3])
        exactly<string | undefined>()(foo[4])
    }
})

// TODO: figure out how to cast it like `lengthGreaterThan` in the else branh on `lengthLessOrEqual` and `lengthLessThan`

test('lengthLessOrEqual', () => {
    const foo: string[] = []
    if (lengthLessOrEqual(foo, 3)) {
        exactly<string | undefined>()(foo[2])
        // @ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '4'.
        // noinspection BadExpressionStatementJS
        foo[4] // error: tuple of length '3' has no element at index '3'
    }
})

test('lengthLessThan', () => {
    const foo: string[] = []
    if (lengthLessThan(foo, 3)) {
        exactly<string | undefined>()(foo[0])
        // @ts-expect-error TS2339: Property '2' does not exist on type 'TupleOfUpToButNotIncluding '.
        // noinspection BadExpressionStatementJS
        foo[2]
    }
})

test('lengthIs', () => {
    const foo: string[] = []
    // noinspection BadExpressionStatementJS
    exactly<string | undefined>()(foo[0])
    if (lengthIs(foo, 3)) {
        exactly<string>()(foo[0])
        exactly<string>()(foo[2])
        // @ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '3'.
        // noinspection BadExpressionStatementJS
        foo[3]
    }
})

test('mapAsync', async () => {
    assert.deepStrictEqual(
        await mapAsync(
            [2, 1],
            (value: number) =>
                new Promise<number>((res) => setTimeout(() => res(value), value * 50)),
        ),
        [2, 1],
    )
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
    exactly([1, 2, 3, 1, 2, 3, 4], concat([1, 2, 3], [1, 2, 3, 4]))
})

describe('indexOf', () => {
    test('normal', () => exactly(2, indexOf(['foo', 'bar', 'baz'], 'baz')))
    test('union', () => exactly(2 as 0 | 2, indexOf(['foo', 'bar', 'baz'], 'baz' as 'foo' | 'baz')))
    test('string', () =>
        exactly(2 as number, indexOf(['foo', 'bar', 'baz'] as string[], 'baz' as string)))
})

describe('flat', () => {
    test('default depth', () => {
        exactly(
            ['foo', 'bar', 'baz, qux', ['asdf']],
            flat([
                ['foo', 'bar'],
                ['baz, qux', ['asdf']],
            ]),
        )
    })
    test('deeper', () => {
        const arrayToFlatten = [
            ['foo', 'bar'],
            ['baz, qux', ['asdf', ['asdf']]],
        ] as const
        exactly(['foo', 'bar', 'baz, qux', 'asdf', ['asdf'] as const], flat(arrayToFlatten, 2))
        exactly(['foo', 'bar', 'baz, qux', 'asdf', 'asdf'], flat(arrayToFlatten, 3))
    })
})

test('splice', () => {
    exactly([1, 2, 6], splice([1, 2, 3, 4, 5, 6], 2, 3))
})

describe('findIndexOfHighestNumber', () => {
    test('returns number', () => {
        exactly(
            2 as number,
            findIndexWithHighestNumber(['a', 'foo', 'barbaz', 'qux'], (string) => string.length),
        )
    })
    test('empty array', () => {
        exactly(
            undefined,
            findIndexWithHighestNumber([], () => Throw('waaaaaat?')),
        )
    })
})

describe('indexOfLongestString', () => {
    test('known at compiletime', () => {
        exactly(1, indexOfLongestString(['foo', 'barbaz', 'qux']))
    })
    test('not known at compiletime', () => {
        exactly<number>()(indexOfLongestString(['foo', 'barbaz', 'qux'] as string[]))
    })
})

describe('sortByLongestStrings', () => {
    test('normal', () => {
        exactly(
            ['foobarbaz', 'barbaz', 'foo', 'ab', 'a'],
            sortByLongestStrings(['foo', 'barbaz', 'foobarbaz', 'a', 'ab']),
        )
    })
})

describe('slice', () => {
    test('no end', () => {
        exactly([4, 5, 6], slice([1, 2, 3, 4, 5, 6], 3))
    })
    test('start and end', () => {
        exactly([3, 4], slice([1, 2, 3, 4, 5, 6], 2, 4))
    })
    describe('not known at compiletime', () => {
        test('array', () => {
            exactly<number[]>()(slice([1, 2, 3, 4, 5, 6] as number[], 2, 4))
        })
        test('start', () => {
            const value = slice([1, 2, 3, 4, 5, 6], 2 as number, 4)
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
                const value = values[subtract(index, 1)]
                exactly<1 | 2 | 3 | 4>()(value)
                assert([1, 2, 3, 4].includes(value))
            }
        })
    })
    test('not known at compiletime', () => {
        forEach(values as readonly number[], (_, __, prev, next) => {
            exactly<number>()(prev())
            exactly<number>()(next())
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
