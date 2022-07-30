## 配置入门


entry/output/target/mode

## 环境治理策略

实际项目中大多使用多配置文件进行。

## 核心配置项汇总

### entry 配置详解

Webpack 的基本运行逻辑是从 「入口文件」 开始，递归加载、构建所有项目资源，所以几乎所有项目都必须使用 entry 配置项明确声明项目入口。entry 配置规则比较复杂，支持如下形态：

字符串：指定入口文件路径；
对象：对象形态功能比较完备，除了可以指定入口文件列表外，还可以指定入口依赖、Runtime 打包方式等；
函数：动态生成 Entry 配置信息，函数中可返回字符串、对象或数组；
数组：指明多个入口文件，数组项可以为上述介绍的文件路径字符串、对象、函数形式，Webpack 会将数组指明的入口全部打包成一个 Bundle。


import：声明入口文件，支持路径字符串或路径数组(多入口)；
dependOn：声明该入口的前置依赖 Bundle；
runtime：设置该入口的 Runtime Chunk，若该属性不为空，Webpack 会将该入口的运行时代码抽离成单独的 Bundle；
filename：效果与 output.filename 类同，用于声明该模块构建产物路径；
library：声明该入口的 output.library 配置，一般在构建 NPM Library 时使用；
publicPath：效果与 output.publicPath 相同，用于声明该入口文件的发布 URL；
chunkLoading：效果与 output.chunkLoading 相同，用于声明异步模块加载的技术方案，支持 false/jsonp/require/import 等值；
asyncChunks：效果与 output.asyncChunks 相同，用于声明是否支持异步模块加载，默认值为 true。


## output 配置详解

Webpack 的 output 配置项用于声明：如何输出构建结果，比如产物放在什么地方、文件名是什么、文件编码等。output 支持许多子配置项，包括：

output.path：声明产物放在什么文件目录下；
output.filename：声明产物文件名规则，支持 [name]/[hash] 等占位符；
output.publicPath：文件发布路径，在 Web 应用中使用率较高；
output.clean：是否自动清除 path 目录下的内容，调试时特别好用；
output.library：NPM Library 形态下的一些产物特性，例如：Library 名称、模块化(UMD/CMD 等)规范；
output.chunkLoading：声明加载异步模块的技术方案，支持 false/jsonp/require 等方式。
等等。


## 使用 target 设置构建目标

用于设置构建目标，不同目标会导致产物内容有轻微差异，支持 Node、Web、Electron、WebWorker 等场景；具体可以看文档。


## 使用 mode 短语

production：默认值，生产模式，使用该值时 Webpack 会自动帮我们开启一系列优化措施：Three-Shaking、Terser 压缩代码、SplitChunk 提起公共代码，通常用于生产环境构建；

development：开发模式，使用该值时 Webpack 会保留更语义化的 Module 与 Chunk 名称，更有助于调试，通常用于开发环境构建；

none：关闭所有内置优化规则。

mode 规则比较简单，一般在开发模式使用 mode = 'development'，生产模式使用 mode = 'production' 即可。



## Webpack 并行构建方法？



## 持久化缓存

cache


# webpack 工作流

node --inspect-brk ./node_modules/webpack-cli/bin/cli.js

调试的 3 种方式： vscode、chrome、直接写一个文件debugger。


tapable.js


webpack 编译流程。

1、配置文件和shell中的参数进行合并，得到最终的配置对象。
2、根据上一步的对象初始化Compiler对象。
3、加载所有的插件(插件初始化去监听webpack打包过程中感兴趣的事件，等待webpack在特定的时间节点广播事件，插件调用webpack暴露出来的API，以此插件可以做一些事情)。
4、执行Compliler对象的 run 方法开始执行编译。
5、根据配置文件中的 entry 配置找到入口。
6、从入口文件出发，调用所配置的loader规则，对模块进行编译，例如loader对模块进行编译。
7、找出此模块依赖的模块，递归的进行编译。
8、等把所有的模块编译完成之后，根据模块之间的依赖关系组装成一个个包含多个模块的chunk。（一块来说每个入口会生成一个代码块 chunk、每个代码块会放着本入口模块和它依赖的模块）。
9、再把各个代码块（chunk）转化成一个一个的文件加入到输出列表（assets）
10、确定好输出内容之后，会根据配置的输出的路径和文件名，把文件内容写到文件系统中。

在此过程中，webpack 会在合适的时间点广播特定的时间，你可以写插件监听感兴趣的事件，执行特定的逻辑。


**一般来说，一个 entry 表示一个chunk，该chunk包含了所有该入口文件下面的所有依赖（模块）。**

一个 entry 只打包出一个 js 文件吗？splitChunks、动态import

会有一个文件匹配多个规则的情况，loader规则进行累加。

plugin 和 loader 区别？

loader 在编译中的某一个点进行的，而 plugin 可以贯穿 webpack 的编译流水线中。

通过loader翻译后的内容是js内容。


1. 等待完成 loader解析 。