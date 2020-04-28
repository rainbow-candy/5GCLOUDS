module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'editor.detectIndentation: false': 0,
    'quote-props': 0,
    'semi': 0,
    'no-control-regex': 0,
    'no-div-regex': 0,
    'no-invalid-this': 'error',
    'no-regex-spaces': 0,
    'no-invalid-regexp': 0,
    'no-useless-escape': 0
  }
}
