import { entries } from '../Any'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('entries', () => {
  const value = entries({ foo: 1, bar: 'baz' }) // $ExpectType ["foo" | "bar", string | number][]
  assert.deepStrictEqual(value, [
    ['foo', 1],
    ['bar', 'baz'],
  ])
})
