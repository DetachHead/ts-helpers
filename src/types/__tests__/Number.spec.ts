import {random} from '../Number'
import {FixedSizeArray} from '../../utilityTypes'

test('random', () => {
	const arr: FixedSizeArray<number, 5> = [1,2,3,4,5]
	const foo = random(1, 4)
	arr[foo] // $ExpectType number
})