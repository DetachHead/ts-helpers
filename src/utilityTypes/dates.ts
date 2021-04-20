import { Enumerate, LeadingZeros, Ordinal, RangeType } from './Number'
import {
  EnumerateAsString,
  IndexOf,
  LongestString,
  MatchStart,
  PadStart,
  RangeAsString,
  TrimEnd,
  TrimStart,
} from './String'
import { Length } from 'ts-toolbelt/out/String/Length'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'
import { Keys } from './Any'
import { Join } from 'ts-toolbelt/out/String/Join'

type ShortEra = 'AC' | 'BC'

// these two don't do anything really as they just resolve to `${number}`, but leaving it here in case that changes
type LongYear = LeadingZeros<number, 4>
type MediumYear = LeadingZeros<number, 3>

type ShortYear = PadStart<EnumerateAsString<100>, 2, '0'>

type OrdinalYear = Ordinal

type Quarter = RangeType<1, 4>

type OrdinalQuarter = Ordinal<Quarter>

type MonthNumber = RangeType<1, 12>

type ShortMonth = LeadingZeros<MonthNumber, 2>

type OrdinalMonth = Ordinal<MonthNumber>

type ShortNamedMonth =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec'

type LongNamedMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December'

type InitialMonth = 'J' | 'F' | 'M' | 'A' | 'S' | 'O' | 'N' | 'D'

type WeekOfYear = RangeAsString<1, 53>

type OrdinalWeekOfYear = Ordinal

type ShortWeekOfYear = PadStart<WeekOfYear, 2, '0'>

type DayOfMonth = RangeType<1, 31>

type OrdinalDayOfMonth = Ordinal<DayOfMonth>

type ShortDayOfMonth = LeadingZeros<DayOfMonth, 2>

type DayOfYear = RangeAsString<1, 366>

type OrdinalDayOfYear = Ordinal

// TODO: figure out why this causes stack depth error when MediumDayOfYear doesn't
type ShortDayOfYear = number // PadStart<DayOfYear, 2, '0'>

type MediumDayOfYear = PadStart<DayOfYear, 3, '0'>

type BiggerDayOfYear = number

type MediumDayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

type LongDayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

type InitialDayOfWeek = 'M' | 'T' | 'W' | 'F' | 'S'

type ShortDayOfWeek = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su'

type NumberedDayOfWeek = RangeType<1, 7>

type OrdinalDayOfWeek = Ordinal<NumberedDayOfWeek>

type ShortNumberedDayOfWeek = LeadingZeros<NumberedDayOfWeek, 2>

type AMorPM = 'AM' | 'PM'

type PunctuatedAMorPM = 'a.m' | 'p.m'

type InitialAMorPM = 'a' | 'p'

type NoonOrMidnight = 'noon' | 'midnight'

type FlexibleDayPeriod = 'at night' | 'in the morning'

type Hour1to12 = RangeType<1, 12>

type OrdinalHour1to12 = Ordinal<Hour1to12>

type ShortHour1to12 = LeadingZeros<Hour1to12, 2>

type Hour0to23 = Enumerate<23>

type OrdinalHour0to23 = Ordinal<Hour0to23>

type ShortHour0to23 = LeadingZeros<Hour0to23, 2>

type Hour0to11 = Enumerate<11>

type OrdinalHour0to11 = Ordinal<Hour0to11>

type ShortHour0to11 = LeadingZeros<Hour0to11, 2>

type Hour0to24 = RangeType<1, 24>

type OrdinalHour0to24 = Ordinal<Hour0to24>

type ShortHour0to24 = LeadingZeros<Hour0to24, 2>

type MinuteOrSecond = EnumerateAsString<59>

type OrdinalMinuteOrSecond = Ordinal

type ShortMinuteOrSecond = PadStart<MinuteOrSecond, 2, '0'>

type TenthOfSecond = Enumerate<9>

type HundredthOfSecond = EnumerateAsString<100>

type ThousandthOfSecond = EnumerateAsString<1000>

type TenThousandthOfSecond = number

// TODO: investigate these, as i think they're wrong
type TimezoneWithoutColon = `${'-' | '+'}${number}`
type TimezoneWithColon = `${'-' | '+'}${number}:${number}`

type TimezoneGMT = `GMT${'-' | '+'}${number}${`:${number}` | ''}`

type ShortLocalizedDate = `${ShortDayOfMonth}/${ShortMonth}/${LongYear}`

type MediumLocalizedDate = `${ShortNamedMonth} ${DayOfMonth}, ${LongYear}`

type OrdinalLocalizedDate = `${ShortNamedMonth} ${DayOfMonth}th, ${LongYear}`

