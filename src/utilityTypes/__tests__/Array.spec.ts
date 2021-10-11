import { IndexOf, RemoveValue, SortLongestStrings, TupleOf, TupleOfUpTo } from '../Array'
import { exactly } from '../../utilityFunctions/misc'

describe('TupleOfUpTo', () => {
    test('type', () => {
        exactly<
            [] | [number] | [number, number] | [number, number, number],
            TupleOfUpTo<number, 3>
        >()
    })
    test('index access', () => {
        const foo = [1, 1, 1] as TupleOfUpTo<number, 3>
        // noinspection BadExpressionStatementJS
        foo[0] // $ExpectType number | undefined
        // @ts-expect-error array is guaranteed to not have a number at index 3
        // noinspection BadExpressionStatementJS
        foo[3]
    })
})

describe('IndexOf', () =>
    test('stack depth', () => {
        exactly<500, IndexOf<[...TupleOf<'hi', 500>, 'bye'], 'bye'>>()
    }))

test('SortLongestStrings tail-recursive', () => {
    // don't need to compare this type to anything, just making sure it doesn't trigger a stack depth error
    exactly<SortLongestStrings<TupleOf<never, 1000>>>()
})

describe('RemoveValue', () => {
    test('normal', () => {
        exactly<['foo', 'baz'], RemoveValue<['foo', 'bar', 'baz'], 'bar'>>()
    })
    test('stack depth', () => {
        exactly<[], RemoveValue<TupleOf<never, 999>, never>>()
    })
})
