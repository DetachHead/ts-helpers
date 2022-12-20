/** @type {import('eslint').Linter.ParserOptions} */
const parserOptions = {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
}

/** @type {import('eslint').Linter.ParserOptions} */
const configFileParserOptions = { ...parserOptions, project: ['./tsconfig.json'] }

/** @type {import('eslint').Linter.Config} */
const config = {
    extends: ['@detachhead/eslint-config'],
    parserOptions: {
        ...parserOptions,
        project: ['./src/tsconfig.json'],
    },
    rules: {
        'import/no-extraneous-dependencies': [
            'error',
            { devDependencies: ['.eslintrc.cjs', 'test/**/*.ts'] },
        ],
    },
    overrides: [
        {
            files: ['test/**/*.ts'],
            parserOptions: { ...parserOptions, project: ['./test/tsconfig.json'] },
        },
        {
            files: ['jest.config.ts'],
            parserOptions: configFileParserOptions,
        },
        {
            files: ['.eslintrc.js'],
            parserOptions: configFileParserOptions,
            rules: {
                // commonjs cant use esm imports, duh
                '@typescript-eslint/no-var-requires': 'off',

                // typescript-eslint enables these for typescript files only, but the js config files can benefit from it too because we aren't targeting an ancient node version
                'no-var': 'error',
                'prefer-const': 'error',
            },
        },
    ],
}

module.exports = config
