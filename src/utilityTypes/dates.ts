import { LeadingZeros, Ordinal, RangeType } from './Number'
import { EnumerateAsString, PadStart, ReplaceValuesWithMap } from './String'

type ShortEra = 'AC' | 'BC'

// these two don't do anything really as they just resolve to `${number}`, but leaving it here in case that changes
type LongYear = LeadingZeros<number, 4>
type MediumYear = LeadingZeros<number, 3>

type ShortYear = PadStart<EnumerateAsString<3>, 2, '0'>

type OrdinalYear = Ordinal<number>

type Quarter = RangeType<1, 4>

type OrdinalQuarter = Ordinal<Quarter>

type FormatMap = [
	// Era
	['GGGGG', 'A' | 'B'],
	['GGGG', 'Anno Domini' | 'Before Christ'],
	['GGG', ShortEra],
	['GG', ShortEra],
	['G', ShortEra],

	// Calendar year:
	['yyyy', LongYear],
	['yyy', MediumYear],
	['yy', ShortYear],
	['yo', OrdinalYear],
	['y', number],

	// Local week-numbering year
	['YYYY', LongYear],
	['YYY', MediumYear],
	['YY', ShortYear],
	['Yo', OrdinalYear],
	['Y', number],

	// ISO week-numbering year
	['RRRR', LongYear],
	['RRR', MediumYear],
	['RR', LeadingZeros<number, 2>],
	['R', number],

	// Extended year
	['uuuu', LongYear],
	['uuu', MediumYear],
	['uu', LeadingZeros<number, 2>],
	['u', number],

	// Quarter
	['qqqq' | 'QQQQ', `${OrdinalQuarter} quarter`],
	['qqq' | 'QQQ', `Q${Quarter}`],
	['qq' | 'QQ', LeadingZeros<Quarter, 2>],
	['q' | 'Q', Quarter]

	// TODO: finish this
	// BIG PROBLEMS to solve:
	// - this array can't be expanded beyond 35 entries before it gives up due to stack depth error
	// - ReplaceValuesWithMap replaces values that were the result of a previous replacement... probably need to implement a lexer instead
]

/**
 * creates a type for a formatted string as per the [`date-fns` format](https://date-fns.org/v2.20.1/docs/format)
 */
export type StringifiedDate<Format extends string> = ReplaceValuesWithMap<Format, FormatMap>

const Foo: StringifiedDate<'YY/QQQQ'> = 'asdf'
