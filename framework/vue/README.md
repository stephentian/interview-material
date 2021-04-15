# Vue

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Vue 的响应式原理](#vue-%E7%9A%84%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86)
- [为什么 Vue 还需要虚拟 DOM 进行 diff 检测差异?](#%E4%B8%BA%E4%BB%80%E4%B9%88-vue-%E8%BF%98%E9%9C%80%E8%A6%81%E8%99%9A%E6%8B%9F-dom-%E8%BF%9B%E8%A1%8C-diff-%E6%A3%80%E6%B5%8B%E5%B7%AE%E5%BC%82)
- [组件中 name 选项作用](#%E7%BB%84%E4%BB%B6%E4%B8%AD-name-%E9%80%89%E9%A1%B9%E4%BD%9C%E7%94%A8)
- [Vue 的 nextTick 的原理是什么？](#vue-%E7%9A%84-nexttick-%E7%9A%84%E5%8E%9F%E7%90%86%E6%98%AF%E4%BB%80%E4%B9%88)
- [Vue 组件之间的通信](#vue-%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1)
  - [props/$emit](#propsemit)
  - [eventBus](#eventbus)
  - [provide/inject](#provideinject)
  - [ref/$refs](#refrefs)
  - [Vuex](#vuex)
  - [生命周期](#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- [Vue-Router](#vue-router)
  - [route 和 router 的区别](#route-%E5%92%8C-router-%E7%9A%84%E5%8C%BA%E5%88%AB)
- [为什么 Vue3.0 不再使用 defineProperty](#%E4%B8%BA%E4%BB%80%E4%B9%88-vue30-%E4%B8%8D%E5%86%8D%E4%BD%BF%E7%94%A8-defineproperty)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Vue 的响应式原理

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

```
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

    ```
    // event-bus.js

    import Vue from 'vue'
    export default EventBus = new Vue()
    ```

2. 发送事件

    ```
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

    ```
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

```
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

```
<Child ref="child1"></Child>
```

现在在你已经定义了这个 ref 的组件里，你用下面的指令来访问。

```
this.$refs.child1
```

### Vuex

vue 项目状态管理器。
模块：

  1. state
  2. getters
  3. mutations
  4. actions
  5. modules

使用：

```
this.$store.state
```

### 生命周期

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

## Vue-Router

### route 和 router 的区别

`route`： 是“路由信息对象”，包括 path, params, hash, query, fullPath, matched, name等路由信息参数。
`router`：是“路由实例对象”，包括了路由的跳转方法(push、replace)，钩子函数等。

## 为什么 Vue3.0 不再使用 defineProperty

- 1. 监控数组麻烦
  - 使用 `Object.defineProperty` 无法监听数组变更,之前是通过 `push、pop、shift、unshift、splice、sort、reverse` 监控
  - 无法监听 通过索引修改数组： `arr[i] = value`
  - 无法监听 `length`
- 2. `Object.defineProperty` 是对属性进行劫持，需要遍历对象的每个属性；`Proxy` 直接代理对象
- 3. 对象新增属性，要重新遍历对象，对新对象使用 `Object.defineProperty` 进行劫持
- 4. `Proxy` 为新标准，浏览器会对其进行优化。
