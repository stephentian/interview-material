# React

- [React](#react)
  - [基础知识](#基础知识)
    - [React 生命周期](#react-生命周期)
    - [React Fiber架构](#react-fiber架构)
    - [React 请求放哪个生命周期中](#react-请求放哪个生命周期中)
  - [setState](#setstate)
    - [setState 到底是异步还是同步](#setstate-到底是异步还是同步)
  - [React 组件之间的通信](#react-组件之间的通信)

## 基础知识

### React 生命周期

挂载阶段

- constructor
- getDerivedStateFromPorps
- render
- componentDidMount

更新阶段

- getDerivedStateFromPorps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate

卸载阶段

- componentWillUnmount

### React Fiber架构

React16启用了全新的架构，叫做Fiber。目的是解决大型React项目的性能问题，再顺手解决之前的一些痛点。

让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。

浏览器是单线程，GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。执行一个 task 的，要执行完才能执行渲染 reflow

### React 请求放哪个生命周期中

以前：
认为在 componentWillMount 中进行异步请求，避免白屏。
但是在服务器渲染的话，会执行两次请求，一次在服务端一次在客户端。
其次，`React Fiber` 重写后，`componentWillMount` 可能在一次渲染中多次调用。

官方推荐：`componentDidMount`
有特殊需要提前请求，也可以在 `constructor` 中请求。

## setState

使用方法

1. 接收改变对象 setState(obj, callback)
2. 接受函数 setState(fn, callback), fn 有两个参数 `state` 和 `props`

### setState 到底是异步还是同步

摘自：<https://www.cxymsg.com/guide/react.html#setstate%E5%88%B0%E5%BA%95%E6%98%AF%E5%BC%82%E6%AD%A5%E8%BF%98%E6%98%AF%E5%90%8C%E6%AD%A5>

先给出答案: 有时表现出异步,有时表现出同步。

更新是 异步的，执行是同步的

比如执行 100 次 setState, 如果是同步的话，那这个组件绘渲染 100次，这对性能是一个相当大的消耗。

所以，React 会把 多次的 setState 合为一次执行。所以更新上是异步的。

原生事件和异步代码中：

- 原生事件不会触发 react 的批处理机制，因而调用setState会直接更新
- 异步代码中调用 setState，由于js的异步处理机制，异步代码会暂存，等待同步代码执行完毕再执行，此时react的批处理机制已经结束，因而直接更新

## React 组件之间的通信

1. props
2. props + 回调
3. Context(全局)
4. 发布订阅模式
5. 全局状态管理工具：Redux、Mobx
