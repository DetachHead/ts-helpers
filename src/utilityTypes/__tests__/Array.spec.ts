import { TupleOfUpTo } from '../Array'

test('TupleOfUpTo', () => {
  // TODO: figure out how to test with `noUncheckedIndexedAccess` on and off
  const foo = [1, 1, 1] as TupleOfUpTo<number, 3>
  // noinspection BadExpressionStatementJS
  foo[0] // $ExpectType number | undefined
  // @ts-expect-error array is guaranteed to not have a number at index 3
  // noinspection BadExpressionStatementJS
  foo[3]
})
