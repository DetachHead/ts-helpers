import { assertType, exactly } from '../../src/functions/misc'
import {
    CheckNever,
    Intersection,
    IsExactOptionalProperty,
    NoAny,
    OnlyInfer,
    OptionalBy,
    OptionalProperties,
    OptionalRecursive,
    ReplaceValuesRecursive,
    RequiredBy,
    RequiredProperties,
    RequiredRecursive,
    ToExactOptionalProperties,
} from '../../src/types/misc'

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

describe('CheckNever', () => {
    test('yes never', () => {
        exactly<never, CheckNever<number & { a: string }>>()
        exactly<never, CheckNever<number & string>>()
    })
    test('no never', () => {
        exactly<{ a: string }, CheckNever<{ a: string }>>()
        exactly<string, CheckNever<string>>()
    })
    test('union', () => {
        exactly<
            { a: string } & { b: number },
            CheckNever<({ a: string } & { b: number }) | ({ a: string } & string)>
        >()
        exactly<string, CheckNever<string>>()
    })
})

// TODO: figure out why these don't work with exactly type
describe('Intersection', () => {
    describe('key type and index signature', () => {
        describe('top level', () => {
            describe('index access type is narrower', () => {
                interface Foo {
                    a: string
                }
                interface Bar {
                    [key: string]: 'foo'
                }
                test('normal', () => {
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
                test('distributive', () => {
                    assertType<'foo', Intersection<Foo | number, Bar>['a']>()
                    assertType<'foo', Intersection<Bar, Foo | number>['a']>()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Foo | number, Bar>['a']
                    >()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Bar, Foo | number>['a']
                    >()
                })
            })
            describe('index access type is wider', () => {
                interface Foo {
                    a: 'foo'
                }
                interface Bar {
                    [key: string]: string
                }
                test('normal', () => {
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
                test('distributive', () => {
                    assertType<'foo', Intersection<Foo | number, Bar>['a']>()
                    assertType<'foo', Intersection<Bar, Foo | number>['a']>()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Foo | number, Bar>['a']
                    >()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Bar, Foo | number>['a']
                    >()
                })
            })
        })
        describe('nested', () => {
            describe('index access type is narrower', () => {
                interface Foo {
                    a: {
                        a: string
                    }
                }

                interface Bar {
                    a: { [key: string]: 'foo' }
                }
                test('normal', () => {
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
                test('distributive', () => {
                    assertType<'foo', Intersection<Foo | number, Bar>['a']['a']>()
                    assertType<'foo', Intersection<Bar, Foo | number>['a']['a']>()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Foo | number, Bar>['a']['a']
                    >()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Bar, Foo | number>['a']['a']
                    >()
                })
            })
            describe('index access type is wider', () => {
                interface Foo {
                    a: {
                        a: 'foo'
                    }
                }

                interface Bar {
                    a: { [key: string]: string }
                }
                test('normal', () => {
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
                test('distributive', () => {
                    assertType<'foo', Intersection<Foo | number, Bar>['a']['a']>()
                    assertType<'foo', Intersection<Bar, Foo | number>['a']['a']>()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Foo | number, Bar>['a']['a']
                    >()
                    assertType<
                        'asdf',
                        // @ts-expect-error negative test
                        Intersection<Bar, Foo | number>['a']['a']
                    >()
                })
            })
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

describe('RequiredProperties', () => {
    test('StrictOptionalProperties true', () => {
        exactly<
            { foo: string | undefined; bar: string | undefined },
            RequiredProperties<{ foo?: string | undefined; bar?: string | undefined }, true>
        >()
    })
    test('StrictOptionalProperties false', () => {
        exactly<
            { foo: string; bar: string },
            RequiredProperties<{ foo?: string | undefined; bar?: string | undefined }, false>
        >()
    })
})

describe('RequiredBy', () => {
    test('StrictOptionalProperties true', () => {
        exactly<
            { foo: string | undefined; bar?: string | undefined },
            RequiredBy<{ foo?: string | undefined; bar?: string | undefined }, 'foo', true>
        >()
    })
    test('StrictOptionalProperties false', () => {
        exactly<
            { foo: string; bar?: string | undefined },
            RequiredBy<{ foo?: string | undefined; bar?: string | undefined }, 'foo', false>
        >()
    })
})

describe('RequiredRecursive', () => {
    describe('top level', () => {
        test('StrictOptionalProperties true', () => {
            exactly<
                { foo: string | undefined; bar: string | undefined },
                RequiredRecursive<{ foo?: string | undefined; bar?: string | undefined }, true>
            >()
        })
        test('StrictOptionalProperties false', () => {
            exactly<
                { foo: string; bar: string },
                RequiredRecursive<{ foo?: string | undefined; bar?: string | undefined }, false>
            >()
        })
    })
    describe('nested', () => {
        describe('StrictOptionalProperties true', () => {
            test('normal', () => {
                exactly<
                    { a: { foo: string | undefined; bar: string | undefined } },
                    RequiredRecursive<
                        { a?: { foo?: string | undefined; bar?: string | undefined } },
                        true
                    >
                >()
                exactly<
                    { a: { foo: string | undefined; bar: string | undefined } | undefined },
                    RequiredRecursive<
                        { a?: { foo?: string | undefined; bar?: string | undefined } | undefined },
                        true
                    >
                >()
            })
            test('union', () => {
                exactly<
                    { a: number; b: { a: string | undefined } | { b: string | undefined } },
                    RequiredRecursive<
                        { a: number; b: { a?: string | undefined } | { b?: string | undefined } },
                        true
                    >
                >
            })
        })
        describe('StrictOptionalProperties false', () => {
            test('normal', () => {
                exactly<
                    { a: { foo: string; bar: string } },
                    RequiredRecursive<
                        { a?: { foo?: string | undefined; bar?: string | undefined } },
                        false
                    >
                >()
                exactly<
                    { a: { foo: string; bar: string } },
                    RequiredRecursive<
                        { a?: { foo?: string | undefined; bar?: string | undefined } | undefined },
                        false
                    >
                >()
            })
            test('union', () => {
                exactly<
                    { a: number; b: { a: string } | { b: string } },
                    RequiredRecursive<
                        { a: number; b: { a?: string | undefined } | { b?: string | undefined } },
                        false
                    >
                >
            })
        })
    })
})

describe('OptionalProperties', () => {
    test('StrictOptionalProperties true', () => {
        exactly<
            { foo?: string; bar?: string },
            OptionalProperties<{ foo: string; bar: string }, true>
        >()
    })
    test('StrictOptionalProperties false', () => {
        exactly<
            { foo?: string | undefined; bar?: string | undefined },
            OptionalProperties<{ foo: string; bar: string }, false>
        >()
    })
})

describe('OptionalBy', () => {
    test('StrictOptionalProperties true', () => {
        exactly<
            { foo?: string | undefined; bar: string | undefined },
            OptionalBy<{ foo: string | undefined; bar: string | undefined }, 'foo', true>
        >()
    })
    test('StrictOptionalProperties false', () => {
        exactly<
            { foo?: string | undefined; bar: string },
            OptionalBy<{ foo: string; bar: string }, 'foo', false>
        >()
    })
})

describe('OptionalRecursive', () => {
    describe('top level', () => {
        test('StrictOptionalProperties true', () => {
            exactly<
                { foo?: string; bar?: string | undefined },
                OptionalRecursive<{ foo: string; bar: string | undefined }, true>
            >()
        })
        test('StrictOptionalProperties false', () => {
            exactly<
                { foo?: string | undefined; bar?: string | undefined },
                OptionalRecursive<{ foo: string; bar: string }, false>
            >()
        })
    })
    describe('nested', () => {
        describe('StrictOptionalProperties true', () => {
            test('normal', () => {
                exactly<
                    { a?: { foo?: string | undefined; bar?: string | undefined } },
                    OptionalRecursive<
                        { a: { foo: string | undefined; bar: string | undefined } },
                        true
                    >
                >()
                exactly<
                    { a?: { foo?: string | undefined; bar?: string | undefined } | undefined },
                    OptionalRecursive<
                        { a: { foo: string | undefined; bar: string | undefined } | undefined },
                        true
                    >
                >()
            })
            test('union', () => {
                exactly<
                    { a?: number; b?: { a?: string | undefined } | { b?: string | undefined } },
                    OptionalRecursive<
                        { a: number; b: { a: string | undefined } | { b: string | undefined } },
                        true
                    >
                >
            })
        })
        describe('StrictOptionalProperties false', () => {
            test('normal', () => {
                exactly<
                    { a?: { foo?: string | undefined; bar?: string | undefined } | undefined },
                    OptionalRecursive<{ a: { foo: string; bar: string } }, false>
                >()
            })
            test('union', () => {
                exactly<
                    {
                        a?: number | undefined
                        b?: { a?: string | undefined } | { b?: string | undefined } | undefined
                    },
                    OptionalRecursive<{ a: number; b: { a: string } | { b: string } }, false>
                >
            })
        })
    })
})
describe('ReplaceValuesRecursive', () => {
    test('top level', () => {
        exactly<
            { a: number; b: string },
            ReplaceValuesRecursive<{ a: number; b: boolean }, boolean, string>
        >
    })
    test('nested', () => {
        exactly<
            { a: number; b: { a: number; b: string } },
            ReplaceValuesRecursive<{ a: number; b: { a: number; b: boolean } }, boolean, string>
        >
    })
    test('object type', () => {
        exactly<
            { a: number; b: string },
            ReplaceValuesRecursive<{ a: number; b: Date }, Date, string>
        >
    })
    test('top level array', () => {
        exactly<[string, number], ReplaceValuesRecursive<[boolean, number], boolean, string>>
    })
    test('nested array', () => {
        exactly<
            { a: number; b: [string, number] },
            ReplaceValuesRecursive<{ a: number; b: [boolean, number] }, boolean, string>
        >
    })
    test('union', () => {
        exactly<
            { a: number; b: string | undefined },
            ReplaceValuesRecursive<{ a: number; b: boolean | undefined }, boolean, string>
        >
    })
    test('optional', () => {
        exactly<
            { a: number; b?: string },
            ReplaceValuesRecursive<{ a: number; b?: boolean }, boolean, string>
        >
    })
    test('union and nested', () => {
        exactly<
            { a: { a: string } | string },
            ReplaceValuesRecursive<{ a: { a: number } | number }, number, string>
        >
    })
    test('optional and nested', () => {
        exactly<
            { a?: { a: string } },
            ReplaceValuesRecursive<{ a?: { a: number } }, number, string>
        >
    })
})

describe('ToExactOptionalProperties', () => {
    test('top level', () => {
        exactly<
            { a?: string; b: number | undefined },
            ToExactOptionalProperties<{ a?: string | undefined; b: number | undefined }>
        >()
    })
    test('nested', () => {
        // TODO: figure out why exactly doesn't work here, these types are equal as far as i can tell
        assertType<
            { a: { a?: string; b: number | undefined } },
            ToExactOptionalProperties<{ a: { a?: string | undefined; b: number | undefined } }>
        >()
        assertType<
            ToExactOptionalProperties<{ a: { a?: string | undefined; b: number | undefined } }>,
            { a: { a?: string; b: number | undefined } }
        >()
    })
    test('array', () => {
        assertType<
            [{ a?: string; b: number | undefined }],
            // @ts-expect-error xfail TODO: whats going on here? the type is correct
            ToExactOptionalProperties<[{ a?: string | undefined; b: number | undefined }]>
        >()
        assertType<
            ToExactOptionalProperties<[{ a?: string | undefined; b: number | undefined }]>,
            [{ a?: string; b: number | undefined }]
        >()
        exactly<
            [{ a?: string; b: number | undefined }][0],
            ToExactOptionalProperties<[{ a?: string | undefined; b: number | undefined }]>[0]
        >()
    })
})
