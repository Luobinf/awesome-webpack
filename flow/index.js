// const { SyncHook } = require('tapable')

// 1. 插件体系、钩子
// 2. webpack 里面有很多的插件， 这些插件用来注册一些钩子回调，然后在合适的时间点触发。


class SyncHook {
    constructor(args) {
        this.args = args
        this.argsLength= Array.isArray(args) ? args.length : 0
        this.taps = []
    }
    tap(name, fn) {

    }
    call(name) {

    }
}


let syncHook = new SyncHook(['name'])

syncHook.tap('1', (name) => {  //注册
    console.log(1, name)
})

syncHook.tap('2', (name) => {
    console.log(2, name)
})

syncHook.call('名称')  // 触发