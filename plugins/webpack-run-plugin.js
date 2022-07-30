class WebpackRunPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.run.tap('WebpackRunPlugin', () => {
            console.log('run:', 11, this.options)
        })
    }
}

module.exports = WebpackRunPlugin