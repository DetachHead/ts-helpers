module.exports = {
    extends: ['@detachhead/eslint-config'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'off', // OnlyInfer type uses an unused generic
    },
}
