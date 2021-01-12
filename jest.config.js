module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  globals: {
    "ts-jest": {
      babelConfig: {
        presets: [
          "power-assert"
        ]
      }
    }
  }
};