import { TupleOfUpTo } from '../utilityTypes'

test('TupleOfUpTo', () => {
	//TODO: figure out how to test with `noUncheckedIndexedAccess` on and off
	const foo: TupleOfUpTo<number, 3> = [1, 1, 1]
	// noinspection BadExpressionStatementJS
	foo[0] // $ExpectType number | undefined
	//@ts-expect-error array is guaranteed to not have a number at index 3
	// noinspection BadExpressionStatementJS
	foo[3]
})
