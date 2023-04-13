import {
    New,
    as,
    dontNarrow,
    entries,
    exactly,
    hasPropertyPredicate,
    isNullOrUndefined,
    narrow,
    narrowCast,
    optionalProperties,
    runUntil,
    unsafeNarrow,
} from '../../src/functions/misc'
import { NonNullish } from '../../src/types/misc'
import { PowerAssert } from 'typed-nodejs-assert'

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

describe('exactly', () => {
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

    describe('mixed', () => {
        test('it returns the value', () =>
            assert(
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- testing
                exactly<1>()(1) === 1,
            ))
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
                    // @ts-expect-error doesn't match
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- testing the any type
                    exactly<{ value: number }>()({ value: {} as any })
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
        describe('undefined, void and null', () => {
            test('pass', () => {
                exactly<string | undefined>()('' as undefined | string)
                exactly<undefined>()(undefined)
                exactly<null>()(null)
                exactly<void>()(undefined as void)
                exactly<() => void>()((): void => undefined)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<string | undefined>()('' as string)
                // @ts-expect-error doesn't match
                exactly<string | null>()('' as string)
                // @ts-expect-error doesn't match
                exactly<string | undefined>()('' as unknown as undefined)
                // @ts-expect-error doesn't match
                exactly<void>()(null)
                // @ts-expect-error doesn't match
                exactly<undefined>()(null)
                // @ts-expect-error doesn't match
                exactly<() => void>()(() => undefined)
            })
        })
        describe('unions, intersections and Readonly', () => {
            test('pass', () => {
                exactly<1 | 2>()(oneOrTwo)
                exactly<2 | 1>()(oneOrTwo)
                exactly<Readonly<{ x: 1 } & { y: 2 }>>()(x1AndY2)
                exactly<Readonly<{ x: 1; y: 2 }>>()(x1AndY2)
                // @ts-expect-error xfail https://github.com/DetachHead/ts-helpers/issues/128
                exactly<{ x: { a: 1 } & { b: 1 } }>()({} as { x: { a: 1; b: 1 } })
                // @ts-expect-error xfail https://github.com/DetachHead/ts-helpers/issues/238
                exactly<{ c: 1 } | { c: 1 }>({ c: 1 })
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
                // @ts-expect-error doesn't match
                exactly<{ x: { a: 1 } & { b: 2 } }>()({} as { x: { a: 1; b: 1 } })
            })
        })
        describe('functions', () => {
            test('pass', () => {
                exactly<() => 1>()((): 1 => 1)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<() => 1>()(() => '')
                // @ts-expect-error doesn't match
                exactly<1>()(() => 1)
                // @ts-expect-error doesn't match
                exactly<() => 1>()(1)
            })
        })
        describe('constructors', () => {
            test('pass', () => {
                exactly<Class>()(instance)
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<Class>()(Class)
            })
        })
        test("can't specify Actual generic", () => {
            // @ts-expect-error see the OnlyInfer type
            exactly<number>()<number>(10 as number)
        })
        test('optional members', () => {
            // @ts-expect-error doesn't match
            exactly<{ a: number }>()({} as { a: number; b?: string })
        })
        describe('strings', () => {
            describe('case', () => {
                test('pass', () => {
                    exactly<Uppercase<string>>()('' as Uppercase<string>)

                    type Foo<T> = T extends unknown ? T : T
                    exactly<Uppercase<string>>()('' as Foo<Uppercase<string>>)
                })
                test('fail', () => {
                    // @ts-expect-error doesn't match
                    exactly<Uppercase<string>>()('' as Lowercase<string>)
                })
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
                    // @ts-expect-error doesn't match
                    exactly<{ value: number }, { value: any }>()
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
                exactly<{ x: 1 } & { y: 2 }, { x: 1; y: 2 }>()
                // eslint-disable-next-line @typescript-eslint/ban-types -- testing this
                exactly<{ x: 1; y: 2 }, { x: 1; y: 2 } & {}>()

                // https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-778623742
                // eslint-disable-next-line @typescript-eslint/ban-types -- testing this
                exactly<number & {}, number>()
                // eslint-disable-next-line @typescript-eslint/ban-types -- testing this
                exactly<1 | (number & {}), number>()
                // eslint-disable-next-line @typescript-eslint/ban-types -- testing this
                exactly<undefined & {}, never>()
                exactly<NonNullish, NonNullish>()
                // idk why this works now as of ts 4.8, it should fail due to https://github.com/DetachHead/ts-helpers/issues/128
                // since it works now you'd expect exactly<number & {}, number>() to work as well without the {} workaround in
                // FunctionComparisonEquals, but it doesn't ????
                // eslint-disable-next-line @typescript-eslint/ban-types -- testing this
                exactly<{ a: 1 & {} }, { a: 1 }>()
                exactly<
                    // @ts-expect-error xfail https://github.com/DetachHead/ts-helpers/issues/128
                    { a: { foo: number; bar: number } },
                    { a: { foo: number } & { bar: number } }
                >()
                // @ts-expect-error xfail https://github.com/DetachHead/ts-helpers/issues/238
                exactly<{ c: 1 } | { c: 1 }, { c: 1 }>()
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
                // @ts-expect-error doesn't match
                exactly<{ x: 1 } & { y: 2 }, { x: 1; y: 2 } & { z: 2 }>()
                // @ts-expect-error doesn't match - making sure EqualsWrapped doesn't cause false negatives
                exactly<NonNullish, never>()
                // @ts-expect-error doesn't match
                exactly<{ x: { a: 1 } & { b: 2 } }, { x: { a: 1; b: 1 } }>()
            })
        })
        describe('functions', () => {
            test('pass', () => {
                exactly<() => 1, () => 1>()
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<() => 1, () => ''>()
                // @ts-expect-error doesn't match
                exactly<1, () => 1>()
                // @ts-expect-error doesn't match
                exactly<() => 1, 1>()
            })
            // https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-568233987
            describe('overloads', () => {
                test('pass', () => {
                    exactly<
                        { (x: 0, y: null): void; (x: number, y: null): void },
                        { (x: number, y: null): void; (x: 0, y: null): void }
                    >()
                })
                test('fail', () => {
                    exactly<
                        // @ts-expect-error doesn't match
                        { (x: 0, y: null): void; (x: number, y: null): void },
                        { (x: number, y: null): void; (x: 0, y: undefined): void }
                    >()
                    // xfail https://github.com/DetachHead/ts-helpers/issues/127
                    exactly<() => number, (a?: number) => number>()
                })
            })
            test('intersections', () => {
                type Function1 = (x: 0, y: null) => void
                type Function2 = (x: number, y: string) => void

                exactly<Function1 & Function2, Function2 & Function1>()
            })
        })
        describe('constructors', () => {
            test('pass', () => {
                exactly<Class, typeof instance>()
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<Class, typeof Class>()
            })
        })
        describe('undefined, void and null', () => {
            test('pass', () => {
                exactly<string | undefined, undefined | string>()
                exactly<undefined, undefined>()
                exactly<null, null>()
                exactly<void, void>()
                exactly<() => void, () => void>()
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly<string | undefined, string>()
                // @ts-expect-error doesn't match
                exactly<string, string | undefined>()
                // @ts-expect-error doesn't match
                exactly<void, null>()
                // @ts-expect-error doesn't match
                exactly<undefined, null>()
                // @ts-expect-error doesn't match
                exactly<() => void, () => undefined>()
            })
        })
        test('arrays/tuples', () => {
            // @ts-expect-error doesn't match
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- testing the any type
            exactly<[any, number], [number, any]>()
        })
        test('optional members', () => {
            // @ts-expect-error doesn't match
            exactly<{ a: number }, { a: number; b?: string }>()
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
            /* eslint-disable @typescript-eslint/no-unsafe-argument -- testing the any type */
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
                    // @ts-expect-error doesn't match
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- testing the any type
                    assert.throws(() => exactly({ value: 1 }, { value: any }))
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
            /* eslint-enable @typescript-eslint/no-unsafe-argument -- testing the any type */
        })
        describe('unions, intersections and Readonly', () => {
            test('pass', () => {
                exactly(oneOrTwo, oneOrTwo)
                exactly(x1AndY2 as Readonly<{ x: 1 } & { y: 2 }>, x1AndY2)
                // @ts-expect-error xfail https://github.com/DetachHead/ts-helpers/issues/128
                exactly({} as { x: { a: 1 } & { b: 2 } }, {} as { x: { a: 1; b: 2 } })
                //  https://github.com/DetachHead/ts-helpers/issues/238 (idk why it works on value form tho)
                exactly({ c: 1 } as { c: 1 } | { c: 1 }, { c: 1 } as { c: 1 })
            })
            test('fail', () => {
                // @ts-expect-error doesn't match
                exactly(oneOrTwo, 1)
                // @ts-expect-error doesn't match
                exactly(1, oneOrTwo)
                assert.throws(() =>
                    // @ts-expect-error doesn't match
                    exactly(oneOrTwo, 2 as 1 | 2 | 3),
                )
                // @ts-expect-error doesn't match
                exactly(x1AndY2 as { x: 1 } & { y: 2 }, x1AndY2)
                // @ts-expect-error doesn't match
                exactly({} as { x: { a: 1 } & { b: 2 } }, {} as { x: { a: 1; b: 1 } })
            })
        })
        test("can't specify the generics", () => {
            // @ts-expect-error see the OnlyInfer type
            exactly<1 | 2, 1 | 2>(oneOrTwo, oneOrTwo)
        })
        test('optional members', () => {
            // @ts-expect-error doesn't match
            exactly({} as { a: number; b?: string }, {} as { a: number })
        })
        describe('functions', () => {
            const fn1 = () => 1
            const fn2 = () => ''
            test('pass', () => {
                exactly(fn1, fn1)
            })
            test('fail', () => {
                assert.throws(() => {
                    // xfail
                    exactly(fn1, fn2)
                })
                assert.throws(() => {
                    // @ts-expect-error doesn't match
                    exactly(1, fn1)
                })
                assert.throws(() => {
                    // xfail
                    exactly(() => 1, 1)
                })
            })
        })
        describe('constructors', () => {
            test('pass', () => {
                exactly(Class, Class)
            })
            test('fail', () => {
                // xfail because constructor isn't typed properly (but true at runtime)
                exactly(Class, instance.constructor)
                assert.throws(() => {
                    // xfail because constructor isn't typed properly (false at runtime)
                    exactly(Class, Class.constructor)
                })
            })
        })
    })
})

