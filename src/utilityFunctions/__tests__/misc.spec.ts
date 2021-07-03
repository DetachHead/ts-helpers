import isCI from 'is-ci'
import { exactly, failCI } from '../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('exactly', () => {
  const exactlyNumber = exactly<number>()
  exactlyNumber(1 as number) // $ExpectType number
  // @ts-expect-error type isn't exactly number
  exactlyNumber(1) // $ExpectType never
})

test('failCI', () => {
  console.log({ isCI })
  if (isCI) assert.throws(failCI)
  else assert.doesNotThrow(failCI)
})
