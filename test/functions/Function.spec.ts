import { bindThis } from '../../src/functions/Function'
import { exactly } from '../../src/functions/misc'
import {  notDeepStrictEqual } from 'assert'
import { test } from 'bun:test'

test('bindThis', () => {
    class Class {
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- testing non arrow functions
        foo() {
            return this
        }
    }
    const instance = new Class()

    // sanity check
    // eslint-disable-next-line @typescript-eslint/unbound-method  -- testing this
    const fn = instance.foo
    notDeepStrictEqual(instance, fn())

    exactly(instance, bindThis(instance, 'foo')())
})
