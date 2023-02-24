import { assertType, exactly } from '../../src/functions/misc'
import { Intersection, IsExactOptionalProperty, NoAny, OnlyInfer } from '../../src/types/misc'

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

describe('IsExactOptionalProperty', () => {
    type Foo = { a?: number; b: number | undefined; c: number }
    test('true', () => {
        exactly<true, IsExactOptionalProperty<Foo, 'a'>>()
    })
    test('false', () => {
        exactly<false, IsExactOptionalProperty<Foo, 'b'>>()
        exactly<false, IsExactOptionalProperty<Foo, 'c'>>()
    })
})

// TODO: figure out why these don't work with exactly type
describe('Intersection', () => {
    describe('key type and index signature', () => {
        test('top level', () => {
            interface Foo {
                a: string
            }
            interface Bar {
                [key: string]: 'foo'
            }
            assertType<'foo', Intersection<Foo, Bar>['a']>()
            assertType<'foo', Intersection<Bar, Foo>['a']>()
            assertType<
                'asdf',
                // @ts-expect-error negative test
                Intersection<Foo, Bar>['a']
            >()
            assertType<
                'asdf',
                // @ts-expect-error negative test
                Intersection<Bar, Foo>['a']
            >()
        })
        test('nested', () => {
            interface Foo {
                a: {
                    a: string
                }
            }

            interface Bar {
                a: { [key: string]: 'foo' }
            }
            assertType<'foo', Intersection<Foo, Bar>['a']['a']>()
            assertType<'foo', Intersection<Bar, Foo>['a']['a']>()
            assertType<
                'asdf',
                // @ts-expect-error negative test
                Intersection<Foo, Bar>['a']['a']
            >()
            assertType<
                'asdf',
                // @ts-expect-error negative test
                Intersection<Bar, Foo>['a']['a']
            >()
        })
    })
    describe('normal intersections', () => {
        test('object', () => {
            exactly<{ foo: string; bar: number }, Intersection<{ foo: string }, { bar: number }>>()
        })
        test('non-overlapping', () => {
            exactly<never, Intersection<string, number>>()
        })
        test('unions', () => {
            assertType<('a' | 'b') & ('a' | 'c'), Intersection<'a' | 'b', 'a' | 'c'>>()
            assertType<
                'c',
                // @ts-expect-error negative test
                Intersection<'a' | 'b', 'a' | 'c'>
            >()
        })
    })
})
