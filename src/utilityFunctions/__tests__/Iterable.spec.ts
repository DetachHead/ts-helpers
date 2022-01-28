import { find, findAsync } from '../Iterable'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

describe('find', () => {
    test('Array', () => {
        assert(find([1, 2, 3, 4], (value) => value === 3) === 3)
    })
    describe('generators', () => {
        test('normal', () => {
            assert(
                find(
                    (function* () {
                        yield 1
                        yield 2
                        yield 3
                    })(),
                    (value) => value === 2,
                ) === 2,
            )
        })
        describe('promises/async', () => {
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
    })
})
