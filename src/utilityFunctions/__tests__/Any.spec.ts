import { entries, hasPropertyPredicate } from '../Any'
import { exactly } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
import { EvaluateType, Keys } from '../../utilityTypes/Any'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('entries', () => {
    const value = entries({ foo: 1, bar: 'baz' }) // $ExpectType ["foo" | "bar", string | number][]
    assert.deepStrictEqual(value, [
        ['foo', 1],
        ['bar', 'baz'],
    ])
})

describe('hasPropertyPredicate', () => {
    const value = {} as unknown
    describe('inferred', () => {
        test('one value', () => {
            if (hasPropertyPredicate(value, 'foo')) exactly<{ foo: unknown }>()(value)
        })
        test('union', () => {
            if (hasPropertyPredicate(value, 'length' as 'length' | 'asdf')) exactly<{}>()(value)
        })
        test('not known at compiletime', () => {
            if (hasPropertyPredicate(value, 'length' as string)) exactly<unknown>()(value)
        })
    })
    test('explicit', () => {
        if (hasPropertyPredicate<unknown[]>(value, 'length')) exactly<unknown[]>()(value)
    })
})

test('EvaluateType', () => {
    type Entries<T> = EvaluateType<[Keys<T>, T[Keys<T>]][]>
    const value = {} as Entries<{ foo: number; bar: string }>
    // want to remove usages of ExpectType in most places because the exactly function is better as it actually checks
    //  the structure of the types rather than how the compiler represents them. however in this case that's what we want
    //  see https://github.com/JoshuaKGoldberg/eslint-plugin-expect-type/issues/18
    // noinspection BadExpressionStatementJS
    value // $ExpectType ["foo" | "bar", string | number][]
})
