import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '/test/.*.ts',
    globals: {
        'ts-jest': {
            babelConfig: {
                presets: ['power-assert'],
            },
            tsconfig: 'test/tsconfig.json',
        },
    },
}
export default config
