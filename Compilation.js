const fs = require('fs');
const path = require('path');

// 当前命令所在的目录
const baseDir = toUnixPath(process.cwd());

class Compilation {
    constructor(options) {
        this.options = options;
        this.modules = [];
        this.chunks = [];
        this.assets = {}
        // 主要是为了实现watch，监听文件的变化，文件发生变化后会重新进行编译。
        this.fileDependencies = [];
    }

    build() {
        // 5、根据配置文件中的 entry 配置找到入口。
        let entry = {}
        if(typeof this.options.entry === 'string') {
            entry.main = this.options.entry
        } else {
            entry = this.options.entry
        }
        // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
        for(let entryName in entry) {
            // 入口的名称就是entry的属性名，也将会成为代码块的名称。
            let entryFilePath = path.posix.join(baseDir, entry[entryName]);
            // 将入口文件的绝对路径添加到依赖数组中
            this.fileDependencies.push(entryFilePath);
             // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
            let entryModule = this.buildModule(entryName, entryFilePath);
        }
    }

    buildModule(name,  modulePath) {
        // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
        // 6.1 读取模块内容
        let moduleSourceCode = fs.readFileSync(modulePath, 'utf8');
        // 查找对应的loader对源码进行翻译和转化
        let loaders = []
        let { rules = [] } = this.options.module
        rules.forEach(rule => {
            const { test, use = [] } = rule
            if( modulePath.match(test) ) {
                loaders.push(...use)
            }
        });

        // 自右向左对模块进行编译
        loaders.reduceRight( (sourceCode, loader) => {
            return require(loader)(sourceCode)
        }, moduleSourceCode)

        console.log(moduleSourceCode, 112233)

    }
}

module.exports = Compilation;



function toUnixPath(path) {
    return path.replace(/\\/g, '/');
}