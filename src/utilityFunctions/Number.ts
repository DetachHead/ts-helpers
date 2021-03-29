import _ from 'lodash'
import { Add, Divide, Modulo, Multiply, Subtract } from '../utilityTypes/Number'
import { RangeType } from '../utilityTypes/Number'

/**
 * gets a random number in the given range from `Min` to `Max` (inclusive)
 * @returns anumber where the type is a union of the possible numbers
 */
export function random<Min extends number, Max extends number>(
	min: Min,
	max: Max
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
	num2: N2
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
	num2: N2
): Multiply<N1, N2> {
	return (num1 * num2) as Multiply<N1, N2>
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
