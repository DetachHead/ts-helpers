import { FormattedDate } from '../utilityTypes/Date'
import { format } from 'date-fns'

/**
 * formats a date using the [`date-fns` format](https://date-fns.org/v2.20.1/docs/format) function, and uses
 * {@link FormattedDate} to generate a type for the given `formatString`
 */
export const formatDate: <T extends string>(date: Date, formatString: T) => FormattedDate<T> = (
    date,
    formatString,
) => format(date, formatString) as never
