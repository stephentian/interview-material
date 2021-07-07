# React

- [React](#react)
  - [React 生命周期](#react-生命周期)
  - [React 请求放哪个生命周期中](#react-请求放哪个生命周期中)
  - [setState 到底是异步还是同步](#setstate-到底是异步还是同步)
  - [React 组件之间的通信](#react-组件之间的通信)

## React 生命周期

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


## React 请求放哪个生命周期中

以前：
认为在 componentWillMount 中进行异步请求，避免白屏。
但是在服务器渲染的话，会执行两次请求，一次在服务端一次在客户端。
其次，`React Fiber` 重写后，`componentWillMount` 可能在一次渲染中多次调用。

官方推荐：`componentDidMount`
有特殊需要提前请求，也可以在 `constructor` 中请求。


## setState 到底是异步还是同步

摘自：https://www.cxymsg.com/guide/react.html#setstate%E5%88%B0%E5%BA%95%E6%98%AF%E5%BC%82%E6%AD%A5%E8%BF%98%E6%98%AF%E5%90%8C%E6%AD%A5

先给出答案: 有时表现出异步,有时表现出同步。

更新是 异步的，执行是同步的

比如执行 100 次 setState, 如果是同步的话，那这个组件绘渲染 100次，这对性能是一个相当大的消耗。

所以，React 会把 多次的 setState 合为一次执行。所以更新上是异步的。

原生事件和异步代码中：

- 原生事件不会触发react的批处理机制，因而调用setState会直接更新
- 异步代码中调用setState，由于js的异步处理机制，异步代码会暂存，等待同步代码执行完毕再执行，此时react的批处理机制已经结束，因而直接更新

## React 组件之间的通信

1. props
2. props + 回调
3. Context(全局)
4. 发布订阅模式
5. 全局状态管理工具：Redux、Mobx
