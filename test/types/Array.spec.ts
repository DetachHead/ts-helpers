import { exactly } from '../../src/functions/misc'
import {
    DimensionArray,
    EveryCombination,
    IndexOf,
    RemoveValue,
    SortLongestStrings,
    TupleOf,
    TupleOfUpTo,
} from '../../src/types/Array'

describe('TupleOfUpTo', () => {
    test('type', () => {
        exactly<
            [] | [number] | [number, number] | [number, number, number],
            TupleOfUpTo<number, 3>
        >()
    })
    test('index access', () => {
        const foo = [1, 1, 1] as TupleOfUpTo<number, 3>
        exactly<[] | [number] | [number, number] | [number, number, number]>()(foo)
    })
})

describe('IndexOf', () => {
    test('stack depth', () => {
        exactly<500, IndexOf<[...TupleOf<'hi', 500>, 'bye'], 'bye'>>()
    })
    test('not literals', () => {
        exactly<number, IndexOf<number[], 1>>()
    })
})

test('SortLongestStrings tail-recursive', () => {
    // don't need to compare this type to anything, just making sure it doesn't trigger a stack depth error
    exactly<SortLongestStrings<TupleOf<never, 900>>>()
})

describe('RemoveValue', () => {
    test('normal', () => {
        exactly<['foo', 'baz'], RemoveValue<['foo', 'bar', 'baz'], 'bar'>>()
    })
    test('stack depth', () => {
        exactly<[], RemoveValue<TupleOf<never, 999>, never>>()
    })
})

test('DimensionArray', () => {
    ;['', [[[[[[[[[['']]]]]]]]]], ['']] satisfies DimensionArray<string, 20>
})

test('EveryCombination', () => {
    exactly<
        [1, 2, 3] | [3, 2, 1] | [2, 3, 1] | [2, 1, 3] | [3, 1, 2] | [1, 3, 2],
        EveryCombination<[1, 2, 3]>
    >
})
