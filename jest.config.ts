import type { JestConfigWithTsJest } from 'ts-jest/dist/types'

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '/test/.*.ts',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
}
export default config