describe('narrow', () => {
    test('success', () => {
        const foo = 1 as number
        narrow(foo, as<1 | 2>)
        exactly<1 | 2>()(foo)
    })
    test('fail', () => {
        const foo = '' as string
        narrow(
            foo,
            // @ts-expect-error negative test
            as<1 | 2>,
        )
        exactly<string>()(foo)
    })
})

describe('unsafeNarrow', () => {
    test('safe', () => {
        const foo = 1 as number
        unsafeNarrow<1 | 2>(foo)
        exactly<1 | 2>()(foo)
    })
    test('unsafe', () => {
        const foo = '' as string
        unsafeNarrow<1 | 2>(foo)
        exactly<never>()(foo)
    })
})

describe('narrowCast', () => {
    test('safe', () => {
        const foo = 1 as number | string
        const bar = narrowCast(foo, as<number | boolean>)
        exactly<number>()(bar)
    })
    test('unsafe', () => {
        const foo = 1 as number | string
        const bar = narrowCast(foo, as<boolean>)
        exactly<never>()(bar)
    })
})

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
            if (hasPropertyPredicate(value, 'length' as 'length' | 'asdf'))
                exactly<NonNullish>()(value)
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
            runUntil(() => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)), 100),
        ).rejects.toThrow("runUntil failed because the predicate didn't return true in 100 ms")
    })
    test('resolves', async () => {
        let isDone = false
        setTimeout(() => (isDone = true), 80)
        await runUntil(() => new Promise<boolean>((res) => setTimeout(() => res(isDone), 10)), 100)
    })
})

