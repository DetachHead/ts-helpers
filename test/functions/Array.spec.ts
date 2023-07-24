import {
    castArray,
    concat,
    containsDuplicates,
    find,
    findDuplicates,
    findIndexWithHighestNumber,
    findNotUndefined,
    findNotUndefinedAsync,
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
} from '../../src/functions/Array'
import { subtract } from '../../src/functions/Number'
import { exactly } from '../../src/functions/misc'
import { TupleOf } from '../../src/types/Array'
import { Throw, throwIfUndefined } from 'throw-expression'
import { PowerAssert } from 'typed-nodejs-assert'
import { Mutable } from 'utility-types'

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
    const result = await mapAsync(
        [2, 1],
        (value: number) => new Promise<number>((res) => setTimeout(() => res(value), value * 50)),
    )
    exactly<[number, number]>()(result)
    assert.deepStrictEqual(result, [2, 1])
})

describe('findNotUndefined', () => {
    describe('callback', () => {
        test('has result', () => {
            exactly(
                1 as number | null | undefined,
                throwIfUndefined(findNotUndefined([undefined, null, 1], (value) => value)).result,
            )
        })
        test('no result', () => {
            assert(findNotUndefined([undefined, null], (value) => value) === undefined)
        })
    })
    describe('no callback', () => {
        test('has result', () => {
            exactly(1 as number, throwIfUndefined(findNotUndefined([undefined, null, 1])).result)
        })
        test('no result', () => {
            assert(findNotUndefined([undefined, null]) === undefined)
        })
    })
})
describe('findNotUndefinedAsync', () => {
    describe('callback', () => {
        test('has result', async () => {
            exactly(
                1 as number | null | undefined,
                throwIfUndefined(
                    await findNotUndefinedAsync([undefined, null, 1], true, (value) =>
                        Promise.resolve(value),
                    ),
                ).result,
            )
        })
        test('no result', async () => {
            assert(
                (await findNotUndefinedAsync([undefined, null], false, (value) =>
                    Promise.resolve(value),
                )) === undefined,
            )
        })
    })
    describe('no callback', () => {
        test('has result', async () => {
            exactly(
                1 as number,
                throwIfUndefined(
                    await findNotUndefinedAsync(
                        [undefined, null, 1].map((value) => Promise.resolve(value)),
                        false,
                    ),
                ).result,
            )
        })
        test('no result', async () => {
            assert((await findNotUndefinedAsync([undefined, null], true)) === undefined)
        })
    })
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
    const expected = [1, 2, 3, 1, 2, 3, 4] as const
    // hack because `as const` creates a readonly array but concat returns a mutable one
    exactly(expected as Mutable<typeof expected>, concat([1, 2, 3], [1, 2, 3, 4]))
})

describe('indexOf', () => {
    test('normal', () => exactly(2, indexOf(['foo', 'bar', 'baz'], 'baz')))
    test('union', () => exactly(2 as 0 | 2, indexOf(['foo', 'bar', 'baz'], 'baz' as 'foo' | 'baz')))
    test('string', () =>
        exactly(2 as number, indexOf(['foo', 'bar', 'baz'] as string[], 'baz' as string)))
})

describe('flat', () => {
    test('default depth', () => {
        const expected = ['foo', 'bar', 'baz, qux', ['asdf']] as const
        exactly(
            expected as Mutable<typeof expected>,
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

        const expected1 = ['foo', 'bar', 'baz, qux', 'asdf', ['asdf']] as const
        exactly(expected1 as Mutable<typeof expected1>, flat(arrayToFlatten, 2))

        const expected2 = ['foo', 'bar', 'baz, qux', 'asdf', 'asdf'] as const
        exactly(expected2 as Mutable<typeof expected2>, flat(arrayToFlatten, 3))
    })
})

describe('splice', () => {
    test('no inserted items', () => {
        const expected = [1, 2, 6] as const
        exactly(expected as Mutable<typeof expected>, splice([1, 2, 3, 4, 5, 6], 2, 3))
    })
    test('insert items', () => {
        const expected = [1, 2, 'a', 'b', 6] as const
        exactly(expected as Mutable<typeof expected>, splice([1, 2, 3, 4, 5, 6], 2, 3, 'a', 'b'))
    })
})

describe('findIndexOfHighestNumber', () => {
    test('returns number', () => {
        exactly(
            2 as number,
            findIndexWithHighestNumber(['a', 'foo', 'barbaz', 'qux'], (string) => string.length),
        )
    })
    test('empty array', () => {
        const value = findIndexWithHighestNumber([], () => Throw('waaaaaat?'))
        exactly(undefined, value)
    })
})

describe('indexOfLongestString', () => {
    test('known at compiletime', () => {
        const value = indexOfLongestString(['foo', 'barbaz', 'qux'])
        exactly(1, value)
    })
    test('not known at compiletime', () => {
        exactly<number>()(indexOfLongestString(['foo', 'barbaz', 'qux'] as string[]))
    })
})

describe('sortByLongestStrings', () => {
    test('normal', () => {
        const expected = ['foobarbaz', 'barbaz', 'foo', 'ab', 'a'] as const
        exactly(
            expected as Mutable<typeof expected>,
            sortByLongestStrings(['foo', 'barbaz', 'foobarbaz', 'a', 'ab']),
        )
    })
})

describe('slice', () => {
    test('no end', () => {
        const expected = [4, 5, 6] as const
        exactly(expected as Mutable<typeof expected>, slice([1, 2, 3, 4, 5, 6], 3))
    })
    test('end', () => {
        const expected = [1, 2, 3] as const
        exactly(expected as Mutable<typeof expected>, slice([1, 2, 3, 4, 5, 6], 0, 3))
    })
    test('start and end', () => {
        const expected1 = [3, 4] as const
        exactly(expected1 as Mutable<typeof expected1>, slice([1, 2, 3, 4, 5, 6], 2, 4))
        const expected2 = [1] as const
        exactly(expected2 as Mutable<typeof expected2>, slice([1, 2, 3, 4, 5, 6], 0, 1))
    })
    describe('rest', () => {
        test('start, rest end', () => {
            exactly<[2, ...number[]]>()(slice([1, 2, 3] as [1, 2, ...number[]], 1))
        })
        test('start, rest start', () => {
            exactly<[...number[], 2, 3]>()(slice([1, 2, 3] as [...number[], 2, 3], 1))
        })
        test('end, rest end', () => {
            exactly<number[]>()(slice([1, 2, 3] as [1, 2, ...number[]], 0, 1))
        })
        test('end, rest start', () => {
            exactly<number[]>()(slice([1, 2, 3] as [...number[], 2, 3], 0, 1))
        })
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
    test('fixed length return value', () => {
        const expected = ['', ''] as const
        exactly(
            expected as Mutable<typeof expected>,
            map(['', ''], (value) => value),
        )
    })
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
        const expected = [1] as const
        exactly(expected as Mutable<typeof expected>, castArray(1))
    })
})

test('find', async () => {
    const foo = await find([1, 2, 3], (value) => Promise.resolve(value === 3))
    assert(foo?.result === 3)
})
