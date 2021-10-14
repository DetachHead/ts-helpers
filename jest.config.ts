import { Config } from '@jest/types'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))[^d]\\.ts$',
    globals: {
        'ts-jest': {
            babelConfig: {
                presets: ['power-assert'],
            },
        },
    },
}
export default config
