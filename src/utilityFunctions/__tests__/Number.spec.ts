import {
    add,
    random,
    subtract,
    multiply,
    divide,
    leadingZeros,
    ordinalNumber,
    isGreaterThan,
    power,
    leftShift,
    rightShift,
    isGreaterOrEqual,
    isLessThan,
    isLessOrEqual,
} from '../Number'
import { PowerAssert } from 'typed-nodejs-assert'
import { TupleOf } from '../../utilityTypes/Array'
import { exactly } from '../misc'
// eslint-disable-next-line @typescript-eslint/no-var-requires -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('random', () => {
    const arr: TupleOf<number, 5> = [1, 2, 3, 4, 5]
    const foo = random(1, 4)
    // noinspection BadExpressionStatementJS
    arr[foo] // $ExpectType number
})

describe('arithmetic', () => {
    describe('add', () => {
        test('normal numbers', () => {
            const num = add(1, 3) // $ExpectType 4
            assert(num === 4)
        })
        test('big numbers', () => {
            const num = add(1000, 3000) // $ExpectType 4000
            assert(num === 4000)
        })
    })
    describe('subtract', () => {
        test('normal numbers', () => {
            const num = subtract(5, 3) // $ExpectType 2
            assert(num === 2)
        })
        test('big numbers', () => {
            const num = subtract(5000, 3000) // $ExpectType 2000
            assert(num === 2000)
        })
    })
    describe('multiply', () => {
        test('normal numbers', () => {
            const num = multiply(5, 3) // $ExpectType 15
            assert(num === 15)
        })
    })
    describe('divide', () => {
        test('normal numbers', () => {
            const num = divide(10, 2) // $ExpectType 5
            assert(num === 5)
        })
        test('value not known at compile-time', () => {
            const num = divide(10 as number, 2) // $ExpectType number
            assert(num === 5)
        })
    })
    describe('power', () => {
        test('value known at compiletime', () => {
            const value = power(7, 4) // $ExpectType 2401
            assert(value === 2401)
        })
        describe('value not known at compiletime', () => {
            test('num', () => {
                const value = power(2 as number, 4) // $ExpectType number
                assert(value === 16)
            })
            test('power', () => {
                const value = power(4, 8 as number) // $ExpectType number
                assert(value === 65536)
            })
        })
    })
})

describe('leadingZeros', () => {
    test('values known at compiletime', () => {
        const value = leadingZeros(12, 5) // $ExpectType "00012"
        assert(value === '00012')
    })
    describe('values not known at compiletime', () => {
        test('num', () => {
            leadingZeros(12 as number, 5) // $ExpectType `${number}`
        })
        test('length', () => {
            leadingZeros(12, 5 as number) // $ExpectType `${number}`
        })
        test('both', () => {
            leadingZeros(12 as number, 5 as number) // $ExpectType `${number}`
        })
    })
    test('negative numbers', () => {
        const value = leadingZeros(-20, 4) // $ExpectType "-0020"
        assert(value === '-0020')
    })
})

describe('ordinal', () => {
    it('1/2/3', () => {
        assert(ordinalNumber(1) === '1st')
        assert(ordinalNumber(12) === '12th')
        assert(ordinalNumber(23) === '23rd')
        assert(
            // @ts-expect-error wrong value
            ordinalNumber(3) !== '3th',
        )
    })
    it('th', () => {
        assert(ordinalNumber(24) === '24th')
        assert(ordinalNumber(0) === '0th')
        assert(
            // @ts-expect-error wrong value
            ordinalNumber(0) !== '1000nd',
        )
    })
    it('value not known at compiletime', () => {
        ordinalNumber(1 as number) // $ExpectType `${number}st` | `${number}nd` | `${number}rd` | `${number}th`
    })
})

