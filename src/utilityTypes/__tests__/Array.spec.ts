import { IndexOf, TupleOf, TupleOfUpTo } from '../Array'
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
