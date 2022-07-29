const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const types = require("@babel/types");
const { callbackify } = require("util");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

// 当前命令所在的目录
const baseDir = toUnixPath(process.cwd());

class Compilation {
  constructor(options) {
    this.options = options;
    this.modules = [];
    this.chunks = [];
    this.assets = {};
    // 主要是为了实现watch，监听文件的变化，文件发生变化后会重新进行编译。
    this.fileDependencies = [];
  }

  build(callback) {
    // 5、根据配置文件中的 entry 配置找到入口。
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
    for (let entryName in entry) {
      // 入口的名称就是entry的属性名，也将会成为代码块的名称。
      let entryFilePath = path.posix.join(baseDir, entry[entryName]);
      // 将入口文件的绝对路径添加到依赖数组中
      this.fileDependencies.push(entryFilePath);
      // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
      let entryModule = this.buildModule(entryName, entryFilePath);
      this.modules.push(entryModule);
      // 8、等把所有的模块编译完成之后，根据模块之间的依赖关系组装成一个个包含多个模块的chunk。（一块来说每个入口会生成一个代码块 chunk、没个代码块会放着本入口模块和她依赖的模块）
      let chunk = {
        name: entryName,
        entryModule, // 此代码块对应的入口模块的对象
        module: this.modules.filter((module) =>
          module.names.includes(entryName)
        ),
      };
      this.chunks.push(chunk);
      // 9、再把各个代码块转化成一个一个的文件加入到输出列表
      this.chunks.forEach(chunk => {
        let filename = this.options.output.filename.replace('[name]', chunk.name);
        this.assets[filename] = getSource(chunk)
      })

      callback(null, {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets
      })
    }
  }

  // 当你编译模块的时候，你需要知道这个模块是属于哪一个代码块的, name用于标记属于哪个代码块用的
  buildModule(name, modulePath) {
    // 6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
    // 6.1 读取模块内容
    let moduleSourceCode = fs.readFileSync(modulePath, "utf8");

    // buildModule 返回一个模块对象， 每个模块都会有一个 moduleId， moduleId 等于相对于根目录的相对路径
    let moduleId = "./" + path.posix.relative(baseDir, modulePath);

    // name 表示此模块属于哪个代码块，一个模块可能会属于多个代码块。
    let module = {
      id: moduleId,
      names: [name],
      dependencies: [],
    };

    // 查找对应的loader对源码进行翻译和转化
    let loaders = [];
    let { rules = [] } = this.options.module;
    rules.forEach((rule) => {
      const { test, use = [] } = rule;
      if (modulePath.match(test)) {
        loaders.push(...use);
      }
    });

    // 自右向左对模块进行编译
    loaders.reduceRight((sourceCode, loader) => {
      return require(loader)(sourceCode);
    }, moduleSourceCode);

    // 7、找出此模块依赖的模块，递归的进行编译。

    const ast = parser.parse(moduleSourceCode, {
      sourceType: "unambiguous",
      plugins: [],
    });

    traverse(ast, {
      CallExpression: (path) => {
        const { node } = path;
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require"
        ) {
          // 依赖模块
          let depModuleName = node.arguments[0].value;
          let dirname = path.posix.dirname(modulePath);
          // 获取依赖模块的文件路径
          let depModulePath = path.posix.join(dirname, depModuleName);

          let extensions =
            this.options.resolve && this.options.resolve.extensions;
          depModulePath = tryExtensions(depModulePath, extensions);

          this.fileDependencies.push(depModulePath);

          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);
          // 修改语法树结构， 把依赖的模块改为依赖模块 ID
          // require('./title') => require('./src/title.js')
          node.arguments = [types.stringLiteral(depModuleId)];
          module.dependencies.push({
            depModuleId,
            depModulePath,
          });
        }
      },
    });

    let { code } = generator(ast);
    // 把转译的源代码存放到 module._source 属性上
    module._source = code;

    // 再递归本步骤找到依赖的模块进行编译
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      let existModule = this.modules.find((item) => item.id === depModuleId);
      // 已经编译过了就不需要编译了
      if (existModule) {
        existModule.names.push(name);
      }
      let depModule = this.buildModule(name, depModulePath);
      this.modules.push(depModule);
    });

    return module;
  }
}

function getSource(chunk) {
    
}

function tryExtensions(modulePath, extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let extension of extensions) {
    modulePath = modulePath + extension;
    if (fs.existsSync(modulePath)) {
      return modulePath;
    }
  }
  throw new Error("Couldn't find module " + modulePath);
}

function toUnixPath(path) {
  return path.replace(/\\/g, "/");
}

module.exports = Compilation;

// name 什么意思？？
// loader 是什么？？
