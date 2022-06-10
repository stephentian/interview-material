# Vue

- [Vue](#vue)
  - [基础知识](#基础知识)
    - [Vue 发展史](#vue-发展史)
    - [生命周期](#生命周期)
    - [Vue 的响应式原理](#vue-的响应式原理)
  - [为什么 Vue 还需要虚拟 DOM 进行 diff 检测差异?](#为什么-vue-还需要虚拟-dom-进行-diff-检测差异)
  - [组件中 name 选项作用](#组件中-name-选项作用)
  - [Vue 的 nextTick 的原理是什么？](#vue-的-nexttick-的原理是什么)
  - [Vue 组件之间的通信](#vue-组件之间的通信)
    - [props/$emit](#propsemit)
    - [eventBus](#eventbus)
    - [provide/inject](#provideinject)
    - [ref/$refs](#refrefs)
  - [Vue3.0](#vue30)
    - [变化](#变化)
    - [Vue3 信息通信](#vue3-信息通信)
    - [为什么 Vue3.0 不再使用defineProperty](#为什么-vue30-不再使用defineproperty)
  - [Vue-Router](#vue-router)
    - [route 和 router 的区别](#route-和-router-的区别)
  - [Vuex](#vuex)
    - [Flux 架构](#flux-架构)

## 基础知识

### Vue 发展史

2015年，Vue1.0

1. 和 `Angular` 一样，把 `template` 扔给浏览器渲染，有点像 `jQuery`。
2. 异步请求库用 `vue-resource`

2016年，Vue2.0  

1. 吸收了 React 虚拟 DOM 的方案，将 `template` 编译为 `render` 函数，`render` 返回 `Virtual DOM`，然后 `patch` 对比差异，最后渲染。
2. runtime 版本（使用 render 渲染）和 compiler 版本(使用 template)
3. 支持服务端渲染；
4. 异步请求库用 `axios`

2020年，Vue3.0  

1. 源码使用 `TypeScript` 重写，原来是 `Flow`
2. `Virtual Dom` 重构
3. 使用 `Proxy` 代替 `defineProperty`
4. 自定义 `render API`
5. 支持 Time Slicing 时间切片(类似 React Fiber 切片架构)，Vue 会限制执行时间(小于 16ms)，只在一个时间片段内运行。

### 生命周期

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

### Vue 的响应式原理

当 vue 创建一个实例时, vue 会遍历 data 里的属性，使用 Object.defineProperty 给它们添加 getter/setter 属性。
当被调用时，即触发 getter, Vue 会去 `Watcher` 收集依赖的所有 data。
当被改动时，即触发 setter, Vue 会通知(Notify) `Watcher`, 然后 `Watcher` 去调用 render 函数更新相关组件。

## 为什么 Vue 还需要虚拟 DOM 进行 diff 检测差异?

现代前端框架有两种方式侦测变化,一种是 pull 一种是 push。

Pull: 代表就是 React。
React 要调用 `setState` 去手动更新，然后 React 会一层一层的虚拟 DOM Diff 找出差异，
然后 Patch 到 DOM 上。就是一开始不知道哪里变化了，需要 pull 下最新的代码，才知道哪里变化了。

Push: 代表就是 Vue 的响应式系统。
当 Vue 实例化时会对数据 data 进行依赖的收集，一旦数据发生变化，响应式系统就会得知。
不过缺点是绑定一个数据就需要一个 `Watcher`，绑定的数据很多，就会产生大量的 `Wather`，会带来内存和依赖追踪的开销。所以 Vue 的使用是选择中小型项目。
在组件之间是进行 push 的方式侦测，但是侦测组件内部，使用 虚拟 DOM 检查差异性能比较好。而虚拟 DOM Diff 则是 pull 操作。
Vue 则是 push + pull 结合的方式侦测变化。

## 组件中 name 选项作用

1. 允许组件模板递归调用自身。
2. 项目使用 keep-alive 是，可使用组件的 name 进行过滤
3. 便于调试，有名字的组件有更友好的警告信息，搭配 `dev-tools`。

## Vue 的 nextTick 的原理是什么？

1. 作用：
    Vue 是异步修改 DOM 的并且不鼓励开发者直接接触 DOM。
    但有时候业务需要必须对数据更改--刷新后的 DOM 做相应的处理，这时候就可以使用 Vue.nextTick。
2. 理解前提：
    首先需要知道事件循环中宏任务和微任务这两个概念。
    常见的宏任务有 script, setTimeout, setInterval, setImmediate, I/O, UI rendering。
    常见的微任务有 process.nextTick(Nodejs),Promise.then(), MutationObserver。

## Vue 组件之间的通信

### props/$emit

该方法适用于**父子组件**

```js
// 父组件
<Child :message="message" @emitEvent="onClick"></Child>
export default {
  data() {
    return {
      message: '123'
    }
  },
  methods: {
    onClick() {
      // 父组件响应
    }
  }
}

// 子组件
<div @click="emitEvent"></div>
export default {
  props: ['message']
  methods: {
    emitEvent(...args) {
      this.$emit('emitEvent', ...args)
    }
  }
}
```

### eventBus

`eventBus` 又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心。多用于兄弟组件。
**缺点：** 当项目较大,就容易造成难以维护的灾难。还不利于多人合作。

1. 初始化

    ```js
    // event-bus.js

    import Vue from 'vue'
    export default EventBus = new Vue()
    ```

2. 发送事件

    ```js
    <Child1></Child1>
    <Child2></Child2>

    // Child1
    <button @click="handleAdd"></button>
    <script>
    import { EventBus } from './event-bus.js'
    export default {
      methods: {
        handleAdd() {
          EventBus.$emit('addition', {
            //...arguments
          })
        }
      }
    }
    </script>>
    ```

3. 接收事件

    ```js
    // Child2
    export default {
      mouted() {
        EventBus.$on('addition', params => {
          // ...
        })
      }
    }
    ```

### provide/inject

vue 新增 api， 父组件中通过provide来提供变量, 然后再子组件中通过inject来注入变量。

```js
// 父组件
<Child></Child>
export default {
  provide: {
    getMessage: 'message'
  }
}

// 在任何子组件
export default {
  inject: ['getMessage']
}
```

### ref/$refs

有的时候你仍可能需要在 JavaScript 里直接访问一个子组件。可以通过 `ref` 特性为这个子组件赋予一个 ID 引用。

```js
<Child ref="child1"></Child>
```

现在在你已经定义了这个 ref 的组件里，你用下面的指令来访问。

```js
this.$refs.child1
```

## Vue3.0

### 变化

1. `$children` 移除。要访问子组件实例，使用 `$refs`
2. `data` 选项标准化，只能接受返回 `object` 的 `function`
3. `Mixin` 合并行为变更，`data` 同名属性直接覆盖，而不是合并
4. `$on, $off, $once` 被移除
   - 之前用于创建一个事件总线，`eventBus`
   - 事件总线模式可以被替换为使用外部的库，例如`tiny-emitter`
5. 过滤器移除，使用 计算属性或者方法代替。
6. 过渡类名 v-enter 修改为 v-enter-from、过渡类名 v-leave 修改为 v-leave-from
7. `.sync` 的部分并将其替换为 `v-model`
8. `v-if` 总是优先于 `v-for` 生效。

### Vue3 信息通信

- Prop 和事件: 父子组件通信，兄弟节点通过父组件通信
- Provide/inject: 组件和插槽通信，也能用于组件远距离通信
- 全局状态管理：Vuex, pinia

### 为什么 Vue3.0 不再使用defineProperty

- 1. 监控数组麻烦
  - 使用 `Object.defineProperty` 无法监听数组变更,之前是通过 `push、pop、shift、unshift、splice、sort、reverse` 监控
  - 无法监听 通过索引修改数组： `arr[i] = value`
  - 无法监听 `length`
- 2. `Object.defineProperty` 是对属性进行劫持，需要遍历对象的每个属性；`Proxy` 直接代理对象
- 3. 对象新增属性，要重新遍历对象，对新对象使用 `Object.defineProperty` 进行劫持
- 4. `Proxy` 为新标准，浏览器会对其进行优化。

## Vue-Router

### route 和 router 的区别

`route`： 是“路由信息对象”，包括 path, params, hash, query, fullPath, matched, name等路由信息参数。
`router`：是“路由实例对象”，包括了路由的跳转方法(push、replace)，钩子函数等。

## Vuex

### Flux 架构

数据流: view -> action -> dispatcher -> store
