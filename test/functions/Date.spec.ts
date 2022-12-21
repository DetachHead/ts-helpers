import { formatDate } from '../../src/functions/Date'
import { set } from 'date-fns'
import { PowerAssert } from 'typed-nodejs-assert'

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

describe('formatDate', () => {
    test('date', () => {
        const value = formatDate(new Date('2020-01-01'), 'dd/MM/yyyy')
        assert(value === '01/01/2020')
        // @ts-expect-error incorrect date format
        // noinspection BadExpressionStatementJS
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- testing
        value === '01-01-2020'
    })
    test('time', () => {
        const date = set(new Date(), { hours: 10, minutes: 11 })
        const value = formatDate(date, 'hh:mm a')
        assert(value === '10:11 AM')
        // @ts-expect-error incorrect time format
        // noinspection BadExpressionStatementJS
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- testing
        value === '10:11AM'
    })
})
