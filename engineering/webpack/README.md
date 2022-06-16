# Webpack

- [Webpack](#webpack)
  - [如何利用 webpack 优化前端性能](#如何利用-webpack-优化前端性能)
  - [什么是 Tree-shaking？](#什么是-tree-shaking)
  - [Loder 和 Plugins 的不同](#loder-和-plugins-的不同)
  - [手写一个 Loader](#手写一个-loader)
  - [手写一个 Plugin](#手写一个-plugin)
  - [如何提高 webpack 的构建速度](#如何提高-webpack-的构建速度)
  - [说说 webpack 的热更新HMR](#说说-webpack-的热更新hmr)

## 如何利用 webpack 优化前端性能

指优化 webpack 的输出结果，即使项目在浏览器运行快速高效

- 压缩代码。`UglifyJsPlugin`、`cssnano`
- 删除死代码(Tree Shaking)。`--optimize-minimize`
- 利用 CDN 加速。
- 提取公共代码

## 什么是 Tree-shaking？

tree-shaking 指打包中去除在代码中没有被用到的那些死代码。
js: UglifyJsPlugin
css: purify-CSS

## Loder 和 Plugins 的不同

1. 作用不同

   - Loader 加载器，让加载和解析非 JavaScript 文件的能力
   - Plugins 插件，在 webpack 运行的适当的时期，改变输出结果，扩展 webapck 的功能

2. 用法不同

   - Loader 在 modlue.rules 中配置，
   - Plugins 在 plugins 中单独配置。每一项是 plugin 的实例

## 手写一个 Loader

打包时, 将 `'a'` 替换成 `'b'`

```js
// replaceLoser.js

// loader-utils工具包
const loaderUtils = require('loader-utils')
// loader暴露的函数，其中source就是传入的文件资源或者上一个loader处理后的内容
module.exports = function(source) {
  const options = loaderUtils.getOptions(this)
  return source.replace('a', options.name)
}

// vue.config.js 或 webpack.config

module.exports = {
  module: {
    rules: [{
      test: /\.js/,
      use: [{
        loader: path.resolve(__dirname, 'replaceLoser.js'),
        options: {
          name: 'b'
        }
      }]
    }]
  }
}
```

## 手写一个 Plugin

```js
// myPlugin.js

class myPlugin {
  constructor() {}

  // compiler 对象包含了 Webpack 环境所有的的配置信息
  apply(compiler) {
    compiler.plugin('done', compilation => {
      console.log('firstPlugin')
    })
  }
}
module.exports = myPlugin

```

## 如何提高 webpack 的构建速度

1. 多入口情况下，使用 `CommonsChunkPlugin` 来提取公共代码
2. 使用 `Happypack` 实现多线程加速编译
3. Tree-shaking
4. 通过 externals 配置来提取常用库

## 说说 webpack 的热更新HMR

webpack的热更新又称热替换（Hot Module Replacement），缩写为HMR。
这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

核心是 `websocket` 数据交互, 不需要刷新界面发起数据请求

步骤原理:

1. 使用 webpack-dev-server (后面简称 WDS)托管静态资源，同时以 Runtime 方式注入 HMR 客户端代码
2. 浏览器加载页面后，与 WDS(server) 建立 WebSocket 连接
3. Webpack 监听到文件变化后，增量构建发生变更的模块，并通过 WebSocket 发送 hash 事件
4. 浏览器接收到 hash 事件后，请求 manifest 资源文件，确认增量变更范围
5. 浏览器加载发生变更的增量模块
6. Webpack 运行时触发变更模块的 module.hot.accept 回调，执行代码变更逻辑
