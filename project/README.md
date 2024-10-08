# 项目经验

- [km-bundle-size](#km-bundle-size)
- [图片懒加载 rb-img-lazy](#图片懒加载-rb-img-lazy)
- [webpack-bundle-analyzer](#webpack-bundle-analyzer)
- [长列表优化方案](#长列表优化方案)
  - [懒加载(可视区加载)](#懒加载可视区加载)
  - [虚拟列表](#虚拟列表)
  - [动态监听 DOM 高度变化](#动态监听-dom-高度变化)
    - [MutationObserver](#mutationobserver)
    - [IntersectionObserver](#intersectionobserver)
    - [ResizeObserver](#resizeobserver)
    - [iframe](#iframe)
- [首屏优化](#首屏优化)
- [设计一个前端统计](#设计一个前端统计)
  - [分析需求](#分析需求)
  - [代码结构](#代码结构)
- [hybrid 混合开发模板更新](#hybrid-混合开发模板更新)
  - [下载时机](#下载时机)
- [前端脚手架](#前端脚手架)
  - [脚手架功能](#脚手架功能)
- [前端组件库](#前端组件库)
  - [vue 组件](#vue-组件)
- [网站主题换肤方案](#网站主题换肤方案)
- [设计一个日期选择器](#设计一个日期选择器)
- [tree 树形组件优化](#tree-树形组件优化)
  - [递归](#递归)
  - [优化](#优化)
- [vconsole 小程序调试插件](#vconsole-小程序调试插件)
- [网站支持多语言](#网站支持多语言)

## km-bundle-size

一个 `webpack` 插件，可以在打包的驶挥，输出项目资源对比上一次打包的体积大小变化

参考:

1. [GoogleChromeLabs/size-plugin](https://github.com/GoogleChromeLabs/size-plugin/blob/master/src/publish-size.js)
2. [bundle.js 大小的可视化工具](https://segmentfault.com/a/1190000009496878)

步骤:

1. 名为 `km-bundle-size`
2. 定义一个 `apply` 方法
3. 指定一个绑定到 `webpack` 自身的事件钩子。
    a. 这个插件中 `webpack` 完成的时候触发  
    b. 版本 `webpack > 4`: `compiler.hooks.done.tapAsync` 异步调用  
    c. `compiler` 对象代表了完整的 webpack 环境配置  
    d. compilation 对象代表了一次资源版本构建
4. 遍历 `stats.compilation.assets` ，记录 文件大小，上次大小，时间戳，并且 使用 node fs 模块保存 json

优化点:

1. 根据版本号来记录或查看
2. 兼容立即使用. 可用于生产环境

## 图片懒加载 rb-img-lazy

1. 滚动监听 `scrollTop + clientHeight <= scrollHeight`

2. 滚动监听 `getBoundingClientRect`

3. 检查目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态，`IntersectionObserver`

前两种需要 节流或者防抖，监听会重复触发。

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
3. `createDocumentFragment`  创建虚拟的节点对象
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
   2. skeleton 加载骨架屏, 部分渲染, 白屏会变成 loading 状态

### 动态监听 DOM 高度变化

上面所说的都是列表项高度固定

当遇到列表项含有图片资源时, 他们会在渲染是发起请求, 图片加载触发浏览器重排, 然后列表项高度被撑开

尝试以下方法:

1. MutationObserver
2. IntersectionObserver
3. ResizeObserver
4. iframe
5. 资源 onload 事件

#### MutationObserver

该 API 提供监听对 DOM 树变化的能力

- MutationObserver(callback)
  - 返回一个 MutationObserver 实例，callback 会在 DOM 树发生变动时触发

实例方法

- observe(target, config)
  - target: element 需要监听元素
  - config: 需要监听的属性
- disconnect: 停止实例接收通知, 且回调函数不会被调用
- takeRecords: 删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中

可监听属性

```js
const config = {
    childList: true, // 子节点的变动（新增、删除或者更改）
    attributes: true, // 元素的属性变化
    subtree: true, // 后代元素的变化
    attributeOldValue: true, // 观察目标节点的属性是否已更改
    characterData: true, // 观察目标节点的文本内容是否已更改
    characterDataOldValue: true, // 观察目标节点的文本内容是否已更改
}
```

```js
// 需要监听的节点
const targetNode = document.getElementById("content");

// 回调函数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建实例 并传入回调函数
const observer = new MutationObserver(callback);

// 开始监听节点
observer.observe(targetNode, config);

// 停止观察
observer.disconnect();
```

缺点:

1. 是用 `maxHeight` 没有设置 `height`, 所以没有元素属性的变化, 监听不到
2. 使用动画 `animation` 改变容器, 也会监听不到

#### IntersectionObserver

可以监听一个元素是否进入用户视野

#### ResizeObserver

监听到 Element 的内容区域或 SVGElement的边界框改变。内容区域则需要减去内边距 padding. 直接监听元素尺寸变化

方法

- observe()
- unobserve
- disconnect

缺点:

  1. 兼容性不够, 使用它 ResizeObserver-polyfill 完成兼容

#### iframe

`ResizeObserver-polyfill` 源码中使用的方案, 监听 resize 变化

在容器里面嵌套一个隐藏的高度为 100% 的 iframe，通过监听他的 resize 事件，当容器尺寸变化时，自然会 iframe 尺寸也会改变，通过`contentWindow.onresize()` 就能监听得到

缺点:

- 不够优雅, 需要插入 iframe 元素

## 首屏优化

一、网络层

1. CDN 加速

2. `Nginx` 开启 gzip, 可以减小60%以上的体积

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

## hybrid 混合开发模板更新

- App 下载模板文件(html, css)
- 使用 file 协议加载本地文件到 webview
- html 发起 ajax 请求

- CMS 系统上传模板文件,
- 模板文件版本控制

### 下载时机

- App 启动时检查
- 实时，定时器(5min) 等

## 前端脚手架

提炼出的项目模板，帮助开发者创建基础项目目录。或者进行一些自动话操作（cicd）

脚手架工作流程

1、解析用户命令
commander：命令行工具，解析用户输入命令，commander文档
匹配不成功：显示help命令信息
匹配成功，进入下一步
2、 拉取远端模板
download-git-repo：通过git下载相应模板到本地
3、 根据用户输入替换内容
handlebars 模板
4、 文件操作渲染
增删改 fs-extra
5、 结束初始化

### 脚手架功能

1. 根据用户选择搭建基础项目模板结构
2. 上传相应服务器的命令（手动输入密码）

## 前端组件库

- package 发布到 npm
- view 预览
- src 源码
- 测试用例

### vue 组件

一个项目管理多个模块/组件，每个组件就是一个包，需要有 package.json

## 网站主题换肤方案

简单的说就是 通过 CSS 变量实现，这只是其中一环

**PostCSS**
PostCSS 是一款编译 CSS 的工具，原理：接手一个 CSS 文件，提供插件机制，提供开发者分析、修改 CSS 规则的能力，基于 AST 实现。

- 针对不同颜色
- 开发量
- 切换时的性能
- JavaScript, 同步主题切换

1. 将 CSS 色值赋为变量（还可以分组，比如一组有那些）
2. 给选择器 添加自定义熟悉 `a[data-theme] {}`

## 设计一个日期选择器

一、写代码前的思考

1. 明确需求，是实现日期选择、日期区间选择、时间选择

2. 用户选中日期后是否需要自动触发下一步？尤其是在某些固定业务流程中

3. 日期选择器是否是最佳的日期选择方法？如果提供预定义的日期选择按钮是不是更快呢？

4. 如何避免展示不可用日期？

5. 是否需要根据上下文自动定位？适用于生日选择场景。

二、日历值的输入

1. 是否可以自定义输入日期，还是只能点击（有时候直接输入会更快）
2. 自定义输入如何保证日期格式正确

三、日历表的展示

1. 默认情况展示 多少天、周、月
2. 一周的 起始 是周一开始，还是周日
3. 日期选择 弹出和关闭的方式，是否提供关闭按钮
4. 是否可以重置日期

四、扩展

1. 是否提供 日期区间的选择（时间段选择器）
2. 是否要提供，时间选择（时间选择器）

## tree 树形组件优化

前景：20000 多个站点机构，渲染速度快 20多秒

借鉴: [tree组件，10000个树节点](https://zhuanlan.zhihu.com/p/55528376)

### 递归

### 优化

- 虚拟列表

## vconsole 小程序调试插件

背景：vconsole 不能看到 network

功能：可以查看 network ，并且可以看到缓存

## 网站支持多语言

需要考虑的问题：

- 国际化的语言包，如何管理
- 如何切换语言
- 如何本地化
- 如何处理多语言的日期
- 如何处理多语言的数字
- 如何处理多语言的日期
- UI 结构设计
- 内容不同尺寸，导致样式的错乱等

方案:

1. 第三方库
   1. i18n
2. 根据不同项目单独建模块，方便后期维护和迁移
3. 统一语言标签，使用 业务模块，或者团队模块 作为命名空间，避免命名冲突
4. 日期及时间需要重新计算，比如当前设计日期为 某个时区，切换语言，时区变化
5. 布局：设计文本溢出省略方案；或者根据内容动态变化的组件
