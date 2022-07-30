const path = require("path");
const parser = require("@babel/parser");
const types = require("@babel/types");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const fs = require("fs");
const { isExistFile, tryPathResolve } = require("./utils/index")

const currentWorkDirectory = process.cwd();

class Compilation {
  constructor(options = {}) {
    this.options = options;
    this.modules = [];
    this.chunks = [];
    this.assets = {}
  }
  build(callback) {
    // 根据入口文件开始构建
    const { entry } = this.options;
    // entry 字符串，对象
    console.log(entry, "entry");
    if (typeof entry === "string") {
      // 特殊处理后续做
    } else {
      for (let entryName in entry) {
        const entryPath = entry[entryName];
        let module = this.buildModule(entryName, entryPath);
        this.modules.push(module);
        let chunk = {
          name: entryName,
          entryModule: module,
          modules: this.modules.filter(module => module.names.includes(entryName))
        }
        this.chunks.push(chunk);
      }
      // console.log(this.modules)
      // console.log(this.chunks)
      // console.log(JSON.stringify(this.modules), '------')
      // console.log(JSON.stringify(this.chunks), '------')
      this.chunks.forEach(chunk => {
        const { output = {} } = this.options
        if(!output.filename) {
          throw new Error(`Webpack Output Filename Error:  ${output.filename}`)
        }
        const filename = output.filename.replace('[name]', chunk.name)
        this.assets[filename] = generateAsset(chunk)
      })
    }
    callback(null,
      {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets
      })
  }
  buildModule(moduleName, modulePath) {
    modulePath = path.join(currentWorkDirectory, modulePath);
    // console.log(moduleName, modulePath, 88)
    if (isExistFile(modulePath)) {
      const fileContent = fs.readFileSync(modulePath, 'utf8')
      const ast = parser.parse(fileContent, {
        sourceType: "unambiguous",
        plugins: [],
      })
      // 构建依赖图
      let module = {
        id: './' + path.relative(currentWorkDirectory, modulePath),
        names: [moduleName],
        dependencies: [],
      }
      let baseDirectory = path.dirname(modulePath)
      traverse(ast, {
        CallExpression({ node }) {
          const { callee } = node
          if(callee.name === 'require') {
            const value = node.arguments[0].value
            let depModulePath = tryPathResolve(path.join(baseDirectory, value))
            let depModuleId = './'+ path.relative(currentWorkDirectory, depModulePath)
            // console.log(depModuleId, depModulePath, '===')
            module.dependencies.push({ depModuleId, depModulePath })
            node.arguments[0].value = depModuleId
          }
        },
        ImportDeclaration({ node }) {
          // 后续加上这一部分内容的解析
          console.log(node.type, 'hello==')
          // const subModulePath = moduleResolver(
          //   curModulePath,
          //   path.get("source.value").node
          // );
          // if (!subModulePath) {
          //   return;
          // }
          // const specifiers = path.get("specifiers");
          // graphNode.imports[subModulePath] = specifiers.map(
          //   (specifiersPath) => {
          //     if (specifiersPath.isImportSpecifier()) {
          //       return {
          //         type: IMPORT_TYPE.DECONSTRUCT,
          //         imported: specifiersPath.get("imported").node.name,
          //         local: specifiersPath.get("local").node.name,
          //       };
          //     } else if (specifiersPath.isImportDefaultSpecifier()) {
          //       return {
          //         type: IMPORT_TYPE.DEFAULT,
          //         local: specifiersPath.get("local").node.name,
          //       };
          //     } else if (specifiersPath.isImportNamespaceSpecifier()) {
          //       return {
          //         type: IMPORT_TYPE.NAMESPACE,
          //         local: specifiersPath.get("local").node.name,
          //       };
          //     }
          //   }
          // );
          // const subModules = new GraphNode();
          // traverseJsModule(subModulePath, subModules, allModules);
          // graphNode.subModules[subModulePath] = subModules;
        },
      })

      const { code } = generator(ast)
      module.__source = code

      module.dependencies.forEach( ({ depModuleId, depModulePath }) => {
        // console.log(depModuleId, depModulePath, '===---===')
        const module = this.buildModule(moduleName, depModuleId)
        let existModule = this.modules.find(item => item.id === depModuleId)
        if(existModule) {
          existModule.names.push(moduleName)
        } else {
          this.modules.push(module)
        }
      })

      return module
    } else {
      throw new Error(`Could not find file:  ${modulePath}`);
    }
  }
}


function generateAsset(chunk) {
  return `
  (() => {
    var __webpack_modules__ = {
      ${
        chunk.modules.map( module => {
          return `
            "${module.id}": ( module,exports,require) => {
                ${module.__source}
              }
          `
        })
      }
    };
    // The module cache
    var __webpack_module_cache__ = {};
  
    // The require function
    function __webpack_require__(moduleId) {
      // Check if module is in cache
      var cachedModule = __webpack_module_cache__[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      // Create a new module (and put it into the cache)
      var module = (__webpack_module_cache__[moduleId] = {
        // no module.id needed
        // no module.loaded needed
        exports: {},
      });
  
      // Execute the module function
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  
      // Return the exports of the module
      return module.exports;
    }
    // startup
    // Load entry module and return exports
    // This entry module can't be inlined because the eval devtool is used.
    var __webpack_exports__ = __webpack_require__("${chunk.entryModule.id}");
  })();
  `
}


module.exports = Compilation;


// webpack development 生成的
// (() => {
//   var __webpack_modules__ = {
//     "./src/about.js": (
//       __unused_webpack_module,
//       __unused_webpack_exports,
//       __webpack_require__
//     ) => {
//       eval(
//         'let title = __webpack_require__(/*! ./title.js */ "./src/title.js");\nconsole.log("about:", title);//loader2//loader1\n\n//# sourceURL=webpack://awesome-webpack/./src/about.js?'
//       );
//     },

//     "./src/title.js": (module) => {
//       eval(
//         'module.exports = "title";//loader2//loader1\n\n//# sourceURL=webpack://awesome-webpack/./src/title.js?'
//       );
//     },
//   };
//   // The module cache
//   var __webpack_module_cache__ = {};

//   // The require function
//   function __webpack_require__(moduleId) {
//     // Check if module is in cache
//     var cachedModule = __webpack_module_cache__[moduleId];
//     if (cachedModule !== undefined) {
//       return cachedModule.exports;
//     }
//     // Create a new module (and put it into the cache)
//     var module = (__webpack_module_cache__[moduleId] = {
//       // no module.id needed
//       // no module.loaded needed
//       exports: {},
//     });

//     // Execute the module function
//     __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

//     // Return the exports of the module
//     return module.exports;
//   }
//   // startup
//   // Load entry module and return exports
//   // This entry module can't be inlined because the eval devtool is used.
//   var __webpack_exports__ = __webpack_require__("./src/about.js");
// })();