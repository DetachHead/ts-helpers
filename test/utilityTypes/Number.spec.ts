import { exactly } from '../../src/utilityFunctions/misc'
import {
    Add,
    Divide,
    HighestNumber,
    Integer,
    IsGreaterThan,
    Multiply,
    NegativeNumber,
    PositiveNumber,
    Subtract,
} from '../../src/utilityTypes/Number'

test('multiply', () => {
    exactly<4 | 6 | 10 | 15, Multiply<2 | 3, 5 | 2>>()
})

test('add', () => {
    exactly<12 | 15 | 22 | 25, Add<2 | 5, 10 | 20>>()
})

test('subtract', () => {
    exactly<8 | 18 | 7 | 17, Subtract<10 | 20, 2 | 3>>()
})

test('divide', () => {
    exactly<2 | 3 | 6 | 4, Divide<6 | 12, 2 | 3>>()
})

describe('IsGreaterThan', () => {
    test('false', () => {
        exactly<false, IsGreaterThan<6, 7>>()
        exactly<false, IsGreaterThan<6, 6>>()
    })
    test('true', () => {
        exactly<true, IsGreaterThan<7, 6>>()
    })
    test('big numbers', () => {
        exactly<false, IsGreaterThan<4999, 5000>>()
        exactly<true, IsGreaterThan<5001, 5000>>()
    })
})

test('HighestNumber', () => {
    exactly<6, HighestNumber<1 | 3 | 6 | 2>>()
})

describe('Integer', () => {
    const foo = <T extends number>(_num: Integer<T>): void => undefined
    test('pass', () => foo(1))
    test('fail', () =>
        foo(
            // @ts-expect-error negative test
            1.2,
        ))
    test('number', () =>
        foo(
            // @ts-expect-error negative test
            1 as number,
        ))
})

describe('PositiveNumber', () => {
    const foo = <T extends number>(_num: PositiveNumber<T>): void => undefined
    test('pass', () => foo(1))
    test('fail', () =>
        foo(
            // @ts-expect-error negative test
            -1,
        ))
    test('number', () =>
        foo(
            // @ts-expect-error negative test
            1 as number,
        ))
})

describe('NegativeNumber', () => {
    const foo = <T extends number>(_num: NegativeNumber<T>): void => undefined
    test('pass', () => foo(-1))
    test('fail', () =>
        foo(
            // @ts-expect-error negative test
            1,
        ))
    test('number', () =>
        foo(
            // @ts-expect-error negative test
            1 as number,
        ))
})
