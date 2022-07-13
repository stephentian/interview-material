# 项目经验

- [项目经验](#项目经验)
  - [km-bundle-size](#km-bundle-size)
  - [rb-img-lazy](#rb-img-lazy)
  - [webpack-bundle-analyzer](#webpack-bundle-analyzer)
  - [长列表优化方案](#长列表优化方案)
    - [懒加载(可视区加载)](#懒加载可视区加载)
    - [虚拟列表](#虚拟列表)
    - [动态监听 DOM 高度变化](#动态监听-dom-高度变化)
  - [首屏优化](#首屏优化)
  - [设计一个前端统计](#设计一个前端统计)
    - [分析需求](#分析需求)
    - [代码结构](#代码结构)
  - [hybrid 模板更新](#hybrid-模板更新)
    - [下载时机](#下载时机)
  - [前端脚手架](#前端脚手架)
  - [前端 UI库](#前端-ui库)
    - [vue 组件](#vue-组件)

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
4. 遍历 stats.compilation.assets ，记录 文件大小，上次大小，时间戳，并且 使用 node fs 模块保存 json

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
   - 第三方库 使用 `.es` 版本, 有 `tree-shaking` 优势(ESModule import 异步加载, require 同步加载)

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

相关文章:

1. [长列表优化之虚拟列表](https://zhuanlan.zhihu.com/p/444778554)
2. [how-to-make-virtual-scroll](https://stackoverflow.com/questions/60924305/how-to-make-virtual-scroll)

列表项

1. 列表项高度 `itemHeight`, 可视区第一个元素 `startIndex = Math.floor(scrollTop / itemHeight)`, 最后一个元素 `endIndex`
2. 可视区第一个元素偏移量 `startOffset`
3. 撑开容器, 可持续滚动, 三种方案
   - `padding`
   - `transform: translateY(0px)`
   - 空盒子 `height`

列表项不定高

1. 通过 `ResizeObserver` 监听元素变化, 得到高度
2. 用一个 `listPositions` 维护一个项目未知数组

优化

1. 滚动过快有白屏
   1. 通过增加缓存区, 也就是增加渲染区域, 大于可视区
   2. skeleton加载骨架屏, 部分渲染, 白屏会变成 loading 状态

### 动态监听 DOM 高度变化

上面所说的都是列表项高度固定

当遇到列表项含有图片资源时, 他们会在渲染是发起请求, 图片加载触发浏览器重排, 然后列表项高度被撑开

尝试以下方法:

1. MutationObserver
2. IntersectionObserver
3. ResizeObserver
4. iframe
5. 资源 onload 事件

一. MutationObserver

该 API 提供监听对 DOM 树变化的能力

方法

- observe(target, config)
  - target: element 需要监听元素
  - config: 需要监听的属性
- disconnect: 停止实例接收通知, 且回调函数不会被调用
- takeRecords: 删除所有待处理的通知，并将它们返回到MutationRecord 对象的新 Array 中

可监听属性

```js
const config = {
    childList: true, // 子节点的变动（新增、删除或者更改）
    attributes: true, // 属性的变动
    characterData: true, // 节点内容或节点文本的变动
    subtree: true, // 是否将观察器应用于该节点的所有后代节点
}
```

```js
// 创建实例 并传入回调函数
const observer = new MutationObserver((mutationList) => {
    if (height !== contentRef.current?.clientHeight) {
        console.log("高度变化了！");
        setHeight(contentRef.current.clientHeight);
    }
});
// 开始监听节点
observer.observe(targetNode, config);
// 停止观察
observer.disconnect();
```

缺点:

1. 是用 maxHeight 没有设置 height, 所以没有元素属性的变化, 监听不到
2. 使用动画 animation 改变容器, 也会监听不到

二. IntersectionObserver

可以监听一个元素是否进入用户视野

三. ResizeObserver

监听到 Element 的内容区域或 SVGElement的边界框改变。内容区域则需要减去内边距 padding. 直接监听元素尺寸变化

方法

- observe()
- unobserve
- disconnect

缺点:

  1. 兼容性不够, 使用它 ResizeObserver-polyfill 完成兼容

四. iframe

`ResizeObserver-polyfill` 源码中使用的方案, 监听 resize 变化

在容器里面嵌套一个隐藏的高度为 100% 的 iframe，通过监听他的 resize 事件，当容器尺寸变化时，自然会 iframe 尺寸也会改变，通过`contentWindow.onresize()` 就能监听得到

缺点:

- 不够优雅, 需要插入 iframe 元素

## 首屏优化

一、网络层

1. CDN 加速

2. Nginx 开启 gzip, 可以减小60%以上的体积

二、文件处理

1. 对 js 第三方库的优化，分离打包

2. 懒加载，（路由，组件，图片）

3. 资源的压缩，js 压缩，css压缩，图片资源，使用雪碧图，icon 使用字体库等

4. 代码层面优化
   - 尽量少对 DOM 节点进行插入和移除（造成重排，页面渲染）

三、技术方案

1. ssr 服务端渲染
   - 现在的前后端分离的渲染页面的方式复杂，需要下载文件，本地构建
   - 古老的技术，PHP，ASP，JSP。如今 nuxt, next

2. 骨架屏

3. Loading 动画

四、APP 端

1. 开启预加载，pre-fetch，一些浏览器也可以开启
2. APP 提前缓存 HTML，CSS，JS 文件； webview 使用 file:// 协议加载静态文件

## 设计一个前端统计

客户端 => 服务端 => 产出统计结果（数据表格，折线图，饼图等）

结果 => 优化客户端

形成业务闭环，而不是单是做收集数据

### 分析需求

- 访问量 PV
- 自定义事件(用户调查，是否分享，好评等)
- 性能
- bug
- 接口统计(拦截 http)

### 代码结构

- projectId 不同项目，不同业务线用不同的
- send 发送数据方法
- pv, error, preformance, event 等
- 用 img 发送（ajax 发送可能跨域）

[数据统计 Data Statistic](./DataStatistic.js)

## hybrid 模板更新

- App 下载模板文件(html, css)
- 使用 file 协议加载本地文件到 webview
- html 发起 ajax 请求

- CMS 系统上传 模板文件,
- 模板文件版本控制

### 下载时机

- App 启动时检查
- 实时，定时器(5min) 等

## 前端脚手架

## 前端 UI库

- package 发布到 npm
- view 预览
- src 源码
- 测试用例

### vue 组件

一个项目管理多个模块/组件，每个组件就是一个包，需要有 package.json
