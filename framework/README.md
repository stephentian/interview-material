# Framework 框架

- [Framework 框架](#framework-框架)
	- [Vue](#vue)
		- [Vue 优缺点](#vue-优缺点)
	- [React](#react)
		- [React 优缺点](#react-优缺点)
	- [Svelte](#svelte)
	- [Flux(Vuex, Redux)](#fluxvuex-redux)

## Vue

相关文章: [从前端发展史来聊聊 Vue3 的未来价值](https://zhuanlan.zhihu.com/p/522160995)

### Vue 优缺点

优点

- 优秀的生态，vue-router, vuex等
- 代码可读性，组件里有 html， js，css
- 封装的很好，上手灵活，学习成本低
- 便于团队维护，方便项目交接
- 渲染速度快，虚拟DOM局部更新

缺点

- 过度灵活的风险，会让你过于依赖框架，不去深究实现原理
- 兼容性 IE 8
- 依靠依赖收集, 可能有些乱定义变量, 但是变量也会有 watcher，增大无用代码
- Object.definedProperty 数组修改, 无法监听等
- mixin 混用，命名空间相同问题
- 很多Vue2 问题 Vue3 解决了

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
- this 绑定
- this.setState 设计迷思
- React 18 也优化了很多上述缺点

## Svelte

核心思想：通过静态编译减少框架运行时的代码量

`Vue` 和 `React` 无论怎么编译，使用时都必然引入框架本身，也就是运行时 `runtime`

## Flux(Vuex, Redux)

设计思想: 把组件之间的共享状态抽出, 统一管理, 让这些状态的变化可以预测

Vuex, Redux 等都是用于处理全局状态的工具库.

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
