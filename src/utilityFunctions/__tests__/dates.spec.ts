import { formatDate } from '../dates'
import { PowerAssert } from 'typed-nodejs-assert'
import { set } from 'date-fns'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

describe('formatDate', () => {
  test('date', () => {
    const value = formatDate(new Date('2020-01-01'), 'dd/MM/yyyy')
    assert(value === '01/01/2020')
    // @ts-expect-error incorrect date format
    // noinspection BadExpressionStatementJS
    value === '01-01-2020'
  })
  test('time', () => {
    const date = set(new Date(), { hours: 10, minutes: 11 })
    const value = formatDate(date, 'hh:mm a')
    assert(value === '10:11 AM')
    // @ts-expect-error incorrect time format
    // noinspection BadExpressionStatementJS
    value === '10:11AM'
  })
})
