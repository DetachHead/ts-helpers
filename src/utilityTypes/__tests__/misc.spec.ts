import { NoAny, OnlyInfer } from '../misc'

describe('OnlyInfer', () => {
    test('basic', () => {
        const foo = <T, _ extends OnlyInfer>(value: T): T => value
        // @ts-expect-error specifying generics is banned
        foo<1>(1)
    })
    test('multiple generics', () => {
        const foo = <_ extends OnlyInfer, T1, T2>(_value: T1 & T2): T1 & T2 => _value
        // @ts-expect-error specifying generics is banned
        foo<number, number>(1)
        // @ts-expect-error should still error when you try to specify the NoInfer generic
        foo<number, number, number>(1)
    })
})

test('NoAny', () => {
    const foo = <T extends number>(value: NoAny<T>) => value
    foo(1)
    // @ts-expect-error any is banned
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-argument -- testing any
    foo(1 as any)
})
