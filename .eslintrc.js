module.exports = {
    extends: ['@detachhead/eslint-config', 'plugin:eslint-plugin-expect-type/recommended'],
    plugins: ['eslint-plugin-expect-type'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'off', // OnlyInfer type uses an unused generic
        'expect-type/expect': 'error',
    },
}
