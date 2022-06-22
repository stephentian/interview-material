# Framework 框架

- [Framework 框架](#framework-框架)
  - [Vue](#vue)
  - [Svelte](#svelte)
  - [Flux(Vuex, Redux)](#fluxvuex-redux)

## Vue

相关文章: [从前端发展史来聊聊 Vue3 的未来价值](https://zhuanlan.zhihu.com/p/522160995)

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
