import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
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
