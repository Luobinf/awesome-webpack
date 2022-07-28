const webpack = require('./webpack');
const options = require('./webpack.config.js')

const compiler = webpack(options)

debugger

compiler.run( (err, stats) => {
    console.log(err)
    console.log(stats.toJson({
        assets: true,
        chunks: true,
        modules: true
    }))
})