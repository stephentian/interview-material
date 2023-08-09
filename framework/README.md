# Framework 框架

- [Vue](#vue)
  - [Vue 优缺点](#vue-优缺点)
- [React](#react)
  - [React 优缺点](#react-优缺点)
- [Svelte](#svelte)
- [Solid](#solid)
- [Flux](#flux)
- [Vuex](#vuex)
  - [Vuex 核心概念](#vuex-核心概念)
  - [mutations 和 actions 区别](#mutations-和-actions-区别)
- [Redux](#redux)
  - [Redux 基本思想](#redux-基本思想)
- [pinia](#pinia)
  - [vuex 和 pinia 区别](#vuex-和-pinia-区别)

## Vue

相关文章: [从前端发展史来聊聊 Vue3 的未来价值](https://zhuanlan.zhihu.com/p/522160995)

### Vue 优缺点

优点

- 优秀的生态，vue-router, vuex等
- 代码可读性，组件里有 html， js，css
- 封装的很好，上手灵活，学习成本低
- 便于团队维护，方便项目交接
- 渲染速度快，虚拟 DOM 局部更新

缺点

- 过度灵活的风险，会让你过于依赖框架，不去深究实现原理
- 兼容性 IE 8
- 依靠依赖收集, 可能有些乱定义变量, 但是变量也会有 watcher，增大无用代码
- Object.definedProperty 数组修改, 无法监听等
- mixin 混用，命名空间相同问题
- 很多 Vue2 问题 Vue3 解决了

## React

### React 优缺点

优点

- 浏览器兼容性好
- 渲染速度快
- 代码模块化

缺点

- 心智负担，甚至会影响业务逻辑的正确与否
- 学习路线陡峭，很多 API 要熟悉
- 私人封装，接手困难
- this 绑定（用 hooks 不会）
- this.setState 设计迷思
- React 18 也优化了很多上述缺点

## Svelte

核心思想：通过静态编译减少框架运行时的代码量

`Vue` 和 `React` 无论怎么编译，使用时都必然引入框架本身，也就是运行时 `runtime`

优点：

1. 性能更好：与传统的前端框架相比，Svelte 的编译方式可以减少代码量，并在运行时避免了额外的运行时开销，从而实现更快的性能和更小的文件大小。
2. 更容易学习：Svelte 的 API 和概念相对简单，学习曲线较低，开发者可以更快地上手。
3. 更易于维护：Svelte 的组件代码生成为原生 JavaScript 代码，可以方便地进行调试和维护。
4. 更好的开发体验：Svelte 支持实时更新，可以在开发过程中实时预览修改后的效果。

缺点：

1. 社区相对较小：相对于传统的前端框架，Svelte 的社区相对较小，可能存在缺乏相关资源和支持的问题。
2. 缺乏生态系统：相对于 React 和 Vue 等传统前端框架，Svelte 缺乏成熟的生态系统，可能需要开发者自行实现一些功能。

```js
<!-- Svelte -->
{#if xxx}
  <h1 />
{:else}
  <div />
{/if}
```

## Solid

SolidJS 是一个语法像 React Function Component，内核像 Vue 的前端框架。

SolidJS 通过利用细粒度的观察机制，将组件的渲染过程与 JavaScript 的响应式特性结合起来，实现了高效的界面更新。SolidJS 使用JavaScript 代码来描述界面的结构，而不是像其他框架那样使用模板语言。

## Flux

设计思想: 把组件之间的共享状态抽出, 统一管理, 让这些状态的变化可以预测

Vuex, Redux 等都是用于处理全局状态的工具库。

Flux 思想 单向数据流, 分成 4 个部分: `View Action Dispatcher Store`

Redux 流程: `Component --> Action --> Store --> Reducer`

1. 组件发出 Action `store.dispatch(action)`
2. `Store` 自动调用 `Reducer`

   `let nextState = xxxReduce(previousState, action)`
3. `State` 变化, `Store` 调用监听
4. `store.subscribe(listener)`
5. `listener` 获取状态, 重新渲染

    ```js
    function listerner() {
    let newState = store.getState();
    component.setState(newState);   
    }
    ```

Vux 流程: `Component --> Actions(http request) --> Mutations --> State`

1. 组件发出请求 `store.dispatch()` 到 `Action` 或者直接 `store.commit()` 触发 `Mutations`
2. `mutations` 收到更新 `state`
3. `Component` 接受 `State` 变化更新视图

## Vuex

`Vuex` 是一个专门为 `Vue.js` 应用程序开发的状态管理库。以数据驱动的方式管理应用状态的机制，使得应用的状态更加可维护和可预测。

### Vuex 核心概念

`state`： 应用的状态数据被存储在状态对象中，它是不可变的，只能通过提交 `mutations` 来改变。
`mutations`： 改变状态的方法，它们被定义在 `action` 之外，并且是不可直接调用的。只有通过 `commit` 才能调用。
`actions`： 包含突变方法的对象，它们被提交到 `store` 来改变状态。
`getters`： 基于当前状态计算派生出来的状态。
`modules`： `Vuex` 允许我们将 `store` 分割成模块 `module`。每个模块拥有自己的 `state`、`mutation`、`action`、`getter`、甚至是嵌套子模块。

### mutations 和 actions 区别

两者都是用于修改 state 中的状态。

1. `mutations` 是同步的，`actions` 处理异步操作。
2. `mutations` 只能通过 `commit` 触发，`actions` 只能通过 `dispatch` 触发。
3. `mutations` 直接修改状态，而 `actions` 是通过提交 `mutations` 来改变状态的。

## Redux

Redux 是一个 JavaScript 库，用于管理应用程序的状态。它使应用程序的状态变得更加可预测和可控制，并且使得状态的变化变得更加可追踪和可调试。

Redux 三个原则

1. 单一状态：单一状态树可以更轻松地跟踪随时间的变化以及调试或检查应用程序。
2. 状态只读： `immutable`，改变状态的唯一方法是触发一个动作。
3. 纯函数： 不改变外部状态产生副作用，纯函数返回值取决于其参数值。

### Redux 基本思想

使用单例模式实现

`Store`: 所有的状态都存储在 `Store` 对象中，只能通过返回一个新的 `Store` 去更改它。

```js
import { createStore } from 'redux'
const store = createStore(reducer)
```

`Reducer`: 一个纯函数，它接收当前的状态 `state` 和发过来的 `action`，并返回新的状态。

```js
const reducer = function(prevState, action) {
  ...
  return newState;
};
```

`Action`: `Redux` 通过 `dispatch` 来触发状态的更新，`dispatch` 方法接受一个 `action`，并将其传递给 `reducer` 来更新状态。

```js
store.dispatch({
  type: 'ADD_ITEM',
  payload: 'new item', // 可选属性
})
```

## pinia

Pinia 是一个轻量级的 Vue 状态管理库，类似于 Redux 和 Vuex。它提供了一个简单而灵活的状态管理解决方案，可以轻松地管理应用中的全局状态或局部状态。

### vuex 和 pinia 区别

1. `vuex` 基于 vue2 选项式 api，而 `pinia` 基于 `vue3` 组合式 api；
2. pinia 没有 `mutations`，`actions` 支持同步异步；
3. pinia `state` 是一个箭头函数返回一个对象。
4. `pinia` 没有 `modules` ，每一个独立的模块都是 `definStore` 生成出来的。
