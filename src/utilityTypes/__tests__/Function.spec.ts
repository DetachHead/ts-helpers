import { assertType } from '../../utilityFunctions/misc'
import { SafeVariance, ToArrowFunction, ToNonArrowFunction, UnsafeVariance } from '../Function'

declare class BivariantToArrowFunctionTest<T> {
    foo(_value: T): void
}
declare class ContravariantToArrowFunctionTest<T> {
    foo: ToArrowFunction<BivariantToArrowFunctionTest<T>['foo']>
}

test('ToArrowFunction', () => {
    assertType<BivariantToArrowFunctionTest<unknown>, ContravariantToArrowFunctionTest<unknown>>()
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
        BivariantToNonArrowFunctionTest<unknown>,
        ContravariantToNonArrowFunctionTest<unknown>
    >()
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

declare class SafeVarianceWithPrivateMethodTest<T> {
    foo(_value: T): void
    private bar(_value: T): void
    private baz: number
}

describe('SafeVariance', () => {
    test('normal', () => {
        type Contravariant<T> = SafeVariance<BivariantToArrowFunctionTest<T>>
        assertType<BivariantToArrowFunctionTest<unknown>, Contravariant<unknown>>()
        assertType<Contravariant<number>, Contravariant<unknown>>()
        assertType<
            Contravariant<unknown>,
            // @ts-expect-error -- negative test
            Contravariant<number>
        >()
    })
    test('private methods', () => {
        type Contravariant<T> = SafeVariance<SafeVarianceWithPrivateMethodTest<T>>
        assertType<SafeVarianceWithPrivateMethodTest<unknown>, Contravariant<unknown>>()
        assertType<Contravariant<number>, Contravariant<unknown>>()
        assertType<
            Contravariant<unknown>,
            // @ts-expect-error -- negative test
            Contravariant<number>
        >()
    })
})

declare class UnsafeVarianceWithPrivateMethodTest<T> {
    foo: (_value: T) => void
    private bar: (_value: T) => void
    private baz: number
}

describe('UnsafeVariance', () => {
    test('normal', () => {
        type Bivariant<T> = UnsafeVariance<BivariantToNonArrowFunctionTest<T>>
        assertType<BivariantToNonArrowFunctionTest<unknown>, Bivariant<unknown>>()
        assertType<Bivariant<number>, Bivariant<unknown>>()
        assertType<Bivariant<unknown>, Bivariant<number>>()
    })
    test('private methods', () => {
        type Bivariant<T> = UnsafeVariance<UnsafeVarianceWithPrivateMethodTest<T>>
        assertType<
            UnsafeVarianceWithPrivateMethodTest<unknown>,
            // @ts-expect-error xfail
            Bivariant<unknown>
        >()
        assertType<Bivariant<number>, Bivariant<unknown>>()
        assertType<Bivariant<unknown>, Bivariant<number>>()
    })
})
