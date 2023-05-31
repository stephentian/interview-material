# React

- [React](#react)
  - [基础知识](#基础知识)
    - [React 发展历程](#react-发展历程)
    - [React 生命周期](#react-生命周期)
    - [React Fiber架构](#react-fiber架构)
    - [React 设计思想](#react-设计思想)
    - [React 三种开发模式](#react-三种开发模式)
    - [JSX](#jsx)
  - [setState](#setstate)
    - [setState 到底是异步还是同步](#setstate-到底是异步还是同步)
    - [setState 输出顺序](#setstate-输出顺序)
  - [React 组件之间的通信](#react-组件之间的通信)
  - [React 版本](#react-版本)
    - [React 16](#react-16)
    - [React 17](#react-17)
    - [React 18](#react-18)
      - [特征更新](#特征更新)
  - [HOC 高阶组件](#hoc-高阶组件)
  - [Hooks](#hooks)
    - [Hooks API](#hooks-api)
  - [常见问题](#常见问题)
    - [StrictMode 模式是什么](#strictmode-模式是什么)
    - [React 请求放哪个生命周期中](#react-请求放哪个生命周期中)
    - [为什么 React bind(this)](#为什么-react-bindthis)

## 基础知识

### React 发展历程

2013 React 发布

2017 React 16

  1. React Fiber 架构。切片架构

2019 React 16.8

  1. React Hooks, 无需编写类即可使用状态和其他React功能的方法，不会产生 JSX 嵌套地狱

2021 React 17

2022 React 18

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

constructor：组件实例化时被调用，可以进行组件的初始化工作，例如绑定事件处理程序、设置状态或实例化对象。
static getDerivedStateFromProps(props, state)：在组件挂载之前被调用，用于根据 props 来更新组件的状态。它返回一个对象，表示要更新的组件状态，或者返回 null，表示不需要更新状态。
render：根据当前的 props 和 state 渲染组件的 UI。
componentDidMount：在组件挂载后被调用，可以进行异步请求、添加事件监听器或启动定时器等操作。

static getDerivedStateFromProps(props, state)：在组件更新之前被调用，用于根据 props 更新组件的状态。
shouldComponentUpdate(nextProps, nextState)：在组件更新之前被调用，可以根据新的 props 和 state 判断是否需要重新渲染组件。返回 true 表示需要重新渲染，返回 false 表示不需要。
render：根据新的 props 和 state 重新渲染组件的 UI。
getSnapshotBeforeUpdate(prevProps, prevState)：在 render 方法之后、更新 DOM 之前被调用，可以获取组件更新前的一些信息。它返回一个值，该值会作为第三个参数传递给 componentDidUpdate 方法。
componentDidUpdate(prevProps, prevState, snapshot)：在组件更新后被调用，可以进行 DOM 操作、网络请求或更新组件的状态等操作。

componentWillUnmount：在组件卸载之前被调用，可以清除定时器、移除事件监听器或取消网络请求等操作。

### React Fiber架构

React16启用了全新的架构，叫做 Fiber。目的是解决大型React项目的性能问题，再顺手解决之前的一些痛点。

让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。

浏览器是单线程，GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。执行一个 task 的，要执行完才能执行渲染 reflow

### React 设计思想

1. 组件化
2. 数据驱动视图
3. 虚拟 DOM

### React 三种开发模式

- Legacy 模式：通过 ReactDom.reander(.rootNode) 创建的应用遵循该模式。默认关闭StrictMode，和以前一样
- Blocking 模式:通过 ReactDOM.createBlockingRoot(rootNode).render()，默认开启StrictMode，作为向第三种模式迁移的中间态(可以体验并发模式的部分功能)。
- Concurrent 模式：通过 ReactDOM.createRoot(rootNode).render() 创建的应用，默认开启StrictMode ，这种模式开启了所有的新功能。

### JSX

JSX是react的语法糖，它允许在html中写JS，它不能被浏览器直接识别，需要通过webpack、babel之类的编译工具转换为JS执行

- 只要使用了jsx，就需要引用react，因为 jsx 本质就是React.createElement

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

## React 版本

### React 16

1. hooks
2. memo, lazy, suspense
3. profiler

### React 17

1. 全新的 jsx 转换
   之前: React中如果使用JSX，则必须导入React `import React from 'react';`, JSX 会转换为 React.createElement()
   当前: 编写 JSX 代码将不再需要手动导入 React 包，编译器会针对 JSX 代码进行自动导入（React/jsx-runtime）

2. 事件委托的变更
   React17不再将事件添加在 document 上，而是添加到渲染 React 树的根 DOM 容器中:

   ```js
   // v17
   const rootNode = document.getElementById('root');
   ReactDOM.render(<App />, rootNode);

   // React16 事件委托（挂在document上）
   <!-- document.addEventListener(); -->
   // React17 事件委托（挂在 root DOM 上）
   <!-- rootNode.addEventListener(); -->
   ```

### React 18

#### 特征更新

- setState 自动批处理
- 引入了新的root API，支持new concurrent renderer(并发模式的渲染)
- 去掉了对IE浏览器的支持
- flushSync 退出批量更新

1. 引入了新的渲染 API
   之前: `ReactDom.render` 将应用组件渲染到页面的根元素
   当前: 通过 `ReactDom.creatRoot` 创建根节点对象

   ```js
   // v18
   import { createRoot } from 'react-dom/client';

   const domNode = document.getElementById('root');
   const root = createRoot(domNode);
   root.render(<App />);
   ```

## HOC 高阶组件

高阶函数指能接受一个或多个函数作为参数，或者返回一个函数作为结果的函数；

高阶组件（high-order Component）是一个函数，接受一个组件作为参数并返回一个新的组件。HOC 可以用于增强现有组件的功能，例如添加状态、操作 props 等。

## Hooks

React v16.8.0 引入的新特性，它使函数组件能够拥有状态和其他 React 特性。

### Hooks API

useState：用于在函数组件中添加状态。
useEffect：用于在函数组件中添加副作用。
useContext：用于在函数组件中访问 context。
useReducer：用于在函数组件中管理复杂的状态。
useCallback：用于在函数组件中缓存回调函数，以避免不必要的重新渲染。
useMemo：用于在函数组件中缓存值，以避免不必要的重新计算。
useRef：用于在函数组件中存储可变的值。
useImperativeHandle：用于在函数组件中公开 ref。
useLayoutEffect：与 useEffect 相同，但在 DOM 更新之前同步执行。
useDebugValue：用于在自定义 Hooks 中显示调试信息。

## 常见问题

### StrictMode 模式是什么

StrictMode，16.3 版本发布，为了规范代码，

针对开发者编写的“不符合并发更新规范的代码”给出提示，逐步引导开发者编写规范的代码。比如使用以 will 开头的生命周期就会给出对应的报错提示。

### React 请求放哪个生命周期中

以前：
认为在 componentWillMount 中进行异步请求，避免白屏。
但是在服务器渲染的话，会执行两次请求，一次在服务端一次在客户端。
其次，`React Fiber` 重写后，`componentWillMount` 可能在一次渲染中多次调用。

官方推荐：`componentDidMount`
有特殊需要提前请求，也可以在 `constructor` 中请求。

### 为什么 React bind(this)

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