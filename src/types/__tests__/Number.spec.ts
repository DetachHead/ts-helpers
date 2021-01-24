import { random } from '../Number'
import { TupleOf } from 'utility-types'

test('random', () => {
	const arr: TupleOf<number, 5> = [1, 2, 3, 4, 5]
	const foo = random(1, 4)
	// noinspection BadExpressionStatementJS
	arr[foo] // $ExpectType number
})
