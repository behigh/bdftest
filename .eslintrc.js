module.exports = {
    root: true,
    extends: 'react-app',
    rules: {
        semi: ['error', 'never'],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                ignoredNodes: ['ConditionalExpression'],
            },
        ],
    },
}
