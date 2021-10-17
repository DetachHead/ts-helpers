import { entries, hasPropertyPredicate } from '../Any'
import { exactly } from '../misc'

test('entries', () => {
    exactly(
        [
            ['foo', 1],
            ['bar', 'baz'],
        ] as ['foo' | 'bar', string | number][],
        entries({ foo: 1, bar: 'baz' }),
    )
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
    describe('undefined/null', () => {
        test('undefined', () => {
            hasPropertyPredicate(undefined, 'length')
        })
        test('null', () => {
            hasPropertyPredicate(null, 'length')
        })
    })
})
