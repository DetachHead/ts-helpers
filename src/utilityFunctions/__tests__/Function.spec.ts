import { exactly } from '../misc'
import { bindThis } from '../Function'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment -- https://github.com/detachHead/typed-nodejs-assert#with-power-assert
const assert: PowerAssert = require('power-assert')

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
    assert.notDeepEqual(instance, fn())

    exactly(instance, bindThis(instance, 'foo')())
})
