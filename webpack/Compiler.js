const { SyncHook } = require("tapable");
const Compilation = require("./Compilation");
const fs = require("fs");
const { tryCreateOutputDir } = require("./utils");
const currentWorkDirectory = process.cwd();
const path = require("path");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  run(callback) {
    this.hooks.run.call();
    const onCompiled = (err, stat) => {
      const { output } = this.options;
      let isDistDir = false;
      if (output.path) {
        tryCreateOutputDir(output.path);
        isDistDir = false;
      } else {
        fs.mkdirSync(path.join(currentWorkDirectory, "dist"));
        isDistDir = true;
      }
      const { assets } = stat;
      for (let asset in assets) {
        let filePath = null;
        if (isDistDir) {
          filePath = path.join(output.path, asset);
        } else {
          filePath = path.join(path.join(currentWorkDirectory, "dist"), asset);
        }
        fs.writeFileSync(filePath, assets[asset], "utf8");
      }
      callback(err, stat);
      this.hooks.done.call(); //触发编译结束钩子
    };
    this.compile(onCompiled);
  }
  compile(callback) {
    let compilation = new Compilation(this.options);
    compilation.build(callback);
  }
}

module.exports = Compiler;
