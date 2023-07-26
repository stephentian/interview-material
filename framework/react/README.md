# React

- [基础知识](#基础知识)
  - [React 发展历程](#react-发展历程)
  - [React 生命周期](#react-生命周期)
  - [React 实例过程](#react-实例过程)
  - [React Fiber架构](#react-fiber架构)
  - [React 设计思想](#react-设计思想)
  - [React 三种开发模式](#react-三种开发模式)
  - [JSX](#jsx)
- [setState](#setstate)
  - [setState 到底是异步还是同步](#setstate-到底是异步还是同步)
  - [setState 输出顺序](#setstate-输出顺序)
- [React 组件之间的通信](#react-组件之间的通信)
- [React 版本](#react-版本)
  - [React 15](#react-15)
  - [React 16](#react-16)
  - [React 17](#react-17)
  - [React 18](#react-18)
    - [特征更新](#特征更新)
- [HOC 高阶组件](#hoc-高阶组件)
- [Hooks](#hooks)
  - [Hooks API](#hooks-api)
    - [useState](#usestate)
    - [useEffects](#useeffects)
    - [useCallback](#usecallback)
    - [useMemo](#usememo)
  - [自定义 Hooks](#自定义-hooks)
- [Redux](#redux)
  - [Redux 工作原理](#redux-工作原理)
- [React-Router](#react-router)
  - [React-Router 工作原理](#react-router-工作原理)
  - [为什么需要前端路由](#为什么需要前端路由)
  - [前端路由解决的问题](#前端路由解决的问题)
- [常见问题](#常见问题)
  - [StrictMode 模式是什么](#strictmode-模式是什么)
  - [类组件，React 请求放哪个生命周期中](#类组件react-请求放哪个生命周期中)
  - [类组件，为什么 React bind(this)](#类组件为什么-react-bindthis)
  - [为什么 React 不推荐直接修改 state](#为什么-react-不推荐直接修改-state)
  - [useEffect 和 useCallback 有什么？](#useeffect-和-usecallback-有什么)
  - [useEffect, useMemo, useCallback 差异](#useeffect-usememo-usecallback-差异)
    - [如何判断计算成本高？](#如何判断计算成本高)
  - [为什么 React 自定义组件首字母要大写](#为什么-react-自定义组件首字母要大写)

## 基础知识

### React 发展历程

2013 React 发布

2016 React 15

2017 React 16

  1. React Fiber 架构。切片架构

2019 React 16.8

  1. React Hooks, 无需编写类即可使用状态和其他React功能的方法，不会产生 JSX 嵌套地狱

2020 React 17

2022 React 18

### React 生命周期

挂载阶段

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

更新阶段

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate

卸载阶段

- `componentWillUnmount`

`constructor`: 组件实例化时被调用，可以进行组件的初始化工作，例如绑定事件处理程序、设置状态或实例化对象。
`static getDerivedStateFromProps(props, state)`：在组件挂载之前被调用，用于根据 props 来更新组件的状态。它返回一个对象，表示要更新的组件状态，或者返回 null，表示不需要更新状态。
`render`：根据当前的 props 和 state 渲染组件的 UI。
`componentDidMount`：在组件挂载后被调用，可以进行异步请求、添加事件监听器或启动定时器等操作。

`static getDerivedStateFromProps(props, state)`：在组件更新之前被调用，用于根据 props 更新组件的状态。
`shouldComponentUpdate(nextProps, nextState)`：在组件更新之前被调用，可以根据新的 props 和 state 判断是否需要重新渲染组件。返回 true 表示需要重新渲染，返回 false 表示不需要。
`render`：根据新的 props 和 state 重新渲染组件的 UI。
`getSnapshotBeforeUpdate(prevProps, prevState)`：在 render 方法之后、更新 DOM 之前被调用，可以获取组件更新前的一些信息。它返回一个值，该值会作为第三个参数传递给 componentDidUpdate 方法。
c`omponentDidUpdate(prevProps, prevState, snapshot)`：在组件更新后被调用，可以进行 DOM 操作、网络请求或更新组件的状态等操作。

`componentWillUnmount`：在组件卸载之前被调用，可以清除定时器、移除事件监听器或取消网络请求等操作。

### React 实例过程

1. 创建一个 React 元素：使用 JSX（一种类似 HTML 的语法）来创建一个 React 元素。这个元素可以是任何 React 组件，例如一个简单的文本组件、一个包含子元素的组件等等。
2. 创建 React 实例：使用 ReactDOM.render() 方法，将创建的 React 元素渲染到一个 DOM 元素中。ReactDOM.render() 方法需要两个参数：要渲染的 React 元素和一个 DOM 元素。这个 DOM 元素可以是页面中的一个 div 元素或者是一个已经存在的元素。
3. 更新 React 实例：当需要更新 React 实例时，你需要调用 setState() 方法来更新组件的状态。React 会根据新的状态重新渲染组件，并更新 UI。

### React Fiber架构

React16 启用了全新的架构，叫做 Fiber。目的是解决大型 React 项目的性能问题，再顺手解决之前的一些痛点。

让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。

浏览器是单线程，GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。执行一个 task 的，要执行完才能执行渲染 reflow

### React 设计思想

1. 组件化
2. 数据驱动视图
3. 虚拟 DOM

### React 三种开发模式

- `Legacy` 模式：通过 `ReactDom.reander(.rootNode)` 创建的应用遵循该模式。默认关闭 `StrictMode`，和以前一样.
- `Blocking` 模式:通过 `ReactDOM.createBlockingRoot(rootNode).render()`，默认开启 `StrictMode`，作为向第三种模式迁移的中间态(可以体验并发模式的部分功能)。
- `Concurrent` 模式：通过 `ReactDOM.createRoot(rootNode).render()` 创建的应用，默认开启 `StrictMode` ，这种模式开启了所有的新功能。

### JSX

JSX 是 react 的语法糖，它允许在 HTML 中写 JS，它不能被浏览器直接识别，需要通过webpack、babel之类的编译工具转换为JS执行

- 只要使用了jsx，就需要引用 react，因为 jsx 本质就是 React.createElement

JSX与JS的区别：

- JS可以被打包工具直接编译，不需要额外转换，jsx需要通过babel编译，它是 React.createElement的 语法糖，使用jsx等价于R eact.createElement
- jsx是js的语法扩展，允许在html中写JS；JS是原生写法，需要通过script标签引入

## setState

使用方法

1. 接收改变对象 setState(obj, callback)
2. 接受函数 setState(fn, callback), fn 有两个参数 `state` 和 `props`

### setState 到底是异步还是同步

摘自：<https://www.cxymsg.com/guide/react.html#setstate%E5%88%B0%E5%BA%95%E6%98%AF%E5%BC%82%E6%AD%A5%E8%BF%98%E6%98%AF%E5%90%8C%E6%AD%A5>

setState是一个异步方法，但是在 setTimeout/setInterval 等定时器里逃脱了 React 对它的掌控，变成了同步方法。

所以有时表现出异步,有时表现出同步。异步指的是多个 state 会合并一起批量更新.

比如执行 100 次 setState, 如果是同步的话，那这个组件绘渲染 100次，这对性能是一个相当大的消耗。

所以，React 会把 多次的 setState 合为一次执行。所以更新上是异步的。

原理

1. `setState` 源码, 会根据 `isBatchingUpdates` 判断直接更新 `this.state` 还是放入队列中. `isBatchingUpdates` 默认 `false`
2. `batchedUpdates` 会修改 `isBatchingUpdates` 为 `true`
3. React 处理事件(`onClick` 事件处理函数等或 React 生命周期内), 会调用 `batchedUpdates`
4. 造成 setState 不会同步更新

原生事件和异步代码

- 原生事件不会触发 react 的批处理机制，因而调用 setState 会直接更新
- 异步代码中调用 setState，由于 js 的异步处理机制，异步代码会暂存，等待同步代码执行完毕再执行，此时 react 的批处理机制已经结束，因而直接更新

React18 以后，使用了 createRoot api 后，所有 setState 都是异步批量执行的

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

输出： `0 0 2 3`

注意: React 18 以下是 `0023`

如果需要在 `setState` 更新后获取新的值，可以在 `setState` 的回调函数中进行操作

## React 组件之间的通信

1. props
2. props + 回调
3. Context(全局)
4. 发布订阅模式
5. 全局状态管理工具：Redux、Mobx

- 父组件向子组件通信
  - props
- 子组件向父组件通信
  - 回调函数
  - Ref
- 兄弟组件通信
  - props
- 父组件向后代组件通信
  - Context
- 无关组件通信
  - Context

## React 版本

### React 15

React15 架构可以分为两层：

- Reconciler（协调器）—— 负责递归处理虚拟DOM，找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面

15 版本是基于 Stack Reconcilation(栈调和器)。它是递归、同步的方式。栈的优点在于用少量的代码就可以实现diff功能。并且非常容易理解。但是它也带来了严重的性能问题。

React15 使用的是栈调和器，由于递归执行，所以更新一旦开始，中途就无法中断。当调用层级很深时，递归更新时间超过了屏幕刷新时间间隔，用户交互就会卡顿。

### React 16

React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

1. hooks
2. memo, lazy, suspense
3. profiler

### React 17

1. 全新的 jsx 转换
   之前: React中如果使用JSX，则必须导入React `import React from 'react';`, JSX 会转换为 React.createElement()
   当前: 编写 JSX 代码将不再需要手动导入 React 包，编译器会针对 JSX 代码进行自动导入（React/jsx-runtime）

2. 事件委托的变更
   React17 不再将事件添加在 document 上，而是添加到渲染 React 树的根 DOM 容器中:

   ```js
   // v17
   const rootNode = document.getElementById('root');
   ReactDOM.render(<App />, rootNode);

   // React16 事件委托（挂在document上）
   <!-- document.addEventListener(); -->
   // React17 事件委托（挂在 root DOM 上）
   <!-- rootNode.addEventListener(); -->
   ```

3. 废弃三个 Will 除了组件销毁那个，componentWillMount、componentWillReceiveProps、componentWillUpdate

### React 18

#### 特征更新

- setState 自动批处理（过时 API）
  - react17，只有 react 事件会进行批处理，原生js事件、promise，setTimeout、setInterval不会  
  - react18，将所有事件都进行批处理，即多次 setState 会被合并为1次执行，提高了性能，在数据层，将多个状态更新合并成一次处理（在视图层，将多次渲染合并成一次渲染）
- 类组件（Component）过时，建议使用函数组件
- 引入了新的 root API，支持 new concurrent renderer(并发模式的渲染)
  - 之前: `ReactDom.render` 将应用组件渲染到页面的根元素
  - 当前: 通过 `ReactDom.creatRoot` 创建根节点对象
  
    ```js
    // v18
    import { createRoot } from 'react-dom/client';

    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<App />);
    ```

- 去掉了对 IE 浏览器的支持，使用 IE 浏览器要回退到 17版本
- flushSync 退出批量更新
- Strict Mode
  - 当你使用严格模式（Strict Mode）时，React 会对每个组件进行两次渲染，以便你观察一些意想不到的结果。
  - React 17 中，取消了其中一次渲染的控制台日志，以便让日志更容易阅读。
- react组件返回值更新
  - 在react17中，返回空组件只能返回null，显式返回undefined会报错
  - 在react18中，支持null和undefined返回

## HOC 高阶组件

高阶函数指能接受一个或多个函数作为参数，或者返回一个函数作为结果的函数；

高阶组件（high-order Component）是一个函数，接受一个组件作为参数并返回一个新的组件。HOC 可以用于增强现有组件的功能，例如添加状态、操作 props 等。

## Hooks

React v16.8.0 引入的新特性，它使函数组件能够拥有状态和其他 React 特性。

在 React 中，useState 以及任何其他以 “use” 开头的函数都被称为 Hook。只能在组件或自定义 Hook 的最顶层调用。

### Hooks API

useState: 用于在函数组件中添加状态。
useEffect: 用于在函数组件中添加副作用。
useContext: 用于在函数组件中访问 context。
useReducer: 用于在函数组件中管理复杂的状态。
useCallback: 用于在函数组件中缓存回调函数，以避免不必要的重新渲染。
useMemo: 用于在函数组件中缓存值，以避免不必要的重新计算。
useRef: 用于在函数组件中存储可变的值。
useImperativeHandle: 用于在函数组件中公开 ref。
useLayoutEffect: 与 useEffect 相同，但在 DOM 更新之前同步执行。
useDebugValue: 用于在自定义 Hooks 中显示调试信息。

#### useState

useState 是一个 React Hook，它用于在函数组件中添加状态。当你调用 useState 时，它会返回一个数组，其中第一个元素是当前状态的值，第二个元素是一个回调函数，用于更新状态的值。当你调用第二个元素时，React 会比较新旧状态的值是否相同，如果不同，则会触发组件的重新渲染。

useState 的唯一参数是 state 变量的初始值

当你调用 useState 时，你是在告诉 React 你想让这个组件记住一些东西：

`const [index, setIndex] = useState(0);`

- state 变量 (index) 会保存上次渲染的值。
- state setter 函数 (setIndex) 可以更新 state 变量并触发 React 重新渲染组件。

#### useEffects

`useEffect` 是一个用于在组件渲染后执行副作用（如数据获取、订阅和 DOM 操作等）的函数。

接受两个参数：

- 一个 `setup` 函数
  - 返回一个 清理函数（`cleanup`），其 `cleanup` 代码 用来与该系统断开连接。
- 一个依赖项数组。
  - 可选的，用于指定在哪些依赖项发生变化时重新运行函数。
  - 省略此参数，则在每次重新渲染组件后，将重新运行函数。
  - 此参数为 空数组时，组件 props 或 state 发生改变不会重新运行。

**注意：** useEffect 在每次组件渲染后都会执行，因此应该避免在 useEffect 中执行过多的副作用操作，以免影响性能。此外，为了避免副作用操作之间的相互依赖，应该将副作用操作拆分成多个 useEffect 函数，并在依赖项中分别指定。

#### useCallback

- 跳过组件重新渲染
- 

#### useMemo

- 跳过成本高的计算
- 跳过组件的重新渲染
- 记忆另一个 Hook 的依赖
- 记忆一个函数

1. 缓存计算

   `const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);`

2. 缓存组件

    默认情况，组件重新渲染，会递归渲染子组件；用 useMemo 包裹，当它的 props 跟上一次渲染相同的时候它就会跳过本次渲染

    `useMemo(() => <List items={visibleTodos} />, [visibleTodos]);`

3. 缓存一个函数

    ```js
    export default function Page({ productId, referrer }) {
      const handleSubmit = useMemo(() => {
        return (orderDetails) => {
          post('/product/' + productId + '/buy', {
            referrer,
            orderDetails
          });
        };
      }, [productId, referrer]);

      return <Form onSubmit={handleSubmit} />;
    }

    // 记忆函数专门用 useCallback
    export default function Page({ productId, referrer }) {
      const handleSubmit = useCallback((orderDetails) => {
        post('/product/' + productId + '/buy', {
          referrer,
          orderDetails
        });
      }, [productId, referrer]);

      return <Form onSubmit={handleSubmit} />;
    }
    ```

    useCallback 的唯一好处是它可以让你避免在内部编写额外的嵌套函数。

### 自定义 Hooks

自定义 Hook 是一个函数，其名称以 use 开头，函数内部可以调用其他的 Hook。

## Redux

Redux 是当今市场上最流行的前端开发库之一。它是 JavaScript 应用程序的可预测状态容器，用于整个应用程序状态管理。使用 Redux 开发的应用程序易于测试，并且可以在不同环境中运行，表现出一致的行为。

Redux 三个原则

1. 单一事实来源：整个应用程序的状态存储在单个存储中的对象/状态树中。单一状态树可以更轻松地跟踪随时间的变化以及调试或检查应用程序。
2. 状态是只读的： 改变状态的唯一方法是触发一个动作。操作是描述更改的普通 JS 对象。就像状态是数据的最小表示一样，动作是对该数据更改的最小表示。
3. 使用纯函数进行更改： 为了指定状态树如何通过操作转换，您需要纯函数。纯函数是那些返回值仅取决于其参数值的函数。

### Redux 工作原理

使用单例模式实现

Store 一个全局状态管理对象

Reducer 一个纯函数，根据旧 state 和 props 更新新 state

Action 改变状态的唯一方式是 dispatch action

## React-Router

组件：
HashRouter/BrowserRouter 路由器

Route 路由匹配

Link 链接，在 HTML 中是个锚点

NavLink 当前活动链接

Switch 路由跳转

Redirect 路由重定向

```js
<Link to="/home">Home</Link>
<NavLink to="/abount" activeClassName="active">About</NavLink>
<Redirect to="/dashboard">Dashboard</Redirect>
```

### React-Router 工作原理

BrowserRouter 使用的 HTML5 的 history api 实现路由跳转
HashRouter 使用 URL 的 hash 属性控制路由跳转

### 为什么需要前端路由

1. 早期：一个页面对应一个路由，路由跳转导致页面刷新，用户体验差
2. ajax的出现使得不刷新页面也可以更新页面内容，出现了SPA（单页应用）。SPA不能记住用户操作，只有一个页面对URL做映射，SEO不友好
3. 前端路由帮助我们在仅有一个页面时记住用户进行了哪些操作

### 前端路由解决的问题

1. 当用户刷新页面，浏览器会根据当前URL对资源进行重定向(发起请求)
2. 单页面对服务端来说就是一套资源，怎么做到不同的URL映射不同的视图内容
3. 拦截用户的刷新操作，避免不必要的资源请求；感知URL的变化

## 常见问题

### StrictMode 模式是什么

StrictMode，16.3 版本发布，为了规范代码，

针对开发者编写的“不符合并发更新规范的代码”给出提示，逐步引导开发者编写规范的代码。比如使用以 will 开头的生命周期就会给出对应的报错提示。

### 类组件，React 请求放哪个生命周期中

类组件：

以前：
认为在 componentWillMount 中进行异步请求，避免白屏。
但是在服务器渲染的话，会执行两次请求，一次在服务端一次在客户端。
其次，`React Fiber` 重写后，`componentWillMount` 可能在一次渲染中多次调用。

官方推荐：`componentDidMount`
有特殊需要提前请求，也可以在 `constructor` 中请求。

函数组件：

`useEffect`

### 类组件，为什么 React bind(this)

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

### 为什么 React 不推荐直接修改 state

1. Debugging：直接修改 state 可能会导致不可预测的行为和难以调试的问题。因为 React 会将组件的 state 看作是一致的，如果直接修改，可能会导致状态不一致，从而导致错误的行为和难以查找的调试问题。
2. 性能问题：直接修改 state 可能会导致性能问题，因为 React 需要在组件层面进行 Diff 和 Re-render。如果直接在 state 中修改数据，React 无法检测到变化，导致组件不会重新渲染。
3. 更简单实现：React 不像 vue，不依赖数据变化，不需要劫持数据的属性。

### useEffect 和 useCallback 有什么？

两个都是用于处理函数组件中副作用的 hook。

1. 作用不同：useCallback 用于创建缓存的函数，以提高组件性能；useEffect 用于在组件渲染后执行副作用操作，如数据获取、订阅和 DOM 操作等。
2. 参数不同：useCallback 接受两个参数，一个是待缓存的函数，另一个是依赖项数组；useEffect 接受一个函数和一个依赖项数组（可选参数）。
3. 执行方式不同：useCallback 在依赖项发生变化时重新创建缓存函数；useEffect 在依赖项发生变化时重新执行副作用操作。

### useEffect, useMemo, useCallback 差异

`useEffect`, `useMemo` 处理组件的状态和属性时具有不同的作用。

`useEffect` 主要用于处理副作用，即那些在组件渲染后产生的附加影响。这些影响可以是订阅外部 API、发送网络请求或执行其他一些异步操作。`useEffect` 接受两个参数，第一个是副作用函数，它会在组件渲染后运行；第二个是依赖数组，用于指定依赖项，当依赖项发生变化时，副作用函数会重新运行。

`useMemo` 则用于避免不必要的计算和渲染。当依赖项发生变化时，`useMemo` 会缓存结果，只有当依赖项发生变化时才会重新计算。这可以提高性能，特别是当计算成本很高时。

`useMemo` 会缓存 `largeArray` 的计算结果，只有当 `props.value` 发生变化时才会重新计算。这样可以避免不必要的计算和渲染，提高性能。

#### 如何判断计算成本高？

一是看计算消耗时间是否很长（1ms 甚至更多），二是对比时间是否减少

```js
// console.time('filter array');
// const visibleTodos = filterTodos(todos, tab);
// console.timeEnd('filter array');

console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // 如果 todos 和 tab 都没有变化，那么将会跳过渲染。
}, [todos, tab]);
console.timeEnd('filter array');
```

useMemo 不会让首次渲染更快，它只会帮助你跳过不必要的更新工作。

执行时机不同

useMemo 的函数会在渲染期间执行，memo 是在 DOM 更新前触发的，就像官方所说的，类比生命周期就是 shouldComponentUpdate。

useEffect 只能在 DOM 更新后并且浏览器渲染完成后再触发

```js
// useMemo
// return生成DOM、渲染
// useEffect
```

### 为什么 React 自定义组件首字母要大写

jsx 通过 babel 转义时，调用了 React.createElement 函数，它接收三个参数，分别是 type 元素类型，props 元素属性，children 子元素。

从 jsx 到真实 DOM 需要经历 jsx->虚拟DOM->真实DOM。如果组件首字母为小写，它会被当成字符串进行传递，在创建虚拟DOM的时候，就会把它当成一个 HTML 标签，而 HTML 没有 app 这个标签，就会报错。组件首字母为大写，它会当成一个变量进行传递，React 知道它是个自定义组件就不会报错了

```js
<app>lyllovelemon</app>
// 转义后
React.createElement("app",null,"lyllovelemon")

<App>lyllovelemon</App>
// 转义后
React.createElement(App,null,lyllovelemon)
```
