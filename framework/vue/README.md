# Vue

- [Vue](#vue)
  - [基础知识](#基础知识)
    - [Vue 发展史](#vue-发展史)
    - [生命周期](#生命周期)
    - [Vue 的响应式原理](#vue-的响应式原理)
  - [虚拟 DOM](#虚拟-dom)
  - [组件中 name 选项作用](#组件中-name-选项作用)
  - [nextTick 的原理](#nexttick-的原理)
  - [父子组件渲染过程](#父子组件渲染过程)
  - [组件之间的通信](#组件之间的通信)
  - [keep-alive](#keep-alive)
  - [Vue3](#vue3)
    - [变化](#变化)
    - [Vue3 组件通信](#vue3-组件通信)
    - [为什么 Vue3 不使用 defineProperty](#为什么-vue3-不使用-defineproperty)
  - [Vue-Router](#vue-router)
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

## 虚拟 DOM

什么是 虚拟DOM

Virtual DOM, 用 js 对象来描述真实 DOM 结构

```js
{
  sel: 'div',
  data: {},
  children: undefined,
  text: 'aaa',
  ele: undefined,
  key: undefined
}
```

虚拟DOM 作用

1. 在负责视图中提升渲染性能
2. 维护视图和状态之间的关系
3. 可以支持服务端渲染 ssr, 框架跨平台, 原生应用 rn, 小程序等

为什么需要虚拟 DOM

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

## nextTick 的原理

- Vue 是异步渲染 DOM，修改数据，立马获取 DOM 元素是不变的。
- 有时候业务需要必须对数据更改后的 DOM 做相应的处理，这时候就可以使用 Vue.nextTick。

实现:

- 源码首先使用 `promise, MutationOberver` 微任务去实现
- 如果不支持, 就是使用 `setImmediate` 和 `setTimeout`, 等待当前微/宏任务执行完, 再执行回调.
- 一次事件循环是一个 tick, UI 渲染是在两个 tick 之间。

## 父子组件渲染过程

创建过程自上而下, 挂载过程自下而上

- parent created
- child created
- child mounted
- parent mounted

原因:

1. Vue 源码中, 回递归组件, 先递归到创建父组件, 有子组件就创建子组件
2. 子组件被创建完, 如果没有子组件, 会添加 `mounted` 钩子到队列中, 等 `patch` 结束后执行. 然后再去父组件执行挂载 `mounted`

## 组件之间的通信

4 种方式:

1. props/$emit
2. eventBus
3. provide/inject
4. ref/$refs

props/$emit

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

eventBus

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

provide/inject

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

ref/$refs

有的时候你仍可能需要在 JavaScript 里直接访问一个子组件。可以通过 `ref` 特性为这个子组件赋予一个 ID 引用。

```js
<Child ref="child1"></Child>
```

现在在你已经定义了这个 ref 的组件里，你用下面的指令来访问。

```js
this.$refs.child1
```

## keep-alive

- 组件，或者页面开启缓存数据
- 会触发两个生命周期 `activated` `deactivated`
- 可以在 `activated` 刷新数据

原理：采用了 LRU (最近最少使用 least recently used)缓存算法管理

1. 缓存组件 vnode 到 cache 对象，键名`key`保存为数组 `keys`
2. 将不经常用的缓存组件放前面，常用的放后面
3. 缓存消耗内存，会设一个 max 值，如果超过 max 就将第一个 `key` 删除，对应 `cache` 对象里也删除该节点。

LRU：[LRU.js](../../algorithm/LRU.js)

## Vue3

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

### Vue3 组件通信

- Prop 和事件: 父子组件通信，兄弟节点通过父组件通信
- provide/inject: 组件和插槽通信，也能用于组件远距离通信
- 全局状态管理：Vuex, pinia

### 为什么 Vue3 不使用 defineProperty

- 1. 监控数组麻烦
  - 使用 `Object.defineProperty` 无法监听数组变更,之前是通过 `push、pop、shift、unshift、splice、sort、reverse` 监控
  - 无法监听 通过索引修改数组： `arr[i] = value`
  - 无法监听 `length`
- 2. `Object.defineProperty` 是对属性进行劫持，需要遍历对象的每个属性；`Proxy` 直接代理对象
- 3. 对象新增属性，要重新遍历对象，对新对象使用 `Object.defineProperty` 进行劫持
- 4. `Proxy` 为新标准，浏览器会对其进行优化。

## Vue-Router

见 [Vue-Router](./Vue-Router.md)

## Vuex

### Flux 架构

数据流: view -> action -> dispatcher -> store
