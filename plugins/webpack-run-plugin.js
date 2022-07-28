class WebpackRunPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.run.tap('WebpackRunPlugin', () => {
            console.log(11)
        })
    }
}

module.exports = WebpackRunPlugin