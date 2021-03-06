# React

- [React](#react)
  - [基础知识](#基础知识)
    - [React 发展历程](#react-发展历程)
    - [React 生命周期](#react-生命周期)
    - [React Fiber架构](#react-fiber架构)
    - [React 请求放哪个生命周期中](#react-请求放哪个生命周期中)
  - [setState](#setstate)
    - [setState 到底是异步还是同步](#setstate-到底是异步还是同步)
    - [setState 输出顺序](#setstate-输出顺序)
  - [React 组件之间的通信](#react-组件之间的通信)
  - [为什么 React bind(this)](#为什么-react-bindthis)

## 基础知识

### React 发展历程

2017 React 16

  1. React Fiber 架构。切片架构

2019 React 16.8

  1. React Hooks, 无需编写类即可使用状态和其他React功能的方法，不会产生 JSX 嵌套地狱

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

有时表现出异步,有时表现出同步。

执行是同步的, 异步指的是多个 state 会合并一起批量更新.

比如执行 100 次 setState, 如果是同步的话，那这个组件绘渲染 100次，这对性能是一个相当大的消耗。

所以，React 会把 多次的 setState 合为一次执行。所以更新上是异步的。

原理

1. setState 源码, 会根据 `isBatchingUpdates` 判断直接更新 `this.state` 还是放入队列中. `isBatchingUpdates` 默认 `false`
2. `batchedUpdates` 会修改 `isBatchingUpdates` 为 `true`
3. React 处理事件(`onClick` 事件处理函数等或 React 生命周期内), 会调用 `batchedUpdates`
4. 造成 setState 不会同步更新

原生事件和异步代码

- 原生事件不会触发 react 的批处理机制，因而调用setState会直接更新
- 异步代码中调用 setState，由于js的异步处理机制，异步代码会暂存，等待同步代码执行完毕再执行，此时react的批处理机制已经结束，因而直接更新

### setState 输出顺序

```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

分析

1. 第一次和第二次都是在 react 自身生命周期内，触发时 `isBatchingUpdates` 为 true
2. 两次 setState 时，获取到 `this.state.val` 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 `1`
3. `setTimeout` 中的代码，触发时 `isBatchingUpdates` 为 false，所以能够直接进行更新，所以连着输出 `2，3`

输出： `0 0 1 1`

注意: React 18 默认并发就是 `0011`，18 以下就是 `0023`

## React 组件之间的通信

1. props
2. props + 回调
3. Context(全局)
4. 发布订阅模式
5. 全局状态管理工具：Redux、Mobx

## 为什么 React bind(this)

原因在于 JavaScript 不在 React

比如:

1. 函数里的 `this`, 指向 `window`, 或者 `undefined`
2. 隐式绑定,
   - `obj.fn()` this 指向 `obj`
   - `const outFn = obj.fn; outFn()` this 指向全局
   - 或者作为参数传入其他全局函数 `outFn1(obj.fn)`, this 指向全局
3. 显式绑定
   - `obj.fn.bind(obj)`, this 指向 obj, 避免上面的问题

如果不绑定, 组件方法 this 值可能为 `undefined`, 因为 class 类不管是原型方法还是静态方法定义，“this”值在被调用的函数内部将为 undefined

解决方法：箭头函数

ES6 中, 箭头函数 this 默认指向函数的宿主对象(或者函数所绑定的对象)
