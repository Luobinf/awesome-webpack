

const Compiler = require('./compiler')

function webpack(options = {}) {
    // 1、配置文件和shell中的参数进行合并，得到最终的配置对象。
    const argv = process.argv.slice(2)
    let shellOptions = ardv.reduce( (shellOptions, option) => {
        let [key, value] = option.split('=')
        shellOptions[key.slice(2)] = value
        return shellOptions
    }, {})
    let finalOptions = {
        ...shellOptions,
        ...shellOptions
    }

    // 2、根据上一步的对象初始化Compiler对象。
    const compiler = new Compiler(finalOptions)

    // 3、加载所有的插件。
    const { plugins = [] } = options
    for(let plugin of plugins) {
        plugin.apply(compiler)
    }

    // 4. 执行compiler 的 run 方法
    compiler.run( () => {
        
    })

    return compiler

}


module.exports = webpack