import { entries, hasPropertyPredicate } from '../Any'
import { exactly } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
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