type BiggerLocalizedDate = `${LongDayOfWeek}, ${LongNamedMonth} ${DayOfMonth}th, ${LongYear}`

type ShortLocalizedTime = `${RangeType<1, 12>}:${MinuteOrSecond} ${AMorPM}`

type ShortLocalizedTimeWithMilliseconds = `${RangeType<
  1,
  12
>}:${MinuteOrSecond}:${MinuteOrSecond} ${AMorPM}`

type ShortLocalizedTimeWithMillisecondsAndTimezone = `${ShortLocalizedTimeWithMilliseconds} ${
  string /* TODO: proper timezone types*/
}`

// TODO: fix these. TS2590: Expression produces a union type that is too complex to represent.
type ShortDateAndTime = string // `${ShortLocalizedDate} ${ShortLocalizedTime}`
type OrdinalDateAndTimeWithMilliseconds = string // `${OrdinalLocalizedDate} ${ShortLocalizedTimeWithMilliseconds}`

interface FormatMap {
  // Era
  GGGGG: 'A' | 'B'
  GGGG: 'Anno Domini' | 'Before Christ'
  GGG: ShortEra
  GG: ShortEra
  G: ShortEra

  // Calendar year:
  yyyy: LongYear
  yyy: MediumYear
  yy: ShortYear
  yo: OrdinalYear
  y: number

  // Local week-numbering year
  YYYY: LongYear
  YYY: MediumYear
  YY: ShortYear
  Yo: OrdinalYear
  Y: number

  // ISO week-numbering year
  RRRR: LongYear
  RRR: MediumYear
  RR: LeadingZeros<number, 2>
  R: number

  // Extended year
  uuuu: LongYear
  uuu: MediumYear
  uu: LeadingZeros<number, 2>
  u: number

  // Quarter (stand-alone)
  qqqq: `${OrdinalQuarter} quarter`
  qqq: `Q${Quarter}`
  qq: LeadingZeros<Quarter, 2>
  q: Quarter

  // Quarter (formatting)
  QQQQ: `${OrdinalQuarter} quarter`
  QQQ: `Q${Quarter}`
  QQ: LeadingZeros<Quarter, 2>
  Q: Quarter

  // Month (formatting)
  M: RangeType<1, 12>
  Mo: OrdinalMonth
  MM: ShortMonth
  MMM: ShortNamedMonth
  MMMM: LongNamedMonth
  MMMMM: InitialMonth

  // Month (stand-alone)
  L: RangeType<1, 12>
  Lo: OrdinalMonth
  LL: ShortMonth
  LLL: ShortNamedMonth
  LLLL: LongNamedMonth
  LLLLL: InitialMonth

  // Local week of year
  w: ShortWeekOfYear
  wo: OrdinalWeekOfYear
  ww: ShortWeekOfYear

  // ISO week of year
  I: ShortWeekOfYear
  Io: OrdinalWeekOfYear
  II: ShortWeekOfYear

  // Day of month
  d: DayOfMonth
  do: OrdinalDayOfMonth
  dd: ShortDayOfMonth

  // Day of year
  D: DayOfYear
  Do: OrdinalDayOfYear
  DD: ShortDayOfYear
  DDD: MediumDayOfYear
  DDDD: BiggerDayOfYear

  // Day of week (formatting)
  E: MediumDayOfWeek
  EE: MediumDayOfWeek
  EEE: MediumDayOfWeek
  EEEE: LongDayOfWeek
  EEEEE: InitialDayOfWeek
  EEEEEE: ShortDayOfWeek

  // ISO day of week (formatting)
  i: NumberedDayOfWeek
  io: OrdinalDayOfWeek
  ii: ShortNumberedDayOfWeek
  iii: MediumDayOfWeek
  iiii: LongDayOfWeek
  iiiii: InitialDayOfWeek
  iiiiii: ShortDayOfWeek

  // Local day of week (formatting)
  e: NumberedDayOfWeek
  eo: OrdinalDayOfWeek
  ee: ShortNumberedDayOfWeek
  eee: MediumDayOfWeek
  eeee: LongDayOfWeek
  eeeee: InitialDayOfWeek
  eeeeee: ShortDayOfWeek

  // Local day of week (stand-alone)
  c: NumberedDayOfWeek
  co: OrdinalDayOfWeek
  cc: ShortNumberedDayOfWeek
  ccc: MediumDayOfWeek
  cccc: LongDayOfWeek
  ccccc: InitialDayOfWeek
  cccccc: ShortDayOfWeek

  // AM, PM
  a: AMorPM
  aa: AMorPM
  aaa: Lowercase<AMorPM>
  aaaa: PunctuatedAMorPM
  aaaaa: InitialAMorPM

