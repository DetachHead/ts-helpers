import _ from 'lodash'
import ordinal from 'ordinal'
import {
  Add,
  Divide,
  IsGreaterThan,
  LeadingZeros,
  Modulo,
  Multiply,
  Ordinal,
  Subtract,
} from '../utilityTypes/Number'
import { RangeType } from '../utilityTypes/Number'
import { toStringType } from './misc'
import { padStart } from './String'

/**
 * gets a random number in the given range from `Min` to `Max` (inclusive)
 * @returns anumber where the type is a union of the possible numbers
 */
export function random<Min extends number, Max extends number>(
  min: Min,
  max: Max,
): RangeType<Min, Max> {
  return _.random(min, max) as RangeType<Min, Max>
}

/**
 * adds two numbers at compiletime
 * @example
 * const foo = add(2, 3)
 * type Foo = typeof foo //5
 */
export function add<N1 extends number, N2 extends number>(num1: N1, num2: N2): Add<N1, N2> {
  return ((num1 + num2) as unknown) as Add<N1, N2>
}

/**
 * subtracts two numbers at compiletime
 * @example
 * const foo = subtract(5, 3)
 * type Foo = typeof foo //2
 */
export function subtract<N1 extends number, N2 extends number>(
  num1: N1,
  num2: N2,
): Subtract<N1, N2> {
  return (num1 - num2) as Subtract<N1, N2>
}

/**
 * multiplies two numbers at compiletime
 * @example
 * const foo = multiply(2, 3)
 * type Foo = typeof multiply //6
 */
export function multiply<N1 extends number, N2 extends number>(
  num1: N1,
  num2: N2,
): Multiply<N1, N2> {
  return (num1 * num2) as never
}

/**
 * divides two numbers at compiletime
 * @example
 * const foo = divide(10, 2)
 * type Foo = typeof foo //5
 */
export function divide<N1 extends number, N2 extends number>(num1: N1, num2: N2): Divide<N1, N2> {
  return (num1 / num2) as Divide<N1, N2>
}

export function modulo<N1 extends number, N2 extends number>(num1: N1, num2: N2): Modulo<N1, N2> {
  return (num1 % num2) as Modulo<N1, N2>
}

/**
 * adds leading zeros to the given `number` until it reaches the desired `length`
 * @example
 * const foo = leadingZeros(12, 5) //'00012'
 * const bar = leadingZeros(-12, 5) //'-00012'
 */
export function leadingZeros<Num extends number, Size extends number>(
  number: Num,
  length: Size,
): LeadingZeros<Num, Size> {
  return (number < 0
    ? `-${padStart(toStringType(number * -1), length, '0')}`
    : padStart(toStringType(number), length, '0')) as never
}

/** creates a stringified ordinal value for the given number, and at compile-time */
export function ordinalNumber<T extends number>(num: T): Ordinal<T> {
  return ordinal(num) as never
}

export function isGreaterThan<Num1 extends number, Num2 extends number>(
  num1: Num1,
  num2: Num2,
): IsGreaterThan<Num1, Num2> {
  return (num1 > num2) as never
}
