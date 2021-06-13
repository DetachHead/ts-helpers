import {
  Add,
  Divide,
  HighestNumber,
  IsGreaterThan,
  Multiply,
  NumberToBinary,
  Subtract,
} from '../Number'
import { testType } from '../../utilityFunctions/misc'

test('multiply', () => {
  testType<Multiply<2 | 3, 5 | 2>>(4)
  testType<Multiply<2 | 3, 5 | 2>>(6)
  testType<Multiply<2 | 3, 5 | 2>>(10)
  testType<Multiply<2 | 3, 5 | 2>>(15)
  // @ts-expect-error not valid product
  testType<Multiply<2 | 3, 5 | 2>>(11)
  // @ts-expect-error not valid product
  testType<Multiply<2 | 3, 5 | 2>>(8)
})

test('add', () => {
  testType<Add<2 | 5, 10 | 20>>(12)
  testType<Add<2 | 5, 10 | 20>>(15)
  testType<Add<2 | 5, 10 | 20>>(22)
  testType<Add<2 | 5, 10 | 20>>(25)
  // @ts-expect-error not valid sum
  testType<Add<2 | 5, 10 | 20>>(20)
})

test('subtract', () => {
  testType<Subtract<10 | 20, 2 | 3>>(8)
  testType<Subtract<10 | 20, 2 | 3>>(18)
  testType<Subtract<10 | 20, 2 | 3>>(7)
  testType<Subtract<10 | 20, 2 | 3>>(17)
  // @ts-expect-error not valid
  testType<Subtract<10 | 20, 2 | 3>>(16)
})

test('divide', () => {
  testType<Divide<6 | 12, 2 | 3>>(2)
  testType<Divide<6 | 12, 2 | 3>>(3)
  testType<Divide<6 | 12, 2 | 3>>(6)
  testType<Divide<6 | 12, 2 | 3>>(4)
  // @ts-expect-error not valid quotient
  testType<Divide<6 | 12, 2 | 3>>(9)
})

describe('IsGreaterThan', () => {
  test('false', () => {
    testType<IsGreaterThan<6, 7>>(false)
    testType<IsGreaterThan<6, 6>>(false)
  })
  test('true', () => {
    testType<IsGreaterThan<7, 6>>(true)
  })
  test('big numbers', () => {
    testType<IsGreaterThan<4999, 5000>>(false)
    testType<IsGreaterThan<5001, 5000>>(true)
    // @ts-expect-error wrong value
    testType<IsGreaterThan<5000, 5000>>(true)
  })
})

test('HighestNumber', () => {
  testType<HighestNumber<1 | 3 | 6 | 2>>(6)
  testType<HighestNumber<1 | 3 | 6 | 2>>(
    // @ts-expect-error wrong value
    2,
  )
})

describe('NumberToBinary', () => {
  test('specific value', () => {
    testType<NumberToBinary<12>>('1100')
    testType<NumberToBinary<12>>(
      // @ts-expect-error wrong value
      '101010',
    )
  })
  test('number type', () => {
    // just allow any string with numbers in it
    testType<NumberToBinary<number>>('1010101')
  })
})
