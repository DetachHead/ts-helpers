import { Multiply } from '../Number'
import { testType } from '../../utilityFunctions/misc'

test('multiply', () => {
	testType<Multiply<2 | 3, 5 | 2>>(4)
	testType<Multiply<2 | 3, 5 | 2>>(6)
	testType<Multiply<2 | 3, 5 | 2>>(10)
	testType<Multiply<2 | 3, 5 | 2>>(15)
	//@ts-expect-error not valid product
	testType<Multiply<2 | 3, 5 | 2>>(11)
	//@ts-expect-error not valid product
	testType<Multiply<2 | 3, 5 | 2>>(8)
})
