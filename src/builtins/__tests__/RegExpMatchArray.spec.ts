import { exactly } from '../../utilityFunctions/misc'

test('match', () => {
    const foo = ''.match(/a/u)
    if (foo !== null) {
        exactly<string>()(foo[0])
        exactly<string | undefined>()(foo[1])
    }
})
