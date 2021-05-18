# Vue-Router

## 目录

## 前端路由起源

Ajax 之前，用户每个操作都会刷新页面；  
有了 Ajax,  用户无需刷新页面。  
前端路由不同于传统路由，它不需要服务器来进行解析。  
前端路由描述的是 URL 与 UI 之间的映射关系。  

## 前端路由类型

### hash

- `#` 号开头，基于 location.hash 实现
- hash 改变时，页面不会因此刷新，浏览器也不会请求服务器。
- 监听 `hashchange`

### history

- 监听 popstate
- pushState
  - 接收 三个参数
  - `state: {}`
  - `title: null`
  - `url`
- `replaceState`
- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件。
- 只有在做出浏览器动作时，比如点击后退、前进按钮【或者调用 JS 中的 `history.back()`、`history.forward()`、`history.go()`】才会触发该事件。
- 需要后台配置支持。不然返回 404。`nginx uri`

## 手写 Vue-Router

分析：

- 实现一个插件, 包含 install 方法
- 两个全局组件 `router-link` 和 `router-view`
- 监听 `url` 变化， 实现 hash 模式跳转
- 嵌套子路由显示
