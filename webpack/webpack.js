const Compiler = require('./Compiler.js')

function webpack(options = {}) {
    let finallyOptions = options // 与 shell 中的参数合并

    const compiler = new Compiler(finallyOptions)

    loadPlugins(options.plugins, compiler) //加载所有的插件

    return compiler
}

function loadPlugins(plugins = [], compiler ) {
    plugins.forEach(plugin => {
        plugin.apply(compiler)
    });
}

module.exports = webpack