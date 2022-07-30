class WebpackDonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tap('WebpackDonePlugin', () => {
            console.log('done: ', 22, this.options)
        })
    }
}

module.exports = WebpackDonePlugin