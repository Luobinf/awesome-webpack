const WebpackRunPlugin = require('./plugins/webpack-run-plugin')
const WebpackDonePlugin = require('./plugins/webpack-done-plugin')
const path = require('path')

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, 'loaders/logger-loader.js'),
                    path.resolve(__dirname, 'loaders/logger2-loader.js'),
                ]
            },
            {
                test: /\.css$/,
                use: [
                    path.resolve(__dirname, 'loaders/style-loader.js')
                ]
            }
        ]
    },
    plugins: [
        new WebpackRunPlugin(),
        new WebpackDonePlugin()
    ]
}