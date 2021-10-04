import { Equals } from './misc'
import { IndexOfHighestNumber, TupleOf } from './Array'
import { Includes, PadStart, StartsWith, Tail, ToString, TrimEnd, TrimStart } from './String'
import { ListOf } from 'ts-toolbelt/out/Union/ListOf'
import { Length } from 'ts-toolbelt/out/String/Length'
import { Not, Or } from './Boolean'

type _PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
    ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
        ? X
        : never
    : never

type _Enumerate<A extends Array<unknown>, N extends number> = N extends A['length']
    ? A
    : _Enumerate<_PrependNextNum<A>, N>

/**
 * creates a union type of numbers from 0 to generic `N`
 *
 * @example
 * type Foo = Enumerate<3> //0|1|2
 * @see https://stackoverflow.com/a/63918062
 */
export type Enumerate<N extends number> = number extends N
    ? number
    : _Enumerate<[], N> extends (infer E)[]
    ? E
    : never

/**
 * creates a range type of numbers from generics `FROM` (inclusive) to `TO` (inclusive)
 *
 * @example
 * type Foo = RangeType<2, 5> //2|3|4|5
 * @see https://stackoverflow.com/a/63918062
 */
export type RangeType<FROM extends number, TO extends number> =
    | Exclude<Enumerate<TO>, Enumerate<FROM>>
    | TO

// TODO: figure out a way to make Add and Subtract work with negative numbers

/**
 * adds two `number` types together
 *
 * **WARNING:** for some reason the compiler sometimes thinks this isn't a valid number when passing it into other
 * utility types. as far as i can tell this is a false positive, and the types still behave as expected if you suppress
 * the error with @ts-expect-error
 * @example
 * type Foo = Add<2, 3> //5
 */
export type Add<N1 extends number, N2 extends number> = [
    ...TupleOf<never, N1>,
    ...TupleOf<never, N2>
]['length']

/**
 * subtracts `N2` from `N1`
 * @example
 * type Foo = Subtract<5, 2> //3
 */
export type Subtract<N1 extends number, N2 extends number> = TupleOf<never, N1> extends [
    ...TupleOf<never, N2>,
    ...infer R
]
    ? R['length']
    : never

// TODO: figure out how to do Multiply and Divide logarithmically like TupleOf so it doesn't fail on numbers > 40

type _MultiAdd<
    Number extends number,
    Accumulator extends number,
    IterationsLeft extends number
> = IterationsLeft extends 0
    ? Accumulator
    : _MultiAdd<
          Number,
          // @ts-expect-error see documentation for Add type
          Add<Number, Accumulator>,
          Decrement<IterationsLeft>
      >

/**
 * multiplies `N1` by `N2`
 *
 * **WARNING**: currently fails on big numbers
 * @example
 * type Foo = Multiply<2, 3> //6
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Multiply<N1 extends number, N2 extends number> = number extends N1 | N2
    ? number
    : {
          [K2 in N2]: { [K1 in N1]: _MultiAdd<K1, 0, N2> }[N1]
      }[N2]

type _AtTerminus<Dividee extends number, Divider extends number> = Dividee extends 0
    ? true
    : Divider extends 0
    ? true
    : false

type _LessThanTerminus<Dividee extends number, Divider extends number> = _AtTerminus<
    Dividee,
    Divider
> extends true
    ? Equals<Dividee, Divider> extends true
        ? false
        : Dividee extends 0
        ? true
        : false
    : _LessThanTerminus<Decrement<Dividee>, Decrement<Divider>>

type _MultiSub<
    Dividee extends number,
    Divider extends number,
    QuotientAccumulator extends number
> = _LessThanTerminus<Dividee, Divider> extends true
    ? QuotientAccumulator
    : _MultiSub<
          Subtract<Dividee, Divider>,
          Divider,
          // @ts-expect-error see documentation for Increment type
          Increment<QuotientAccumulator>
      >

/**
 * divides `N1` by `N2`
 *
 * **WARNING**: currently fails on big numbers
 * @example
 * type Foo = Divide<6, 3> //2
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Divide<N1 extends number, N2 extends number> = number extends N1 | N2
    ? number
    : {
          [K2 in N2]: { [K1 in N1]: _MultiSub<K1, K2, 0> }[N1]
      }[N2]

/**
 * gets the remainder of `Divide<N1, N2>`
 * @example
 * type Foo = Modulo<7, 4> //3
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Modulo<N1 extends number, N2 extends number> = _LessThanTerminus<N1, N2> extends true
    ? N1
    : Modulo<Subtract<N1, N2>, N2>

/**
 * raises the value of `Num` to the power of the `PowerOf` parameter.
 */
export type Power<Num extends number, PowerOf extends number> = number extends PowerOf
    ? number
    : PowerOf extends 0
    ? 1
    : PowerOf extends 1
    ? Num
    : Multiply<Power<Num, Decrement<PowerOf>>, Num>

/**
 * raises the value of `Num` to the power of 2
 */
export type Square<Num extends number> = Power<Num, 2>

/**
 * checks whether a number is positive or negative
 */
export type IsPositive<T extends number> = `${T}` extends `-${number}` ? false : true

/**
 * adds 1 to `T`
 *
 * **WARNING:** for some reason the compiler sometimes thinks this isn't a valid number when passing it into other
 * utility types. as far as i can tell this is a false positive, and the types still behave as expected if you suppress
 * the error with @ts-expect-error
 */
export type Increment<T extends number> = Add<T, 1>

/** subtracts 1 from `T` */
export type Decrement<T extends number> = Subtract<T, 1>

