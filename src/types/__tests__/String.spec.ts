import {match} from '../String'

test('match', () => {
	const foo = match('', /a/)
	if (foo !== null) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[1] // $ExpectType string | undefined
	}
})