import _ from 'lodash'
import {Range} from '../utilityTypes'

/**
 * gets a random number in the given range from `Min` to `Max` (inclusive)
 * @returns anumber where the type is a union of the possible numbers
 */
export function random<Min extends number, Max extends number>(min: Min, max: Max): Range<Min, Max> {
	return _.random(min, max) as Range<Min, Max>
}