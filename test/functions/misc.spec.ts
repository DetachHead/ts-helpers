import {
    New,
    as,
    cast,
    dontNarrow,
    entries,
    exactly,
    hasPropertyPredicate,
    isNullOrUndefined,
    runUntil,
    unsafeCast,
} from '../../src/functions/misc'
import { NonNullish } from '../../src/types/misc'
import { test as test2 } from 'ts-spec'
import { PowerAssert } from 'typed-nodejs-assert'

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

declare module 'ts-spec' {
    interface Config {
        strictOptionalProperties: true
    }
}

describe('exactly' as const, () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment -- this test is for the any type
    const any = undefined as any
    const never = undefined as never
    const number = 1 as number
    const oneOrTwo = 1 as 1 | 2
    const x1AndY2 = { x: 1, y: 2 } as const
    class Class {
        constructor(public a: number) {}
    }
    const instance = new Class(1)

    describe('mixed' as const, () => {
        describe('simple types' as const, () => {
            test2('pass' as const, (t) => t.equal(10 as const)<10>())
            test2('pass2' as const, (t) => t.equal(10 as number)<number>())
            test2('fail' as const, (t) => t.not.equal(10 as const)<number>())
        })
        describe('any and never' as const, () => {
            test2(
                'fail' as const,
                (t) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing any
                    t.not.equal(never)<any>,
            )
            test2('fail' as const, (t) => t.not.equal(any)<never>())
            describe('any' as const, () => {
                /* eslint-disable @typescript-eslint/no-explicit-any -- testing the any type */
                test2('pass' as const, (t) => t.equal(any)<any>())
                test2('fail1' as const, (t) => t.not.equal(number)<any>())
                test2('fail2' as const, (t) => t.not.equal(any)<number>())
                test2('fail3' as const, (t) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- testing any
                    t.not.equal({ value: {} as any })<{ value: number }>(),
                )
                /* eslint-enable @typescript-eslint/no-explicit-any -- testing the any type */
            })
            describe('never' as const, () => {
                test2('pass' as const, (t) => t.equal(never)<never>())
                test2('fail1' as const, (t) => t.not.equal(number)<never>())
                test2('fail2' as const, (t) => t.not.equal(never)<number>())
            })
        })
        describe('undefined, void and null' as const, () => {
            test2('pass' as const, (t) => t.equal(1 as number | undefined)<number | undefined>())
            test2('pass' as const, (t) => t.equal(undefined)<undefined>())
            test2('pass' as const, (t) => t.equal(null)<null>())
            test2('pass' as const, (t) => t.equal(undefined as void)<void>())
            test2('pass' as const, (t) => t.equal((): void => undefined)<() => void>())
            // test2('pass' as const, (t) => {
            //     exactly<string | undefined>()('' as undefined | string)
            //     exactly<undefined>()(undefined)
            //     exactly<null>()(null)
            //     exactly<void>()(undefined as void)
            //     exactly<() => void>()((): void => undefined)
            // })
            describe('fail' as const, () => {
                test2('fail' as const, (t) => t.not.equal('' as string)<string | undefined>())
                test2('fail2' as const, (t) => t.not.equal('' as string)<string | null>())
                test2('fail3' as const, (t) =>
                    t.not.equal('' as unknown as undefined)<string | undefined>(),
                )
                test2('fail4' as const, (t) => t.not.equal(null)<void>())
                test2('fail4' as const, (t) => t.not.equal(null)<undefined>())
                test2('fail4' as const, (t) => t.not.equal(() => undefined)<() => void>())
            })
        })
        describe('unions, intersections and Readonly' as const, () => {
            const asdf: { x: { a: 1; b: 1 } } = {} as never
            describe('pass' as const, () => {
                test2('' as const, (t) => t.equal(oneOrTwo)<1 | 2>())
                test2('' as const, (t) => t.equal(oneOrTwo)<2 | 1>())
                test2('' as const, (t) => t.equal(x1AndY2)<Readonly<{ x: 1 } & { y: 2 }>>())
                test2('' as const, (t) => t.equal(x1AndY2)<Readonly<{ x: 1; y: 2 }>>())
                test2('' as const, (t) => t.equal(asdf)<{ x: { a: 1 } & { b: 1 } }>())
            })
            describe('fail' as const, () => {
                test2('' as const, (t) => t.not.equal(1)<1 | 2>())
                test2('' as const, (t) => t.not.equal(oneOrTwo)<1>())
                test2('' as const, (t) => t.not.equal(1 as 2 | 3)<1>())
                test2('' as const, (t) => t.not.equal(1 as 2 | 3)<1 | 2>())
                test2('' as const, (t) => t.not.equal(x1AndY2)<{ x: 1 } & { y: 2 }>())
                test2('' as const, (t) => t.not.equal(asdf)<{ x: { a: 1 } & { b: 2 } }>())
            })
        })
        describe('functions' as const, () => {
            describe('pass' as const, () => {
                test2('' as const, (t) => t.equal((): 1 => 1)<() => 1>())
            })
            describe('fail' as const, () => {
                test2('' as const, (t) => t.not.equal(() => '')<() => 1>())
                test2('' as const, (t) => t.not.equal((): 1 => 1)<1>())
                test2('' as const, (t) => t.not.equal(1 as const)<() => 1>())
            })
        })
        describe('constructors' as const, () => {
            describe('pass' as const, () => {
                test2('' as const, (t) => t.equal(instance)<Class>())
            })
            describe('fail' as const, () => {
                test2('' as const, (t) => t.not.equal(Class)<Class>())
            })
        })
        test2("can't specify Actual generic" as const, () => {
            // @ts-expect-error see the OnlyInfer type
            exactly<number>()<number>(10 as number)
        })
        describe('optional members' as const, () => {
            test2('' as const, (t) => t.not.equal({} as { a: number; b?: string })<{ a: number }>())
        })
        describe('strings' as const, (t) => {
            describe('case' as const, () => {
                describe('pass' as const, () => {
                    test2('' as const, (t) =>
                        t.not.equal('' as Uppercase<string>)<Lowercase<string>>(),
                    )

                    type Foo<T> = T extends unknown ? T : T
                    exactly<Uppercase<string>>()('' as Foo<Uppercase<string>>)
                })
            })
        })
    })
})

