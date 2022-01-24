import { entries, hasPropertyPredicate, runUntil } from '../Any'
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

describe('runUntil', () => {
    test('rejects', async () => {
        let isDone = false
        setTimeout(() => (isDone = true), 1000)
        await expect(
            runUntil(
                () => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)),
                (result) => result,
                100,
            ),
        ).rejects.toThrow("runUntil failed because the predicate didn't return true in 100 ms")
    })
    test('resolves', async () => {
        let isDone = false
        setTimeout(() => (isDone = true), 80)
        await runUntil(
            () => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)),
            (result) => result,
            100,
        )
    })
})
