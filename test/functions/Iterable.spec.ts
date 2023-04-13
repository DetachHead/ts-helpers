import { find, findAsync } from '../../src/functions/Iterable'
import { ok as assert } from 'assert'
import { describe, test } from 'bun:test'

describe('findAsync', () => {
    test('predicate is a promise', async () => {
        assert(
            (await findAsync(
                (function* () {
                    yield Promise.resolve(1)
                    yield Promise.resolve(2)
                    yield Promise.resolve(3)
                })(),
                (value) => Promise.resolve(value === 3),
            )) === 3,
        )
    })
    // although they behave exactly the same in most cases they use different iterator symbols.
    // see https://tr.javascript.info/async-iterators-generators#async-iterators
    test('async iterable', async () => {
        assert(
            (await findAsync(
                // eslint-disable-next-line @typescript-eslint/require-await -- testing async iterable
                (async function* () {
                    yield Promise.resolve(1)
                    yield Promise.resolve(2)
                    yield Promise.resolve(3)
                })(),
                (value) => value === 2,
            )) === 2,
        )
    })
    test('normal iterable that yields promises', async () => {
        assert(
            (await findAsync(
                (function* () {
                    yield Promise.resolve(1)
                    yield Promise.resolve(2)
                    yield Promise.resolve(3)
                })(),
                (value) => value === 2,
            )) === 2,
        )
    })
})

describe('find', () => {
    test('Array', () => {
        assert(find([1, 2, 3, 4], (value) => value === 3)?.result === 3)
    })
    test('generators', () => {
        assert(
            find(
                (function* () {
                    yield 1
                    yield 2
                    yield 3
                })(),
                (value) => value === 2,
            )?.result === 2,
        )
    })
})
