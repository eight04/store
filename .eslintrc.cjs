module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"rules": {
    "no-template-curly-in-string": "error",
		"no-use-before-define": ["error", "nofunc"],
    "require-atomic-updates": "off",
		"semi": ["error", "always"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
	},
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  "parserOptions": {
    "ecmaVersion": 2018
  },
  root: true
};
