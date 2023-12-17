# Vue-Router

- [基础知识](#基础知识)
  - [前端路由起源](#前端路由起源)
  - [route 和 router 区别](#route-和-router-区别)
- [前端路由模式](#前端路由模式)
  - [hash](#hash)
  - [history](#history)
  - [MemotyHistory (abstract)](#memotyhistory-abstract)
- [手写 Vue-Router](#手写-vue-router)
- [配置 history](#配置-history)

## 基础知识

### 前端路由起源

- Ajax 之前，用户每个操作都会刷新页面；
- 有了 Ajax,  用户无需刷新页面。
- 前端路由不同于传统路由，它不需要服务器来进行解析。  
- 前端路由描述的是 URL 与 UI 之间的映射关系。  

### route 和 router 区别

`route`： 是“路由信息对象”，包括 path, params, hash, query, fullPath, matched, name等路由信息参数。
`router`：是“路由实例对象”，包括了路由的跳转方法(push、replace)，钩子函数等。

## 前端路由模式

### hash

- `#` 号开头，基于 `location.hash` 实现
- hash 改变时，页面不会因此刷新，浏览器也不会请求服务器。
- 监听 `hashchange`

```js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

这种模式适用于不支持 HTML5 History API 的浏览器，如 IE9 及更早版本的浏览器。

缺点: 在 SEO 中确实有不好的影响

### history

创建 `HTML5` 模式，推荐使用这个模式

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

- 监听 `history.popstate()`
- `history.pushState()`
  - 接收 三个参数
  - `state: {}`
  - `title: null`
  - `url`
- `replaceState`
- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件。
- 只有在做出浏览器动作时，比如点击后退、前进按钮【或者调用 JS 中的 `history.back()`、`history.forward()`、`history.go()`】才会触发该事件。

缺点: 需要服务器端支持，否则会导致页面无法正常加载，返回 404。`nginx uri`

### MemotyHistory (abstract)

这种模式适用于支持 Vue Router 的任何环境，包括浏览器、服务器端和原生移动应用等。

- 创建一个基于内存的历史记录。这个历史记录的主要目的是处理 SSR.
- 需要 Vue Router 的支持，无法在其他框架或环境中使用。

## 手写 Vue-Router

分析：

- 实现一个插件, 包含 `install` 方法
- 两个全局组件 `router-link` 和 `router-view`
- 监听 `url` 变化， 实现 hash 模式跳转
- 嵌套子路由显示

[vue-router](./VueRouter.js)

## 配置 history

前端的 URL 必须和实际向后端发起请求的 URL 一致

服务端

如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。
