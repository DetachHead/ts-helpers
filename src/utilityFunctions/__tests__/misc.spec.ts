import isCI from 'is-ci'
import { exactly, failCI } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('exactly', () => {
    // test data
    const ten = 10
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    const any = undefined as any
    const never = undefined as never
    const number = 1 as number
    const oneAndTwo = 1 as 1 | 2
    const x1AndY2 = { x: 1, y: 2 } as const

    // test simple types
    exactly<number, typeof ten>()
    exactly<10, typeof ten>()

    exactly<number>()(ten)
    exactly<number>()(ten as number)
    exactly<10>()(ten)

    // test never
    exactly<number, never>()
    exactly<never, number>()

    // @ts-expect-error number != never
    exactly<number, typeof never>()
    // @ts-expect-error never != number
    exactly<never>()(number)
    // @ts-expect-error number != never
    exactly<number>()(never)

    // test any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<any, number>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<number, any>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<any, any>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<any>()(number)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<number>()(any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<any>()(any)

    // test any and never
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<any, never>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this test is for the any type
    exactly<never, any>()

    // test unions, intersections and ReadOnly
    exactly<1 | 2, typeof oneAndTwo>()
    // @ts-expect-error 1 | 2 != 1
    exactly<1 | 2, 1>()
    exactly<1 | 2>()(oneAndTwo)
    // @ts-expect-error 1 | 2 != 1
    exactly<1 | 2>()(1)

    exactly<Readonly<{ x: 1 } & { y: 2 }>, typeof x1AndY2>()
    // @ts-expect-error { x: 1 } & { y: 2 } != ReadOnly<{ x: 1 } & { y: 2 }>
    exactly<{ x: 1 } & { y: 2 }, typeof x1AndY2>()

    exactly<Readonly<{ x: 1 } & { y: 2 }>>()(x1AndY2)
    // @ts-expect-error { x: 1 } & { y: 2 } != ReadOnly<{ x: 1 } & { y: 2 }>
    exactly<{ x: 1 } & { y: 2 }>()(x1AndY2)
})

test('failCI', () => {
    console.log({ isCI })
    if (isCI) assert.throws(failCI)
    else assert.doesNotThrow(failCI)
})
