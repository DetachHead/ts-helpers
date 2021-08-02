import isCI from 'is-ci'
import { exactly, failCI } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

describe('exactly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    const any = undefined as any
    const never = undefined as never
    const number = 1 as number
    const oneOrTwo = 1 as 1 | 2
    const x1AndY2 = { x: 1, y: 2 } as const

    describe('mixed', () => {
        test('it returns the value', () => assert(exactly<1>()(1) === 1))
        describe('simple types', () => {
            test('pass', () => {
                exactly<number>()(10 as number)
                exactly<10>()(10)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<number>()(10)
            })
        })
        describe('any and never', () => {
            test('fail', () => {
                // @ts-expect-error doesn't match
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
                exactly<any>()(never)
                // @ts-expect-error doesn't match
                exactly<never>()(any)
            })
            describe('any', () => {
                /* eslint-disable @typescript-eslint/no-explicit-any -- testing the any type */
                test('pass', () => {
                    exactly<any>()(any)
                })
                test('fail', () => {
                    // @ts-expect-error doesn't match
                    exactly<any>()(number)
                    // @ts-expect-error doesn't match
                    exactly<number>()(any)
                })
                /* eslint-enable @typescript-eslint/no-explicit-any -- testing the any type */
            })
            describe('never', () => {
                test('pass', () => {
                    exactly<never>()(never)
                })
                test('fail', () => {
                    // @ts-expect-error doesn't match
                    exactly<never>()(number)
                    // @ts-expect-error doesn't match
                    exactly<number>()(never)
                })
            })
        })
        describe('unions, intersections and Readonly', () => {
            test('pass', () => {
                exactly<1 | 2>()(oneOrTwo)
                exactly<2 | 1>()(oneOrTwo)
                exactly<Readonly<{ x: 1 } & { y: 2 }>>()(x1AndY2)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<1 | 2>()(1)
                // @ts-expect-error doesn't match
                exactly<1>()(oneOrTwo)
                // @ts-expect-error doesn't match
                exactly<1 | 2>()(1 as 2 | 3)
                // @ts-expect-error doesn't match
                exactly<{ x: 1 } & { y: 2 }>()(x1AndY2)
            })
        })
    })

    describe('types', () => {
        describe('simple types', () => {
            test('matches', () => {
                exactly<10, 10>()
            })
            test("doesn't match", () => {
                // @ts-expect-error doesn't match
                exactly<number, 10>()
            })
        })
        describe('any and never', () => {
            /* eslint-disable @typescript-eslint/no-explicit-any -- testing the any type */
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<any, never>()
                // @ts-expect-error doesn't match
                exactly<never, any>()
            })
            describe('any', () => {
                test('pass', () => {
                    exactly<any, any>()
                })
                test('fail', () => {
                    // @ts-expect-error doesn't match
                    exactly<any, number>()
                    // @ts-expect-error doesn't match
                    exactly<number, any>()
                })
            })
            /* eslint-enable @typescript-eslint/no-explicit-any -- testing the any type */
            describe('never', () => {
                test('pass', () => {
                    exactly<never, never>()
                })
                test('fail', () => {
                    // @ts-expect-error doesn't match
                    exactly<number, never>()
                    // @ts-expect-error doesn't match
                    exactly<never, number>()
                })
            })
        })
        describe('unions, intersections and Readonly', () => {
            test('pass', () => {
                exactly<1 | 2, 1 | 2>()
                exactly<2 | 1, 1 | 2>()
                exactly<Readonly<{ x: 1 } & { y: 2 }>, typeof x1AndY2>()
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<1 | 2, 1>()
                // @ts-expect-error doesn't match
                exactly<1, 1 | 2>()
                // @ts-expect-error doesn't match
                exactly<1 | 2, 2 | 3>()
                // @ts-expect-error doesn't match
                exactly<{ x: 1 } & { y: 2 }, typeof x1AndY2>()
            })
        })
    })
    describe('values', () => {
        describe('simple types', () => {
            test('matches', () => {
                exactly(10, 10)
            })
            test("doesn't match", () => {
                assert.throws(() =>
                    // @ts-expect-error doesn't match
                    exactly(number, 10),
                )
            })
        })
        describe('any and never', () => {
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly(any, never)
                // @ts-expect-error doesn't match
                exactly(never, any)
            })
            describe('any', () => {
                test('pass', () => {
                    exactly(any, any)
                })
                test('fail', () => {
                    assert.throws(() =>
                        // @ts-expect-error doesn't match
                        exactly(any, number),
                    )
                    assert.throws(() =>
                        // @ts-expect-error doesn't match
                        exactly(number, any),
                    )
                })
            })
            describe('never', () => {
                test('pass', () => {
                    exactly(never, never)
                })
                test('fail', () => {
                    assert.throws(() =>
                        // @ts-expect-error doesn't match
                        exactly(number, never),
                    )
                    assert.throws(() =>
                        // @ts-expect-error doesn't match
                        exactly(never, number),
                    )
                })
            })
        })
        describe('unions, intersections and Readonly', () => {
            test('pass', () => {
                exactly(oneOrTwo, oneOrTwo)
                exactly(oneOrTwo as 2 | 1, oneOrTwo)
                exactly(x1AndY2 as Readonly<{ x: 1 } & { y: 2 }>, x1AndY2)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly(oneOrTwo, 1),
                    // @ts-expect-error doesn't match
                    exactly(1, oneOrTwo)
                assert.throws(() =>
                    // @ts-expect-error doesn't match
                    exactly(oneOrTwo, 2 as 1 | 2 | 3),
                )
                // @ts-expect-error doesn't match
                exactly(x1AndY2 as { x: 1 } & { y: 2 }, x1AndY2)
            })
        })
    })
})

test('failCI', () => {
    console.log({ isCI })
    if (isCI) assert.throws(failCI)
    else assert.doesNotThrow(failCI)
})