describe('cast' as const, (t) => {
    test2('success' as const, (t) => {
        const foo = 1 as number
        cast(foo, as<1 | 2>)
        exactly<1 | 2>()(foo)
    })
    test2('fail' as const, (t) => {
        const foo = '' as string
        cast(
            foo,
            // @ts-expect-error negative test
            as<1 | 2>,
        )
        exactly<string>()(foo)
    })
})

describe('unsafeCast' as const, (t) => {
    test2('safe' as const, (t) => {
        const foo = 1 as number
        unsafeCast<1 | 2>(foo)
        exactly<1 | 2>()(foo)
    })
    test2('unsafe' as const, (t) => {
        const foo = '' as string
        unsafeCast<1 | 2>(foo)
        exactly<never>()(foo)
    })
})

test2('entries' as const, (t) => {
    exactly(
        [
            ['foo', 1],
            ['bar', 'baz'],
        ] as ['foo' | 'bar', string | number][],
        entries({ foo: 1, bar: 'baz' }),
    )
})

describe('hasPropertyPredicate' as const, (t) => {
    const value = {} as unknown
    describe('inferred' as const, (t) => {
        test2('one value' as const, (t) => {
            if (hasPropertyPredicate(value, 'foo')) exactly<{ foo: unknown }>()(value)
        })
        test2('union' as const, (t) => {
            if (hasPropertyPredicate(value, 'length' as 'length' | 'asdf'))
                exactly<NonNullish>()(value)
        })
        test2('not known at compiletime' as const, (t) => {
            if (hasPropertyPredicate(value, 'length' as string)) exactly<unknown>()(value)
        })
    })
    test2('explicit' as const, (t) => {
        if (hasPropertyPredicate<unknown[]>(value, 'length')) exactly<unknown[]>()(value)
    })
    describe('undefined/null' as const, (t) => {
        test2('undefined' as const, (t) => {
            hasPropertyPredicate(undefined, 'length')
        })
        test2('null' as const, (t) => {
            hasPropertyPredicate(null, 'length')
        })
    })
})

describe('runUntil' as const, (t) => {
    test2('rejects', async () => {
        let isDone = false
        setTimeout(() => (isDone = true), 1000)
        await expect(
            runUntil(() => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)), 100),
        ).rejects.toThrow("runUntil failed because the predicate didn't return true in 100 ms")
    })
    test2('resolves', async () => {
        let isDone = false
        setTimeout(() => (isDone = true), 80)
        await runUntil(() => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)), 100)
    })
})

describe('isNullOrUndefined' as const, (t) => {
    describe('true' as const, (t) => {
        test2('null' as const, (t) => {
            exactly(true, isNullOrUndefined(null))
        })
        test2('undefined' as const, (t) => {
            exactly(true, isNullOrUndefined(undefined))
        })
    })
    test2('false' as const, (t) => {
        exactly(false, isNullOrUndefined('foo'))
    })
    test2('not known at compiletime' as const, (t) => {
        exactly<boolean>()(isNullOrUndefined(1 as unknown))
    })
})

test2('dontNarrow' as const, (t) => {
    const foo = 1 as unknown
    if (dontNarrow(typeof foo === 'number')) {
        exactly<unknown>()(foo)
    }
})

describe('New' as const, (t) => {
    class Foo {
        constructor(public a: number) {}
    }
    test2('positive' as const, (t) => {
        const foo = New(Foo, 1)
        // eslint-disable-next-line @typescript-eslint/ban-types -- Object.constructor's type returns Function so this is unavoidable
        exactly(foo.constructor, Foo as Function & typeof Foo)
        exactly(foo.a, 1 as number)
    })
    test2('negative' as const, (t) => {
        New(
            Foo,
            // @ts-expect-error negative test
            '1',
        )
    })
})
