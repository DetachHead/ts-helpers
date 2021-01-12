import _ from 'lodash'

/**
 * replaces all occurrences of `find` in the given string with `replace`
 */
export function replaceAll(str: string, find: string, replace: string): string {
	return str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace)
}