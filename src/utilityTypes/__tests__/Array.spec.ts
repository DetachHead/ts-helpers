import { TupleOfUpTo } from '../Array'
import { SplitByLength, SplitByUnion } from '../String'
import { assertType } from '../../utilityFunctions/misc'

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
    assertType<SplitByUnion<'foo.bar,baz', '.' | ','>>('foo')
    assertType<SplitByUnion<'foo.bar,baz', '.' | ','>>('bar')
    assertType<SplitByUnion<'foo.bar,baz', '.' | ','>>('baz')
    assertType<SplitByUnion<'foo.bar,baz', '.' | ','>>(
        // @ts-expect-error invalid value
        'qux',
    )
})

test('SplitByLength', () => {
    type Foo = SplitByLength<'foobarbaz', 3> // $ExpectType ["foo", "bar", "baz"]
    assertType<Foo>(['foo', 'bar', 'baz'])
})
