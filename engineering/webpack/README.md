# Webpack

- [webpack 构建流程](#webpack-构建流程)
- [常见 loader 和 plugins](#常见-loader-和-plugins)
- [webpack 优化](#webpack-优化)
  - [优化构建速度](#优化构建速度)
  - [优化代码性能](#优化代码性能)
  - [Tree-shaking](#tree-shaking)
- [Loder 和 Plugins 的不同](#loder-和-plugins-的不同)
- [loader](#loader)
  - [手写一个 Loader](#手写一个-loader)
- [Plugins](#plugins)
  - [手写一个 Plugin](#手写一个-plugin)
- [如何提高 webpack 的构建速度](#如何提高-webpack-的构建速度)
- [说说 webpack 的热更新HMR](#说说-webpack-的热更新hmr)
- [webpack 模块联邦](#webpack-模块联邦)
  - [共享模块方式](#共享模块方式)

## webpack 构建流程

1. 初始化: 读取与合并配置参数；加载 Plugin；实例化 Compiler
2. 编译: （调用 Compiler 的 run）从 entry 出发，调用所有配置的 loader 对 module 进行翻译，再递归编译该 module 依赖的 module，最后将编译后的 module 组合成 chunk 及对应资源 assets
3. 输出：把编译得到的 assets 输出到文件系统

## 常见 loader 和 plugins

- 样式资源： css-loader style-loader sass-loader
- 生成 html 资源： html-webpack-plugin
- 图片资源： file-loader url-loader
- css 兼容： postcss-loader
- 压缩资源：optimize-css-assets-webpack-plugin
- 语法检查：eslint-loader

## webpack 优化

### 优化构建速度

1. babel 缓存：cacheDirectory，contenthash
2. 多进程打包
3. externals
4. DLLPlugin 把第三方代码完全分离开，即每次只打包项目自身的代码
5. oneOf：oneOf里面的loader只匹配一个。不能有两个配置处理同一种类型的文件；避免每个文件都被所有loader过一遍

### 优化代码性能

- 压缩代码。`UglifyJsPlugin`、`cssnano`
- 删除死代码(Tree Shaking)。`--optimize-minimize`
- 利用 CDN 加速
- 提取公共代码

### Tree-shaking

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

## loader

loader 本质上是一个函数。

1. loader 的执行顺序在 use 数组里面是 **从下往上** 执行。
2. loader 里面有一个 pitch 方法，use数组中 pitch 方法的执行顺序是从上往下执行，因此我们如果想先执行某些功能，可以先在 pitch 方法中定义。

### 手写一个 Loader

打包时, 将 `'a'` 替换成 `'b'`

```js
// replaceLoader.js

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

## Plugins

### 手写一个 Plugin

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

## webpack 模块联邦

webpack5 出的新特性, Module Federation 模块联邦

这个功能可以跨应用做到模块共享。

`const { ModuleFederationPlugin } = require('webpack').container`

比如：a 应用要使用 b 应用的 list 组件，直接 `import('b/list')`

b：模块消费方 host
a：模块提供方 remote

本地起服务器，然后将包封装成 url，在另一个项目引入

### 共享模块方式

1. npm：发布到 npm 平台
2. umd：直接引入 cdn
3. 微前端：主应用下面建立一个 common 公共模块
4. 模块联邦
