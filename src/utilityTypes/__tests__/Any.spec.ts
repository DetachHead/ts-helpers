import { exactly } from '../../utilityFunctions/misc'
import { Replace, ReplaceRecursive } from '../Any'

describe('Replace', () => {
    test('union', () => {
        exactly<string | symbol | boolean, Replace<string | number | boolean, number, symbol>>()
    })
})

describe('ReplaceRecursive', () => {
    test('primitive', () => {
        exactly<'foo' | 'bar' | 'baz', ReplaceRecursive<'foo' | 'qux' | 'baz', 'qux', 'bar'>>()
    })
    test('array', () => {
        exactly<
            [string, symbol, boolean],
            ReplaceRecursive<[string, number, boolean], number, symbol>
        >()
    })
    test('object', () => {
        exactly<
            { a: number; b: number; c: string },
            ReplaceRecursive<{ a: boolean; b: boolean; c: string }, boolean, number>
        >()
    })
    describe('functions', () => {
        test('normal', () => {
            exactly<
                (a: number) => number,
                ReplaceRecursive<(a: boolean) => boolean, boolean, number>
            >()
        })
        test('this parameter', () => {
            exactly<
                (this: boolean, a: number) => number,
                ReplaceRecursive<(this: string, a: number) => number, string, boolean>
            >()
        })
        test('method (arrow function)', () => {
            exactly<
                { foo: (a: number) => number },
                ReplaceRecursive<{ foo: (a: boolean) => boolean }, boolean, number>
            >()
        })
    })
    test('class', () => {
        exactly<
            {
                new (arg: boolean): { value: boolean; value2: string }
            },
            ReplaceRecursive<
                {
                    new (arg: number): { value: number; value2: string }
                },
                number,
                boolean
            >
        >()
    })
    test('nested', () => {
        exactly<
            {
                foo: (value: 'b', value2: number) => { asdf: number; value: 'b' }
            },
            ReplaceRecursive<
                {
                    foo: (value: 'a', value2: number) => { asdf: number; value: 'a' }
                },
                'a',
                'b'
            >
        >()
    })
})
