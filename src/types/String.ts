import _ from 'lodash'
import { CharAt } from '../utilityTypes'

/**
 * replaces all occurrences of `find` in the given string with `replace`
 */
export function replaceAll(str: string, find: string, replace: string): string {
	return str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace)
}

/**
 * better version of {@link String.prototype.match} that doesn't allow for empty match arrays
 *
 * useful when using the `noUncheckedIndexedAccess` compiler option
 * @see https://github.com/microsoft/TypeScript/issues/42296
 */
export function match(str: string, regex: RegExp): (RegExpMatchArray & [string]) | null {
	return str.match(regex) as (RegExpMatchArray & [string]) | null
}

/**
 * gets the character at the given `index` at compiletime
 */
export function charAt<T extends string, I extends number>(string: T, index: I): CharAt<T, I> {
	return string.charAt(index) as CharAt<T, I>
}
