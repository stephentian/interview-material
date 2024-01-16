# architechture

- [微前端](#微前端)
  - [single-spa](#single-spa)
  - [qiankun](#qiankun)
  - [iframe](#iframe)
- [渲染方式](#渲染方式)
  - [SSR](#ssr)
  - [CSR](#csr)

## 微前端

- 技术栈无关
- 独立开发、独立部署
- 独立运行，每个微应用之间状态隔离

### single-spa

为应用定义了一套生命周期，实现了路由劫持和应用加载

- 注册所有 APP
- 监听 url 变化，`window.location.href` 匹配 url
- 激活对应的子应用
- 走生命流程 `mounted -> unmounted` 等

思路：以js文件为入口，把应用加载到一个页面中，至于应用能否协同工作，是很难保证的。

### qiankun

qiankun 是基于 single-spa，解决了 Single-SPA Css样式隔离，Js执行隔离等问题的微前端技术方案。

思路：允许以 html 文件为应用入口，然后通过一个 html 解析器从文件中提取js和css依赖，并通过fetch下载依赖

qiankun 封装了一个 `import-html-entry` 插件，实现了像 `iframe` 一样加载子应用，只需要知道 `html` 的 `url` 就能加载到主应用中

### iframe

iframe 是最早的微前端技术，通过 iframe 加载子应用（页面）， 通过 `postMessage` 进行通信。

## 渲染方式

### SSR

Server Side Rendering，服务器端渲染

### CSR

Client Side Rendering，客户端渲染
