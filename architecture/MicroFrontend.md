# micro frontend

> 微前端

- [简介](#简介)
- [落地方案](#落地方案)
  - [iframe](#iframe)
  - [web component](#web-component)
  - [single-spa](#single-spa)
  - [qiankun](#qiankun)
    - [qiankun 工作原理](#qiankun-工作原理)
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
5. 通信机制：通过 postMessageAPI进行跨域通信，还有事件总线 EventBus。

### 模块联邦

模块联邦是一种去中心化的思想，可以用来做组件的拆分及复用。

- webpack: `module federation`
- vite: `vite-plugin-federation`

### wujie

官网地址：[无界极致的微前端框架](https://wujie-micro.github.io/doc/)

基于 `WebComponent + iframe` 实现的微前端框架