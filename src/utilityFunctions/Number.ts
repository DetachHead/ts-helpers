import _ from 'lodash'
import ordinal from 'ordinal'
import {
    Add,
    Divide,
    IsGreaterOrEqual,
    IsGreaterThan,
    IsLessOrEqual,
    IsLessThan,
    LeadingZeros,
    LeftShift,
    Modulo,
    Multiply,
    Ordinal,
    Power,
    RangeType,
    RightShift,
    Square,
    Subtract,
} from '../utilityTypes/Number'

/**
 * gets a random number in the given range from `Min` to `Max` (inclusive)
 * @returns anumber where the type is a union of the possible numbers
 */
export const random = <Min extends number, Max extends number>(
    min: Min,
    max: Max,
): RangeType<Min, Max> => _.random(min, max) as RangeType<Min, Max>

/**
 * adds two numbers at compiletime
 * @example
 * const foo = add(2, 3)
 * type Foo = typeof foo //5
 */
export const add = <N1 extends number, N2 extends number>(num1: N1, num2: N2): Add<N1, N2> =>
    ((num1 + num2) as unknown) as Add<N1, N2>

/**
 * subtracts two numbers at compiletime
 * @example
 * const foo = subtract(5, 3)
 * type Foo = typeof foo //2
 */
export const subtract = <N1 extends number, N2 extends number>(
    num1: N1,
    num2: N2,
): Subtract<N1, N2> => (num1 - num2) as Subtract<N1, N2>

/**
 * multiplies two numbers at compiletime
 * @example
 * const foo = multiply(2, 3)
 * type Foo = typeof multiply //6
 */
export const multiply = <N1 extends number, N2 extends number>(
    num1: N1,
    num2: N2,
): Multiply<N1, N2> => (num1 * num2) as never

/**
 * divides two numbers at compiletime
 * @example
 * const foo = divide(10, 2)
 * type Foo = typeof foo //5
 */
export const divide = <N1 extends number, N2 extends number>(num1: N1, num2: N2): Divide<N1, N2> =>
    (num1 / num2) as Divide<N1, N2>

export const modulo = <N1 extends number, N2 extends number>(num1: N1, num2: N2): Modulo<N1, N2> =>
    (num1 % num2) as Modulo<N1, N2>

/** raises the value of `Num` to the power of the `PowerOf` parameter, at compiletime. */
export const power = <Num extends number, PowerOf extends number>(
    num: Num,
    powerOf: PowerOf,
): Power<Num, PowerOf> => (num ** powerOf) as never

/** raises the value of `num` to the power of 2, at compiletime. */
export const square = <T extends number>(num: T): Square<T> => power(num, 2)

/**
 * adds leading zeros to the given `number` until it reaches the desired `length`
 * @example
 * const foo = leadingZeros(12, 5) //'00012'
 * const bar = leadingZeros(-12, 5) //'-00012'
 */
export const leadingZeros = <Num extends number, Size extends number>(
    number: Num,
    length: Size,
): LeadingZeros<Num, Size> =>
    (number < 0
        ? `-${(number * -1).toString().padStart(length, '0')}`
        : number.toString().padStart(length, '0')) as never

/** creates a stringified ordinal value for the given number, and at compile-time */
export const ordinalNumber = <T extends number>(num: T): Ordinal<T> => ordinal(num) as never

export const isGreaterThan = <Num1 extends number, Num2 extends number>(
    num1: Num1,
    num2: Num2,
): IsGreaterThan<Num1, Num2> => (num1 > num2) as never

export const isGreaterOrEqual = <Num1 extends number, Num2 extends number>(
    num1: Num1,
    num2: Num2,
): IsGreaterOrEqual<Num1, Num2> => (num1 >= num2) as never

export const isLessThan = <Num1 extends number, Num2 extends number>(
    num1: Num1,
    num2: Num2,
): IsLessThan<Num1, Num2> => (num1 < num2) as never
export const isLessOrEqual = <Num1 extends number, Num2 extends number>(
    num1: Num1,
    num2: Num2,
): IsLessOrEqual<Num1, Num2> => (num1 <= num2) as never

/** shifts the bits of `Num` left by the given `Count`, and at compile-time */
export const leftShift = <Num extends number, Count extends number>(
    num: Num,
    count: Count,
): LeftShift<Num, Count> => (num << count) as never

/** shifts the bits of `Num` right by the given `Count`, and at compile-time */
export const rightShift = <Num extends number, Count extends number>(
    num: Num,
    count: Count,
): RightShift<Num, Count> => (num >> count) as never

type StringifiedNumber = `${number}` | `${'-' | '+' | ''}Infinity`

/**
 * safely converts a string to a number, without any of the wacky behaviour from `Number` and `parseInt`
 * @returns `undefined` if the value isn't a string representation of a number, otherwise returns the number
 * @example
 * toNumber('') //undefined
 * toNumber('1asdf') //undefined
 * toNumber('NaN') //undefined
 * toNumber('12') //12
 * toNumber('Infinity') //Infinity
 */
export const toNumber = <Result extends number, Input extends string>(
    value: Input,
): string extends Input
    ? number | undefined
    : // TODO: don't widen the type to number when the value is a literal known at compiletime. eg. toNumber('12') should have type `12`, not `number`
    Input extends `${Result}` | StringifiedNumber
    ? Result
    : undefined => {
    if (value === '') return undefined as never
    const result = Number(value)
    if (isNaN(result)) return undefined as never
    return result as never
}
