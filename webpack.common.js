const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: {
            name: '@bqx/html-element-builder',
            type: 'umd',
        },
        globalObject: 'this',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            fix: true,
            extensions: ['ts'],
            exclude: '/node_modules/',
            // Output ESLint results to console or file
            emitError: true,
            emitWarning: true,
            failOnError: true,
            failOnWarning: false,
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.ts'],
    },
};