describe('isNullOrUndefined', () => {
    describe('true', () => {
        test('null', () => {
            exactly(true, isNullOrUndefined(null))
        })
        test('undefined', () => {
            exactly(true, isNullOrUndefined(undefined))
        })
    })
    test('false', () => {
        exactly(false, isNullOrUndefined('foo'))
    })
    test('not known at compiletime', () => {
        exactly<boolean>()(isNullOrUndefined(1 as unknown))
    })
})

test('dontNarrow', () => {
    const foo = 1 as unknown
    if (dontNarrow(typeof foo === 'number')) {
        exactly<unknown>()(foo)
    }
})

describe('New', () => {
    class Foo {
        constructor(public a: number) {}
    }
    test('positive', () => {
        const foo = New(Foo, 1)
        // eslint-disable-next-line @typescript-eslint/ban-types -- Object.constructor's type returns Function so this is unavoidable
        exactly(foo.constructor, Foo as Function & typeof Foo)
        exactly(foo.a, 1 as number)
    })
    test('negative', () => {
        New(
            Foo,
            // @ts-expect-error negative test
            '1',
        )
    })
})

describe('optionalProperties', () => {
    describe('object', () => {
        test('top level', () => {
            exactly(
                { a: 1 } as { a: number; b?: string },
                optionalProperties<{ a: number; b?: string | undefined }>({ a: 1, b: undefined }),
            )
        })
        test('nested', () => {
            exactly(
                // @ts-expect-error xfail TODO: figure out why exactly doesn't work on nested ToExactOptionalProperties types
                { a: { a: 1 } } as { a: { a: number; b?: string } },
                optionalProperties<{ a: { a: number; b?: string | undefined } }>({
                    a: { a: 1, b: undefined },
                }),
            )
        })
    })
    test('array', () => {
        exactly(
            { a: [{ a: 1 }] } as { a: [{ a: number; b?: string }] },
            // @ts-expect-error xfail TODO: figure out why exactly doesn't work on arrays in ToExactOptionalProperties
            optionalProperties<{ a: [{ a: number; b?: string | undefined }] }>({
                a: [{ a: 1, b: undefined }],
            }),
        )
    })
    test('real world example', () => {
        interface Foo {
            a: number
            b?: string
        }
        optionalProperties({a: 1, b: Math.random() === 1? '': undefined}) satisfies Foo
    })
})
