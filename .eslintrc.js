module.exports = {
	'env': {
		'node': true,
		'es2021': true,
		'jest': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:eslint-plugin-expect-type/recommended'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module',
		'project': './tsconfig.json'
	},
	'plugins': [
		'@typescript-eslint',
		'eslint-plugin-expect-type'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'expect-type/expect': 'error'
	}
}
