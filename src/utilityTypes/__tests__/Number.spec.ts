import {
    Add,
    BinaryToNumber,
    Divide,
    HighestNumber,
    Integer,
    IsGreaterThan,
    Multiply,
    NegativeNumber,
    NumberToBinary,
    PositiveNumber,
    Subtract,
} from '../Number'
import { assertType } from '../../utilityFunctions/misc'

test('multiply', () => {
    assertType<Multiply<2 | 3, 5 | 2>>(4)
    assertType<Multiply<2 | 3, 5 | 2>>(6)
    assertType<Multiply<2 | 3, 5 | 2>>(10)
    assertType<Multiply<2 | 3, 5 | 2>>(15)
    // @ts-expect-error not valid product
    assertType<Multiply<2 | 3, 5 | 2>>(11)
    // @ts-expect-error not valid product
    assertType<Multiply<2 | 3, 5 | 2>>(8)
})

test('add', () => {
    assertType<Add<2 | 5, 10 | 20>>(12)
    assertType<Add<2 | 5, 10 | 20>>(15)
    assertType<Add<2 | 5, 10 | 20>>(22)
    assertType<Add<2 | 5, 10 | 20>>(25)
    // @ts-expect-error not valid sum
    assertType<Add<2 | 5, 10 | 20>>(20)
})

test('subtract', () => {
    assertType<Subtract<10 | 20, 2 | 3>>(8)
    assertType<Subtract<10 | 20, 2 | 3>>(18)
    assertType<Subtract<10 | 20, 2 | 3>>(7)
    assertType<Subtract<10 | 20, 2 | 3>>(17)
    // @ts-expect-error not valid
    assertType<Subtract<10 | 20, 2 | 3>>(16)
})

test('divide', () => {
    assertType<Divide<6 | 12, 2 | 3>>(2)
    assertType<Divide<6 | 12, 2 | 3>>(3)
    assertType<Divide<6 | 12, 2 | 3>>(6)
    assertType<Divide<6 | 12, 2 | 3>>(4)
    // @ts-expect-error not valid quotient
    assertType<Divide<6 | 12, 2 | 3>>(9)
})

describe('IsGreaterThan', () => {
    test('false', () => {
        assertType<IsGreaterThan<6, 7>>(false)
        assertType<IsGreaterThan<6, 6>>(false)
    })
    test('true', () => {
        assertType<IsGreaterThan<7, 6>>(true)
    })
    test('big numbers', () => {
        assertType<IsGreaterThan<4999, 5000>>(false)
        assertType<IsGreaterThan<5001, 5000>>(true)
        // @ts-expect-error wrong value
        assertType<IsGreaterThan<5000, 5000>>(true)
    })
})

test('HighestNumber', () => {
    assertType<HighestNumber<1 | 3 | 6 | 2>>(6)
    assertType<HighestNumber<1 | 3 | 6 | 2>>(
        // @ts-expect-error wrong value
        2,
    )
})

describe('NumberToBinary', () => {
    test('specific value', () => {
        assertType<NumberToBinary<12>>('1100')
        assertType<NumberToBinary<12>>(
            // @ts-expect-error wrong value
            '101010',
        )
    })
    test('number type', () => {
        // just allow any string with numbers in it
        assertType<NumberToBinary<number>>('1010101')
    })
})

describe('BinaryToNumber', () => {
    test('specific value', () => {
        assertType<BinaryToNumber<'10101'>>(21)
        assertType<BinaryToNumber<'11111'>>(
            // @ts-expect-error wrong value
            30,
        )
    })
    test('number type', () => {
        // just allow any number
        assertType<BinaryToNumber<`${bigint}`>>(1 as number)
    })
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
