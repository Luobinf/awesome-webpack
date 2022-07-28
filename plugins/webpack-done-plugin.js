class WebpackDonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tap('WebpackDonePlugin', () => {
            console.log(11, this.options)
        })
    }
}

module.exports = WebpackDonePlugin