describe('comparison', () => {
    const assertTypeIsTrue = exactly<true>()
    const assertTypeIsFalse = exactly<false>()
    const assertTypeIsExactlyBoolean = exactly<boolean>()
    describe('isGreaterThan', () => {
        describe('greater', () => {
            test('true', () => assert(assertTypeIsTrue(isGreaterThan(5, 4))))
            test('false', () => assert(!assertTypeIsFalse(isGreaterThan(5, 20))))
        })
        test('equal returns false', () => assert(!assertTypeIsFalse(isGreaterThan(6, 6))))
        describe('big numbers', () => {
            test('true', () => assert(assertTypeIsTrue(isGreaterThan(5000, 4999))))
            test('false', () => assert(!assertTypeIsFalse(isGreaterThan(5000, 5001))))
        })
        describe('distributive', () => {
            test('first num', () =>
                assertTypeIsExactlyBoolean(isGreaterThan(5 as 2 | 3 | 4 | 5 | 6, 4)))
            test('second num', () =>
                assertTypeIsExactlyBoolean(isGreaterThan(5, 4 as 2 | 3 | 4 | 5 | 6)))
        })
    })
    describe('isGreaterOrEqual', () => {
        describe('greater', () => {
            test('true', () => assert(assertTypeIsTrue(isGreaterOrEqual(5, 4))))
            test('false', () => assert(!assertTypeIsFalse(isGreaterOrEqual(5, 20))))
        })
        test('equal returns true', () => assert(assertTypeIsTrue(isGreaterOrEqual(6, 6))))
        describe('big numbers', () => {
            test('true', () => assert(assertTypeIsTrue(isGreaterOrEqual(5000, 4999))))
            test('false', () => assert(!assertTypeIsFalse(isGreaterOrEqual(5000, 5001))))
        })
        describe('distributive', () => {
            test('first num', () =>
                assertTypeIsExactlyBoolean(isGreaterOrEqual(5 as 2 | 3 | 4 | 5 | 6, 4)))
            test('second num', () =>
                assertTypeIsExactlyBoolean(isGreaterOrEqual(5, 4 as 2 | 3 | 4 | 5 | 6)))
        })
    })
    describe('isLessThan', () => {
        describe('less', () => {
            test('true', () => assert(assertTypeIsTrue(isLessThan(5, 20))))
            test('false', () => assert(!assertTypeIsFalse(isLessThan(5, 4))))
        })
        test('equal returns false', () => assert(!assertTypeIsFalse(isLessThan(6, 6))))
        describe('big numbers', () => {
            test('true', () => assert(assertTypeIsTrue(isLessThan(5000, 5001))))
            test('false', () => assert(!assertTypeIsFalse(isLessThan(5000, 4999))))
        })
        describe('distributive', () => {
            test('first num', () =>
                assertTypeIsExactlyBoolean(isLessThan(5 as 2 | 3 | 4 | 5 | 6, 4)))
            test('second num', () =>
                assertTypeIsExactlyBoolean(isLessThan(5, 4 as 2 | 3 | 4 | 5 | 6)))
        })
    })
    describe('isLessOrEqual', () => {
        describe('less', () => {
            test('true', () => assert(assertTypeIsTrue(isLessOrEqual(5, 20))))
            test('false', () => assert(!assertTypeIsFalse(isLessOrEqual(5, 4))))
        })
        test('equal returns true', () => assert(assertTypeIsTrue(isLessOrEqual(6, 6))))
        describe('big numbers', () => {
            test('true', () => assert(assertTypeIsTrue(isLessOrEqual(5000, 5001))))
            test('false', () => assert(!assertTypeIsFalse(isLessOrEqual(5000, 4999))))
        })
        describe('distributive', () => {
            test('first num', () =>
                assertTypeIsExactlyBoolean(isLessOrEqual(5 as 2 | 3 | 4 | 5 | 6, 4)))
            test('second num', () =>
                assertTypeIsExactlyBoolean(isLessOrEqual(5, 4 as 2 | 3 | 4 | 5 | 6)))
        })
    })
})

describe('bitwise operations', () => {
    describe('leftShift', () => {
        test('known at compile-time', () => {
            const value = leftShift(5, 3) // $ExpectType 40
            assert(value === 40)
        })
        test('not known at compile-time', () => {
            leftShift(5 as number, 3) // $ExpectType number
        })
    })
    describe('rightShift', () => {
        test('known at compile-time', () => {
            const value = rightShift(5, 2) // $ExpectType 1
            assert(value === 1)
        })
        test('not known at compile-time', () => {
            leftShift(5 as number, 2) // $ExpectType number
        })
    })
})
