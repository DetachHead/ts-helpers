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
    toNumber,
} from '../../src/utilityFunctions/Number'
import { exactly } from '../../src/utilityFunctions/misc'
import { TupleOf } from '../../src/utilityTypes/Array'
import { PowerAssert } from 'typed-nodejs-assert'

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

test('random', () => {
    const arr: TupleOf<number, 5> = [1, 2, 3, 4, 5]
    const foo = random(1, 4)
    exactly<number>()(arr[foo])
})

describe('arithmetic', () => {
    describe('add', () => {
        test('normal numbers', () => {
            exactly(4, add(1, 3))
        })
        test('big numbers', () => {
            exactly(4000, add(1000, 3000))
        })
    })
    describe('subtract', () => {
        test('normal numbers', () => {
            exactly(2, subtract(5, 3))
        })
        test('big numbers', () => {
            exactly(2000, subtract(5000, 3000))
        })
    })
    describe('multiply', () => {
        test('normal numbers', () => {
            exactly(15, multiply(5, 3))
        })
    })
    describe('divide', () => {
        test('normal numbers', () => {
            exactly(5, divide(10, 2))
        })
        test('value not known at compile-time', () => {
            exactly(5 as number, divide(10 as number, 2))
        })
    })
    describe('power', () => {
        describe('value known at compiletime', () => {
            test('regular numbers', () => {
                exactly(2401, power(7, 4))
            })
            test('0', () => {
                exactly(1, power(20, 0))
            })
            test('1', () => {
                exactly(15, power(15, 1))
            })
            test('0^0', () => {
                exactly(1, power(0, 0))
            })
            test('0^1', () => {
                exactly(0, power(0, 1))
            })
            test('stack depth', () => {
                power(1000, 0)
            })
        })
        describe('value not known at compiletime', () => {
            test('num', () => {
                exactly(16 as number, power(2 as number, 4))
            })
            test('power', () => {
                exactly(65536 as number, power(4, 8 as number))
            })
        })
    })
})

describe('leadingZeros', () => {
    test('values known at compiletime', () => {
        exactly('00012', leadingZeros(12, 5))
    })
    describe('values not known at compiletime', () => {
        test('num', () => {
            exactly<`${number}`>()(leadingZeros(12 as number, 5))
        })
        test('length', () => {
            exactly<`${number}`>()(leadingZeros(12, 5 as number))
        })
        test('both', () => {
            exactly<`${number}`>()(leadingZeros(12 as number, 5 as number))
        })
    })
    test('negative numbers', () => {
        exactly('-0020', leadingZeros(-20, 4))
    })
})

describe('ordinal', () => {
    it('1/2/3', () => {
        exactly('1st', ordinalNumber(1))
        exactly('12th', ordinalNumber(12))
        exactly('23rd', ordinalNumber(23))
    })
    it('th', () => {
        exactly('24th', ordinalNumber(24))
        exactly('0th', ordinalNumber(0))
    })
    it('value not known at compiletime', () => {
        exactly<`${number}${'st' | 'nd' | 'rd' | 'th'}`>()(ordinalNumber(1 as number))
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
            test('first num', () => {
                assertTypeIsExactlyBoolean(isGreaterThan(5 as 2 | 3 | 4 | 5 | 6, 4))
            })
            test('second num', () => {
                assertTypeIsExactlyBoolean(isGreaterThan(5, 4 as 2 | 3 | 4 | 5 | 6))
            })
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
            test('first num', () => {
                assertTypeIsExactlyBoolean(isGreaterOrEqual(5 as 2 | 3 | 4 | 5 | 6, 4))
            })
            test('second num', () => {
                assertTypeIsExactlyBoolean(isGreaterOrEqual(5, 4 as 2 | 3 | 4 | 5 | 6))
            })
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
            test('first num', () => {
                assertTypeIsExactlyBoolean(isLessThan(5 as 2 | 3 | 4 | 5 | 6, 4))
            })
            test('second num', () => {
                assertTypeIsExactlyBoolean(isLessThan(5, 4 as 2 | 3 | 4 | 5 | 6))
            })
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
            test('first num', () => {
                assertTypeIsExactlyBoolean(isLessOrEqual(5 as 2 | 3 | 4 | 5 | 6, 4))
            })
            test('second num', () => {
                assertTypeIsExactlyBoolean(isLessOrEqual(5, 4 as 2 | 3 | 4 | 5 | 6))
            })
        })
    })
})

describe('bitwise operations', () => {
    describe('leftShift', () => {
        test('known at compile-time', () => {
            exactly(40, leftShift(5, 3))
        })
        test('not known at compile-time', () => {
            exactly<number>()(leftShift(5 as number, 3))
        })
    })
    describe('rightShift', () => {
        test('known at compile-time', () => {
            exactly(1, rightShift(5, 2))
        })
        test('not known at compile-time', () => {
            exactly<number>()(leftShift(5 as number, 2))
        })
    })
})

describe('toNumber', () => {
    describe('known at compiletime', () => {
        describe('valid numbers', () => {
            test('normal', () => {
                exactly(12 as number, toNumber('12'))
            })
            test('Infinity', () => {
                exactly(Infinity, toNumber('Infinity'))
            })
        })
        describe('invalid number', () => {
            test('starts with valid number', () => {
                exactly(undefined, toNumber('12asdf'))
            })
            test('empty string', () => {
                exactly(undefined, toNumber(''))
            })
        })
    })
    test('not known at compiletime', () => {
        exactly<undefined | number>()(toNumber('12' as string))
    })
    describe('error', () => {
        assert.throws(() => toNumber('asdf', true), "failed to convert 'asdf' to a number")
    })
})
