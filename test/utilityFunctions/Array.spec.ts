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
} from '../../src/utilityFunctions/Array'
import { subtract } from '../../src/utilityFunctions/Number'
import { exactly } from '../../src/utilityFunctions/misc'
import { TupleOf } from '../../src/utilityTypes/Array'
import { Throw, throwIfUndefined } from 'throw-expression'
import { PowerAssert } from 'typed-nodejs-assert'

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
        // the generic gets inferred incorrectly unless you define the variable first
        const value = flat([
            ['foo', 'bar'],
            ['baz, qux', ['asdf']],
        ])
        exactly(['foo', 'bar', 'baz, qux', ['asdf']], value)
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
        const value = sortByLongestStrings(['foo', 'barbaz', 'foobarbaz', 'a', 'ab'])
        exactly(['foobarbaz', 'barbaz', 'foo', 'ab', 'a'], value)
    })
})

describe('slice', () => {
    test('no end', () => {
        const value = slice([1, 2, 3, 4, 5, 6], 3)
        exactly([4, 5, 6], value)
    })
    test('end', () => {
        const value = slice([1, 2, 3, 4, 5, 6], 0, 3)
        exactly([1, 2, 3], value)
    })
    test('start and end', () => {
        const value1 = slice([1, 2, 3, 4, 5, 6], 2, 4)
        exactly([3, 4], value1)
        const value2 = slice([1, 2, 3, 4, 5, 6], 0, 1)
        exactly([1], value2)
    })
    describe('rest', () => {
        test('start, rest end', () => {
            exactly<[2, ...number[]]>()(slice([1, 2, 3] as [1, 2, ...number[]], 1))
        })
        test('start, rest start', () => {
            exactly<[...number[], 1, 2]>()(slice([1, 2, 3] as [...number[], 1, 2], 1))
        })
        test('end, rest end', () => {
            exactly<number[]>()(slice([1, 2, 3] as [1, 2, ...number[]], 0, 1))
        })
        test('end, rest start', () => {
            exactly<number[]>()(slice([1, 2, 3] as [...number[], 1, 2], 0, 1))
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
    test('fixed length return value', () =>
        exactly(
            ['', ''],
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
        const value = castArray([1, 2, 3])
        exactly([1, 2, 3], value)
    })
    test('not an array', () => {
        exactly([1], castArray(1))
    })
})

test('find', async () => {
    const foo = await find([1, 2, 3], (value) => Promise.resolve(value === 3))
    assert(foo?.result === 3)
})
