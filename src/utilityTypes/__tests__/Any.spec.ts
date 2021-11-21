import { exactly } from '../../utilityFunctions/misc'
import { Replace, ReplaceRecursive } from '../Any'

describe('Replace', () => {
    test('union', () => {
        exactly<string | symbol | boolean, Replace<string | number | boolean, number, symbol>>()
    })
})

describe('ReplaceRecursive', () => {
    test('object', () => {
        exactly<
            { a: number; b: number; c: string },
            ReplaceRecursive<{ a: boolean; b: boolean; c: string }, boolean, number>
        >()
    })
})
