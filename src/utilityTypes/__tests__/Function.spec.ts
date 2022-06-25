import { assertType } from '../../utilityFunctions/misc'
import { SafeVariance, ToArrowFunction, ToNonArrowFunction, UnsafeVariance } from '../Function'

declare class BivariantToArrowFunctionTest<T> {
    foo(_value: T): void
}
declare class ContravariantToArrowFunctionTest<T> {
    foo: ToArrowFunction<BivariantToArrowFunctionTest<T>['foo']>
}

test('ToArrowFunction', () => {
    assertType<BivariantToArrowFunctionTest<unknown>, BivariantToArrowFunctionTest<number>>()
    assertType<BivariantToArrowFunctionTest<number>, BivariantToArrowFunctionTest<unknown>>()
    assertType<
        ContravariantToArrowFunctionTest<unknown>,
        // @ts-expect-error -- negative test
        ContravariantToArrowFunctionTest<number>
    >()
})

declare class BivariantToNonArrowFunctionTest<T> {
    foo: (_value: T) => void
}
declare class ContravariantToNonArrowFunctionTest<T> {
    foo: ToNonArrowFunction<BivariantToNonArrowFunctionTest<T>['foo']>
}

test('ToNonArrowFunction', () => {
    assertType<
        ContravariantToNonArrowFunctionTest<unknown>,
        ContravariantToNonArrowFunctionTest<number>
    >()
    assertType<
        ContravariantToNonArrowFunctionTest<number>,
        ContravariantToNonArrowFunctionTest<unknown>
    >()
    assertType<
        BivariantToNonArrowFunctionTest<unknown>,
        // @ts-expect-error -- negative test
        BivariantToNonArrowFunctionTest<number>
    >()
})

test('SafeVariance', () => {
    type Contravariant<T> = SafeVariance<BivariantToArrowFunctionTest<T>>
    assertType<Contravariant<number>, Contravariant<unknown>>()
    assertType<
        Contravariant<unknown>,
        // @ts-expect-error -- negative test
        Contravariant<number>
    >()
})

test('UnsafeVariance', () => {
    type Bivariant<T> = UnsafeVariance<BivariantToNonArrowFunctionTest<T>>
    assertType<Bivariant<number>, Bivariant<unknown>>()
    assertType<Bivariant<unknown>, Bivariant<number>>()
})
