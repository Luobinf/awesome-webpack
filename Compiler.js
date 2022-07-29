const { SyncHook } = require("tapable");
const Compilation = require("./Compilation")
const fs = require("fs");
const path = require("path");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  // 4、执行Compliler对象的 run 方法开始执行编译。
  run(callback) {
    // 编译前触发 run 钩子的执行，表示开始启动编译
    this.hooks.run.call()

    // 编译成功之后的回调
    const onCompiled = (err, stats, fileDependencies) => {
        for(let filename in stats.assets) {
          let filePath = path.join(this.options.output.path, filename)
          fs.writeFileSync(filePath, stats.assets[filename], 'utf8')
        }
        callback(err, {
          toJson: () => stats
        })

        fileDependencies.forEach(file => {
          fs.watch(file, () => this.compile(onCompiled))
        });

        this.hooks.done.call()
    }
    // 开始编译,编译是异步的。
    this.compile(onCompiled)
  }

  compile(callback) {
    // webpack 虽然只有一个Compiler，但是每次编译都会产生一个新的 Compilation 对象。
    let compilation = new Compilation(this.options)
    // 5、根据配置文件中的 entry 配置找到入口。
    compilation.build(callback)
  }
}

module.exports = Compiler;
