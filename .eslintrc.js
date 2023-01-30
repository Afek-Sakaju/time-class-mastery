module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    overrides: [],
    parserOptions: {
        ecmaVersion: '12',
    },
    extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended', 'prettier'],
    rules: { 'prettier/prettier': 0 },
    //plugins: ['prettier'], // prettier must be the last plugin on the list always
    ignorePatterns: ['.eslint.*', 'jest.config.js'],
};