  // AM, PM, noon, midnight
  b: AMorPM | NoonOrMidnight
  bb: AMorPM | NoonOrMidnight
  bbb: Lowercase<AMorPM> | NoonOrMidnight
  bbbb: PunctuatedAMorPM | NoonOrMidnight
  bbbbb: InitialAMorPM | NoonOrMidnight

  // Flexible day period
  B: FlexibleDayPeriod
  BB: FlexibleDayPeriod
  BBB: FlexibleDayPeriod
  BBBB: FlexibleDayPeriod
  BBBBB: FlexibleDayPeriod

  // Hour [1-12]
  h: Hour1to12
  ho: OrdinalHour1to12
  hh: ShortHour1to12

  // Hour [0-23]
  H: Hour0to23
  Ho: OrdinalHour0to23
  HH: ShortHour0to23

  // Hour [0-11]
  K: Hour0to11
  Ko: OrdinalHour0to11
  KK: ShortHour0to11

  // Hour [0-24]
  k: Hour0to24
  ko: OrdinalHour0to24
  kk: ShortHour0to24

  // Minute
  m: MinuteOrSecond
  mo: OrdinalMinuteOrSecond
  mm: ShortMinuteOrSecond

  // Second
  s: MinuteOrSecond
  so: OrdinalMinuteOrSecond
  ss: ShortMinuteOrSecond

  // Fraction of second
  S: TenthOfSecond
  SS: HundredthOfSecond
  SSS: ThousandthOfSecond
  SSSS: TenThousandthOfSecond

  // Timezone (ISO-8601 w/ Z)
  X: TimezoneWithoutColon | 'Z'
  XX: TimezoneWithoutColon | 'Z'
  XXX: TimezoneWithColon | 'Z'
  // TODO: figure out what this is:
  XXXX: TimezoneWithoutColon | `+${number}` | 'Z'
  XXXXX: TimezoneWithColon | `+${number}` | 'Z'

  // Timezone (ISO-8601 w/o Z)
  x: TimezoneWithoutColon
  xx: TimezoneWithoutColon
  xxx: TimezoneWithColon
  // TODO: figure out what this is:
  xxxx: TimezoneWithoutColon | `+${number}`
  xxxxx: TimezoneWithColon | `+${number}`

  // Timezone (GMT)
  O: TimezoneGMT
  OO: TimezoneGMT
  OOO: TimezoneGMT
  OOOO: TimezoneGMT

  // Timezone (specific non-locat.)
  z: TimezoneGMT
  zz: TimezoneGMT
  zzz: TimezoneGMT
  zzzz: TimezoneGMT

  // Seconds timestamp
  t: number
  tt: number

  // Millieconds timestamp
  T: number
  TT: number

  // Long localized date
  P: ShortLocalizedDate
  PP: MediumLocalizedDate
  PPP: OrdinalLocalizedDate
  PPPP: BiggerLocalizedDate

  // Long localized time
  p: ShortLocalizedTime
  pp: ShortLocalizedTimeWithMilliseconds
  ppp: ShortLocalizedTimeWithMillisecondsAndTimezone
  pppp: ShortLocalizedTimeWithMillisecondsAndTimezone

  // Combination of date and time
  Pp: ShortDateAndTime
  PPpp: OrdinalDateAndTimeWithMilliseconds
  // TODO: figure out what PPPppp and PPPPpppp are
}

type TokenizeFormatDate<Format extends string> = '' extends Format
  ? []
  : LongestString<MatchStart<Format, Keys<FormatMap>>> extends infer Token
  ? Token extends string
    ? [Token, ...TokenizeFormatDate<TrimStart<Format, Length<Token>>>]
    : IndexOf<Format, Keys<FormatMap>> extends infer NextTokenIndex
    ? NextTokenIndex extends -1
      ? [Format]
      : [
          TrimEnd<
            Format,
            // @ts-expect-error i think there's a bug in ts with inferred generics not narrowing properly
            NextTokenIndex
          >,
          ...TokenizeFormatDate<TrimStart<Format, IndexOf<Format, Keys<FormatMap>>>>
        ]
    : never
  : never

type _FormattedDate<Format extends string[]> = Format extends []
  ? []
  : // @ts-expect-error stack depth error but it's fine
    [
      Head<Format> extends Keys<FormatMap> ? FormatMap[Head<Format>] : Head<Format>,
      ..._FormattedDate<Tail<Format>>
    ]

/**
 * creates a type for a formatted date string as per the [`date-fns` format](https://date-fns.org/v2.20.1/docs/format)
 */
export type FormattedDate<Format extends string> =
  // @ts-expect-error stack depth error but it's fine
  Join<_FormattedDate<TokenizeFormatDate<Format>>>
