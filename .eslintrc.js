module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
  ],
  'parserOptions': {
    'ecmaVersion': 6,
    "sourceType": "module"
  },
  'rules': {
    "no-unused-vars": 1,
    "no-trailing-spaces": 1,
    "class-methods-use-this": 1,
    "max-len": [2, 120],
    "indent": 1,
    "func-names": 0,
    "no-param-reassign": 1,
    "space-before-function-paren": 1,
    "lines-between-class-members": 1,
    "import/prefer-default-export": 0,
    "comma-dangle": 1,
    "no-useless-constructor": 1,
    "arrow-parens": 1,
    "arrow-body-style": 1,
    "no-void": 1,
    "no-console": 1,
    "no-else-return": 1,
    "no-trailing-spaces": 1
  },
};
