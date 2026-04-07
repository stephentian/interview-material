# micro frontend

> 微前端

- [简介](#简介)
- [问题](#问题)
- [落地方案](#落地方案)
  - [iframe](#iframe)
  - [web component](#web-component)
  - [single-spa](#single-spa)
  - [qiankun](#qiankun)
    - [qiankun 工作原理](#qiankun-工作原理)
    - [qiankun import-html-entry](#qiankun-import-html-entry)
    - [qiankun 处理子应用资源加载](#qiankun-处理子应用资源加载)
    - [qiankun 处理js全局污染](#qiankun-处理js全局污染)
    - [qiankun 实现keep-alive](#qiankun-实现keep-alive)
    - [qiankun 相较于 iframe](#qiankun-相较于-iframe)
  - [模块联邦](#模块联邦)
  - [wujie](#wujie)

## 简介

微前端是一种类似于微服务的架构, 它将微服务的理念应用于浏览器端, 即将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。

优点：

- 项目解耦，业务解耦
- 技术栈无关
- 方便并行开发、独立部署
- 独立运行，每个微应用之间状态隔离

关注问题：

- 性能问题（项目大小，运行速度）
- 用户体验、行为一致性问题（样式隔离）
- 状态共享问题（数据通信）
- 安全性（跨域）

## 问题

1. 微前端，每个团队都有自己的选择，浏览器加载多个框架和重复的组件代码？

    1. 统一版本管理：对于每个团队使用的技术栈和框架，可以进行版本统一管理，确保不同团队使用的版本一致，这样可以减少重复的代码和框架的加载。

    2. 使用公共依赖库：可以将多个团队共同使用的依赖库单独打包成一个公共依赖库，这样就可以减少重复的组件代码和框架的加载。

    3. 懒加载和按需加载：可以通过懒加载和按需加载的方式，仅在需要的时候加载组件和框架，减少页面的初始化时间和加载时间。可以使用类似于 Webpack 的代码分割和动态导入的功能，将不同团队的代码分开打包，按需加载。

    4. 使用 CDN 或缓存：可以使用 CDN 或者缓存的方式，将公共的组件和框架文件缓存起来，这样可以减少重复的加载和请求，加快页面的加载速度。

    5. 代码合并和压缩：可以对不同团队的代码进行合并和压缩，减少代码体积和请求次数，提高页面的加载速度和性能。

## 落地方案

### iframe

`iframe` 是最早的微前端技术，通过 iframe 加载子应用（页面）， 通过 `postMessage` 进行通信。

优点：

1. 简单
2. 安全
3. 隔离
4. 独立部署

缺点：

1. url，浏览器刷新，iframe url 丢失；
2. UI 样式不同步，iframe 中弹窗不好处理；
3. 不利于 SEO；
4. 页面性能，资源加载慢；
5. 全局上下文隔离，内存变量不能共享；

### web component

重写前端应用，将前端应用转换为 web component，基于 CustomEvent 通信

web components 由 3 个部分组成：

- Custom Element（自定义元素）
  - 一组 JS API，定义自定义元素及行为；
- Shadow DOM（影子DOM）
  - 一组 JS API，封装影子DOM 树到元素上，与主文档DOM 分开呈现；
- HTML Template（HTML 模版）
  - `<template>` 和 `<slot>` 用于定义元素的结构和样式；

实现方式：

- `customElements.define()` 定义自定义元素；
- `<slot>` 定义元素的结构和样式；
- `<template>` 定义元素的结构和样式；
- `Shadow DOM` 定义元素的结构和样式；
- `CustomEvent` 定义元素的结构和样式；

```html
<element-details>
  <span slot="element-name">slot</span>
  <span slot="description">A placeholder inside a web
    component.</span>
  <dl slot="attributes">
    <dt>name</dt>
    <dd>The name of the slot.</dd>
  </dl>
</element-details>
```

资料：

- [MDN - Web Component](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

### single-spa

为应用定义了一套生命周期，实现了路由劫持和应用加载

- 注册所有 APP
- 监听 url 变化，`window.location.href` 匹配 url
- 激活对应的子应用
- 走生命流程 `mounted -> unmounted` 等

思路：以js文件为入口，把应用加载到一个页面中，至于应用能否协同工作，是很难保证的。

### qiankun

qiankun 是基于 single-spa，解决了 Single-SPA CSS 样式隔离，Js执行隔离等问题的微前端技术方案。

思路：允许以 html 文件为应用入口，然后通过一个 html 解析器从文件中提取js和css依赖，并通过fetch下载依赖

qiankun 封装了一个 `import-html-entry` 插件，实现了像 `iframe` 一样加载子应用，只需要知道 `html` 的 `url` 就能加载到主应用中

#### qiankun 工作原理

1. 应用加载：动态创建 `script` 标签加载子应用。通过 `import-html-entry` ，并解析出子应用依赖的 `js` 和 `css`，然后通过 `fetch` 下载依赖，最后通过 `eval` 执行。
2. 生命周期管理：子应用暴露 bootstrap、mounted、unmounted 等生命周期钩子，子应用在应用加载时调用 bootstrap，应用启动时调用 mounted。
3. 沙箱隔离：通过 `Proxy` 实现，子应用和主应用之间的变量隔离。
4. 样式隔离：通过动态添加和移除子应用样式标签实现样式隔离。
5. 通信机制：通过 postMessageAPI 进行跨域通信，还有事件总线 EventBus。

#### qiankun import-html-entry

1. 加载 HTML 资源：创建一个 `<link>` 标签来加载子应用的 HTML 入口文件。
2. 动态加载 js 和 css：遍历 HTML内容，动态创建 `<script>` 和 `<link>` 标签，动态加载 js 和 css。
3. 创建沙箱环境：通过 `Proxy` 代理，隔离全局变量和运行环境。
4. 返回子应用入口模块：抛出加载子应用的 js 模块，里面包含初始化子应用的方法。

#### qiankun 处理子应用资源加载

方案一：使用公共路径，比如子应用放在 `xxx.com/sub-app`，那可以在所有静态资源路径添加这个前缀。

方案二：遍历 `img/video/audio` 等标签，封装使用一个方法 `getTemplate` 处理这些媒体资源的路径。

#### qiankun 处理js全局污染

`qiankun` 沙箱可以通过代理 `window` 对象处理js全局变量污染问题。但是不能解决挂载到 `body` 的 `onclick`，`addEventListener` 等事件。

1. 开发规范，避免直接操作全局对象 `window` 和 `document`
2. 如果子应用有添加全局点击事件，子应用 `unmount` 时，清除事件监听。

#### qiankun 实现keep-alive

方案一：子应用 `unmount` 卸载时保存子应用状态，子应用 `mount` 重新加载。

```js
let saveBool
export function getSaveState() {}

export function setSaveState(state) {}

export async function mount(props) {
  if (saveBool) {
    // 获取子应用保存的状态
    const state = await getSaveState()
    props.setGlobalState(state)
  }
}

export async function unmount(props) {
  // 保存子应用状态
  setSaveState(props)
  saveBool = true
}
```

缺点：不能保存子应用 DOM 状态

方案二：不卸载应用，通过 `display: none` 隐藏应用，通过 `display: block` 显示应用。

#### qiankun 相较于 iframe

两者都是微前端的实现方式，`iframe` 是直接页面使用标签引入另一个页面，具有天然的样式隔离和变量隔离。`qiankun` 是基于 `single-spa` 的
微前端方案，支持多前端框架，具备js沙箱、样式隔离、HTML Loader、预加载等微前端系统所需的能力

`qiankun` 通过共享window来实现数据共享，并封装了一套私有通信机制，主应用和子应用可以通过提供封装好的API来进行双向的数据交互。`iframe`
数据共享通过hash、query等方式在url上添加数据。通信方面，iframe子应用到主应用需要通过postMessage方式进行。

`qiankun` 应用之间前进后退的访问栈是统一的，可以预加载子应用资源，提高性能。`iframe` 每次子应用切换都是一次浏览器上下文重建、资源重新加载的过程，性能消耗较大。

| - | qiankun | iframe |
| --- | --- | --- |
| 优势 | 1. 支持多种前端框架，改造成本低，开发体验友好 | 使用简单，技术实现难度低 |
| - | 2. 样式隔离能力强，避免样式冲突 | 天然的样式隔离和全局变量隔离 |
| - | 3. 完善的数据共享与通信机制 | ❌ |
| - | 4. 访问历史统一，性能优化效果好 | ❌ |
| 劣势 | 1. 样式隔离不彻底，可能存在全局污染风险 | 路由状态丢失问题，刷新后 iframe 的 url 状态会丢失 |
| - | 2. JS 沙箱性能开销，大量定时器/事件监听时性能下降 | DOM 割裂严重，弹窗只能在 iframe 内部展示，无法覆盖全局 |
| - | 3. 子应用依赖主应用环境，存在耦合 | 通信困难，需要通过 postMessage 传递序列化的信息 |
| - | 4. 首次加载慢，需要加载主应用 + 子应用资源 | 加载时间长，存在白屏问题，影响用户体验 |
| - | 5. 子应用独立部署困难，需要配置 CORS 和打包 | 搜索引擎优化差，iframe 内容不易被索引 |
| - | 6. 调试复杂，需要同时调试主应用和子应用 | 浏览器前进后退行为不一致，用户体验差 |

使用场景：

- iframe
   1. 项目规模较小，对性能要求不高
   2. 团队技术栈相对单一，不需要支持多种前端框架
   3. 对数据共享与通信要求不高，只需要简单的数据传递

- qiankun
  1. 项目规模较大，对性能有较高要求
  2. 团队技术栈多样，需要支持多种前端框架
  3. 对数据共享与通信有较高要求，需要实现双向的数据交互

### 模块联邦

模块联邦是一种去中心化的思想，可以用来做组件的拆分及复用。

- webpack: `module federation`
- vite: `vite-plugin-federation`

缺点：

- 对 webpack 强依赖，违背微前端 “技术栈无关” 初衷
- 没有 JS 沙箱隔离，共享全局 window，变量 / 事件 / 原型易冲突
- 没有 CSS 隔离，样式易冲突，需要手动添加 `scope`。
- 本地开发需同时启动多个应用、配置跨域与代理

### wujie

官网地址：[无界极致的微前端框架](https://wujie-micro.github.io/doc/)

腾讯出品的，基于 `WebComponent + iframe` 实现的微前端框架

加载子应用：通过类似 `iframe` 的方式，自定义组件，填写 url, 加载子应用
数据交互：有 props, window.parent.xxx, EventBus 三种方式
路由跳转：主应用通过 props 传给子应用方法，子应用调用
