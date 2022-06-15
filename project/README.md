# 项目经验

- [项目经验](#项目经验)
  - [km-bundle-size](#km-bundle-size)
  - [rb-img-lazy](#rb-img-lazy)
  - [webpack-bundle-analyzer](#webpack-bundle-analyzer)
  - [长列表优化方案](#长列表优化方案)
    - [懒加载(可视区加载)](#懒加载可视区加载)
    - [虚拟列表](#虚拟列表)

## km-bundle-size

一个 `webpack` 插件

参考:

1. [GoogleChromeLabs/size-plugin](https://github.com/GoogleChromeLabs/size-plugin/blob/master/src/publish-size.js)
2. [bundle.js 大小的可视化工具](https://segmentfault.com/a/1190000009496878)

步骤:

1. 名为 km-bundle-size
2. 定义一个 apply 方法
3. 指定一个绑定到 webpack 自身的事件钩子。
    a. 这个插件中 webpack 完成的时候触发  
    b. 版本 webpack > 4: compiler.hooks.done.tapAsync 异步调用  
    c. compiler 对象代表了完整的 webpack 环境配置  
    d. compilation 对象代表了一次资源版本构建
4. 遍历 stars.compilation.assets ，记录 文件大小，上次大小，时间戳，并且 使用 node fs 模块保存 json

优化点:

1. 根据版本号来记录或查看
2. 兼容立即使用. 可用于生产环境

## rb-img-lazy

图片懒加载

原理:

1. data-src
2. getBoundingClientRect
3. [throttle](../js/code/throttle.js)

```js
function loadImage() {
    const imgs = document.querySelectorAll('img[data-src]')
    if (imgs.length ===0) return

    imgs.forEach((img) => {
        const rect = img.getBoundingClientRect()

        if (rect.top < windown.innerHeight) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
        }
    })
}

// 节流
function throttle() {}

window.addEventListener('scroll', throttle(() => {
    loadImage()
}, 100))

// 默认执行一次
loadImage()
```

## webpack-bundle-analyzer

安装: `yarn add -D webpack-bundle-analyzer`

使用:

```js
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isAnalyzeMode = process.env.ANALYZE_MODE === 'analyze'

module.exports = {
    configureWebpack: config => {
        if (isAnalyzeMode) {
            config.plugins.push(new BundleAnalyzerPlugin({
                analyzerMode: 'static'
            }))
        }
    }
}

// package.json
"script": {
    "build:analyze": "vue-cli-service build --mode analyze"
}

// .env.analyze
NODE_ENV = production
ANALYZE_MODE = 'analyze'
```

优化步骤

1. 移除, 替换第三方库
   - 检查是否有重复模块(lodash)
   - 检查体积过大的模块, 看是否可以用其他库代替(moment 替换成 day.js)
   - 第三方库 使用 `.es` 版本, 有 `tree-shaking` 优势

2. 按需加载
   - 比如有些库有附加模块, moment 有 local(国际化)模块, 不需要的话, 使用 `ignorePlugin` 去掉
   - UI 库按需加载(elementUI, ant-design 等)
   - 路由组件按需加载

3. 拆分第三方库
   - 利用 `SplitChunksPlugin` 优化文件大小
   - 注意是否支持并行加载文件数
     - HTTP 对同域名有限制, HTTP 2 突破限制
   - 自动分割, 添加 `minSize: 300*1024`

## 长列表优化方案

场景:

有一个很多数据的列表，里面有图片资源，表格，地图资源这些需要渲染

方案:

1. 分页
   1. 懒加载
2. 不分页
   1. 可视区切分
   2. 虚拟列表

优化历程

1. `setTimeout`, 分批渲染  
   出现闪屏现象, fps 卡顿问题
2. `requestAnimationFrame`  
   由系统决定回调时间
3. `createDocumentFragment`  
   1.变化不会触发 DOM 树重新渲染, 不会导致性能等问题  
   2.插入到文档片段时不会引起页面回流
4. 滚动 节流操作
5. 虚拟列表

### 懒加载(可视区加载)

方案一

1. 列表容器高度 contentBoxHeight, 单个项目高度 itemHeight
2. 计算一页可展示数量 `singlePageCount`, 列表 展示数据 `realList = dataList.slice(0, singlePageCount)`
3. 鼠标滚轮偏移量 `deltaY`, 滚轮高度 wheelHeight += deltaY
4. `start = Math.floor(wheelHeight / itemHeight)`
5. `realList = dataList.slice(start, start + singlePageCount)`

方案二

`scrollTop + clientHeight <= scrollHeight`

方案三

底部元素进入可视区域: `getBoundingClientRect`

### 虚拟列表

相关文章: [长列表优化之虚拟列表](https://zhuanlan.zhihu.com/p/444778554)

列表项

1. 列表项高度 `itemHeight`, 可视区第一个元素 `startIndex = Math.floor(scrollTop / itemHeight)`, 最后一个元素 `endIndex`
2. 可视区第一个元素偏移量 `startOffset`

优化

1. 滚动过快有白屏
   1. 通过增加缓存区, 也就是增加渲染区域, 大于可视区
   2. skeleton加载骨架屏, 部分渲染, 白屏会变成 loading 状态
