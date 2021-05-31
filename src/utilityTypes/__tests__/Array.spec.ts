import { TupleOfUpTo } from '../Array'
import { SplitByUnion } from '../String'
import { testType } from '../../utilityFunctions/misc'

test('TupleOfUpTo', () => {
  // TODO: figure out how to test with `noUncheckedIndexedAccess` on and off
  const foo = [1, 1, 1] as TupleOfUpTo<number, 3>
  // noinspection BadExpressionStatementJS
  foo[0] // $ExpectType number | undefined
  // @ts-expect-error array is guaranteed to not have a number at index 3
  // noinspection BadExpressionStatementJS
  foo[3]
})

test('SplitByUnion', () => {
  testType<SplitByUnion<'foo.bar,baz', '.' | ','>>('foo')
  testType<SplitByUnion<'foo.bar,baz', '.' | ','>>('bar')
  testType<SplitByUnion<'foo.bar,baz', '.' | ','>>('baz')
  testType<SplitByUnion<'foo.bar,baz', '.' | ','>>(
    // @ts-expect-error invalid value
    'qux',
  )
})