/**
 * adds leading zeros to a number until it reaches a specified length
 *
 * @example
 * type Foo = LeadingZeros<12, 5> //'00012'
 * type Bar = LeadingZeros<-12, 5> //'-00012'
 */
export type LeadingZeros<Num extends number, Length extends number> = number extends Num | Length
    ? ToString<number>
    : IsPositive<Num> extends true
    ? PadStart<ToString<Num>, Length, '0'>
    : `-${PadStart<Tail<ToString<Num>>, Length, '0'>}`

/**
 * creates a stringified ordinal value for the given number
 * @example
 * type First = Ordinal<1> //1st
 * type Third = Ordinal<3> //3rd
 */
export type Ordinal<T extends number = number> = number extends T
    ? `${number}${'st' | 'nd' | 'rd' | 'th'}`
    : {
          [Num in T]: `${Num}${Modulo<Num, 20> extends infer Mod
              ? Mod extends 1
                  ? 'st'
                  : Mod extends 2
                  ? 'nd'
                  : Mod extends 3
                  ? 'rd'
                  : 'th'
              : never}`
      }[T]

/** `true` if `Num1` is greater than `Num2`, else `false` */
export type IsGreaterThan<Num1s extends number, Num2s extends number> = {
    [Num1 in Num1s]: {
        [Num2 in Num2s]: TupleOf<never, Num1> extends [never, ...TupleOf<never, Num2>, ...never[]]
            ? true
            : false
    }[Num2s]
}[Num1s]

export type IsGreaterOrEqual<Num1s extends number, Num2s extends number> = {
    [Num1 in Num1s]: {
        [Num2 in Num2s]: Or<IsGreaterThan<Num1, Num2> | Equals<Num1, Num2>>
    }[Num2s]
}[Num1s]

export type IsLessThan<Num1s extends number, Num2s extends number> = {
    [Num1 in Num1s]: {
        [Num2 in Num2s]: Not<IsGreaterOrEqual<Num1, Num2>>
    }[Num2s]
}[Num1s]

export type IsLessOrEqual<Num1 extends number, Num2 extends number> = Not<IsGreaterThan<Num1, Num2>>

/** gets the highest number in a union of numbers */
export type HighestNumber<Numbers extends number> =
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/46171
    ListOf<Numbers>[IndexOfHighestNumber<ListOf<Numbers>>]

/**
 * a binary value in string format. obviously this type isn't perfect as it still allows for numbers that aren't 0 or 1
 * but it's better than nothing
 */
type StringifiedBinary = `${bigint}`

type _NumberToBinary<T extends number> = T extends 0
    ? ''
    : // @ts-expect-error stack depth
      `${_NumberToBinary<Divide<T, 2>> extends 0 ? '' : _NumberToBinary<Divide<T, 2>>}${Modulo<
          T,
          2
      >}`

/** converts a number to a string representing its binary value */
export type NumberToBinary<T extends number> = number extends T
    ? StringifiedBinary
    : T extends 0
    ? '0'
    : _NumberToBinary<T>

type _StringToDigit<T extends StringifiedBinary> = T extends '0'
    ? 0
    : T extends '1'
    ? 1
    : T extends '2'
    ? 2
    : T extends '3'
    ? 3
    : T extends '4'
    ? 4
    : T extends '5'
    ? 5
    : T extends '6'
    ? 6
    : T extends '7'
    ? 7
    : T extends '8'
    ? 8
    : T extends '9'
    ? 9
    : never

export type _BinaryToNumber<T extends StringifiedBinary, Multiplier extends number> = Add<
    // @ts-expect-error compiler thinks it's not a number but it is
    Multiply<_StringToDigit<TrimStart<T, Decrement<Length<T>>>>, Multiplier>,
    T extends '0' | '1'
        ? 0
        : _BinaryToNumber<
              // @ts-expect-error fails to correctly infer template literal type for StringifiedBinary
              TrimEnd<T, Decrement<Length<T>>>,
              Multiply<Multiplier, 2>
          >
>

/** converts a string representing a binary value to its number */
// TODO: try and fix the issue where it doesn't work past 5 bits lol
export type BinaryToNumber<T extends StringifiedBinary> = StringifiedBinary extends T
    ? number
    : _BinaryToNumber<T, 1>

/** shifts the bits of `Num` left by the given `Count` */
export type LeftShift<Num extends number, Count extends number> =
    // @ts-expect-error stack depth
    Multiply<Num, Power<2, Count>>

/** shifts the bits of `Num` right by the given `Count` */
export type RightShift<Num extends number, Count extends number> =
    // @ts-expect-error stack depth
    Divide<Num, Power<2, Count>>

/**
 * a `number` that cannot have a decimal
 * @example
 * declare const foo = <T extends number>(num: Integer<T>): void
 * foo(1) //no error
 * foo(1.2) //error
 */
export type Integer<T extends number> = number extends T
    ? never
    : Includes<`${T}`, '.'> extends true
    ? never
    : T

/**
 * a `number` that can only be positive
 * @example
 * declare const foo = <T extends number>(num: PositiveNumber<T>): void
 * foo(1) //no error
 * foo(-1) //error
 */
export type PositiveNumber<T extends number> = number extends T
    ? never
    : StartsWith<`${T}`, '-'> extends true
    ? never
    : T

/**
 * a `number` that can only be negative
 * @example
 * declare const foo = <T extends number>(num: NegativeNumber<T>): void
 * foo(-1) //no error
 * foo(1) //error
 */
export type NegativeNumber<T extends number> = number extends T
    ? never
    : PositiveNumber<T> extends never
    ? T
    : never
