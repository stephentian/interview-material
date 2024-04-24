# Vue

- [基础知识](#基础知识)
  - [Vue 发展史](#vue-发展史)
  - [生命周期](#生命周期)
  - [Vue 实例过程](#vue-实例过程)
  - [数据响应式原理](#数据响应式原理)
  - [双向绑定原理](#双向绑定原理)
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
  - [Vue3.0 性能提升主要是通过哪几方面体现的？](#vue30-性能提升主要是通过哪几方面体现的)
  - [watch 和 watchEffect](#watch-和-watcheffect)
- [Vue-Router](#vue-router)
- [问题](#问题)
  - [为什么不推荐 v-if 和 v-for 一起用](#为什么不推荐-v-if-和-v-for-一起用)

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

### Vue 实例过程

1. Vue 构造函数执行，全局数据和根组件属性合并
2. 初始化生命周期
3. 初始化自定义事件
4. 执行 `beforeCreate`
5. 初始化模板，解析 插槽，`render(h)` 方法
6. 初始化响应式数据
7. 执行 `created`
8. 执行 `mount` 挂载 `el dom` 元素

### 数据响应式原理

数据响应式是指通过数据驱动 `DOM` 视图的变化，是单向的过程。

Vue 的响应式原理基于两个核心概念：依赖追踪 和 变化监听。

依赖追踪：Vue 会遍历 data 对象中的所有属性，使用 `Object.defineProperty()` 方法对每个属性设置 `get/set`。在 `get` 里记录下访问者的信息，添加订阅者 `Watcher`， 因为 `data` 里的属性可能被多次使用，就是有很多订阅者，所以用消息订阅器`Dep` 来管理多个 `watcher` 。当一个属性的值改变是，触发 `set` 里的 `Dep` 会去通知素有的 订阅者 `watcher` 更新数据和更新视图。

变化监听：在通知订阅者时，Vue 使用了一种称为 "发布订阅" 的模式。当一个属性的值发生变化时，Vue 会像订阅者发布一个事件，订阅者通过监听该事件来响应属性的变化。这种模式的实现依赖于 `Vue` 内部维护的一个事件队列，当属性发生变化时，Vue 会将该事件添加到队列中，然后逐个通知订阅者执行相应的操作。

### 双向绑定原理

双向数据绑定就是无论用户更新 View 还是 Model，另一个都能跟着自动更新。

双向数据绑定由三个重要部分构成：

数据层（Model）：页面渲染所需要的数据
视图层（View）：所呈现出来的页面
业务逻辑层（ViewModel）：框架封装的核心

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
      mounted() {
        EventBus.$on('addition', params => {
          // ...
        })
      }
    }
    ```

provide/inject

父组件中通过 `provide` 来提供变量, 然后再子组件中通过 `inject` 来注入变量。

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

1. `$children` 移除。要访问子组件实例，使用模版引用 `ref`
2. `data` 选项标准化，只能接受返回 `object` 的 `function`；在 2.x 中，定义 data 为 object 或者是 function；
3. `Mixin` 合并行为变更，`data` 同名属性直接覆盖，而不是合并
4. `$on, $off, $once` 被移除
   - 之前用于创建一个事件总线，`eventBus`
   - 事件总线模式可以被替换为使用外部的库，例如`tiny-emitter`
5. 过滤器 `filters` 移除，使用 计算属性或者方法代替。
6. 过渡类名 `v-enter` 修改为 `v-enter-from`、过渡类名 `v-leave` 修改为 `v-leave-from`
7. `.sync` 的部分并将其替换为 `v-model`
8. 将全局的API，即：Vue.xxx 调整到应用实例（app）上，使用 app.xxx（如 app.use，app.config）

### Vue3 组件通信

- Prop 和 emit : 父子组件通信，兄弟节点通过父组件通信
- provide/inject: 组件和插槽通信，也能用于组件远距离通信
- 全局状态管理：Vuex, pinia

### 为什么 Vue3 不使用 defineProperty

- 1. 监控数组麻烦
  - 使用 `Object.defineProperty` 无法监听数组变更,之前是通过 `push、pop、shift、unshift、splice、sort、reverse` 监控
  - 无法监听 通过索引修改数组： `arr[i] = value`
  - 无法监听 `length`
- 2. `Object.defineProperty` 是对属性进行劫持，需要遍历对象的每个属性；`Proxy` 直接代理对象
- 3. 对象新增属性，要重新遍历对象，对新对象使用 `Object.defineProperty` 进行劫持
- 4. `Proxy` 为新标准，浏览器会对其进行优化

### Vue3.0 性能提升主要是通过哪几方面体现的？

- 在 bundle 包大小方面（tree-shaking 减少了 41% 的体积）
- 初始渲染速度方面（快了 55%）
- 更新速度方面（快了 133%）
- 内存占用方面（减少了 54%）

### watch 和 watchEffect

watch 和 watchEffect 都用于监听数据然后响应变化。

watch

- 可以访问变化前后的数据
- 需要手动指定监听的数据
- 使用场景：1. 观察特定的数据变化，并执行相应的逻辑时。2. 需要访问变化前后的数据时。

```js
import { ref, watch } from 'vue';  
  
export default {  
  setup() {  
    const count = ref(0);  
  
    watch(count, (newVal, oldVal) => {  
      console.log(`Count changed from ${oldVal} to ${newVal}`);  
    });  
  
    return {  
      count,  
    };  
  },  
};
```

watchEffect

- 自动收集依赖，不需要手动指定监听的数据
- 无法访问变化前后的数据
- 使用场景：1. 当不确定需要观察哪些数据时。2. 需要自动收集依赖时。

```js
import { ref, watchEffect } from 'vue';  
  
export default {  
  setup() {  
    const count = ref(0);  
    const doubleCount = computed(() => count.value * 2);  
  
    watchEffect(() => {  
      console.log(`Double count is ${doubleCount.value}`);  
    });  
  
    return {  
      count,  
      doubleCount,  
    };  
  },  
};
```

## Vue-Router

见 [Vue-Router](./Vue-Router.md)

## 问题

### 为什么不推荐 v-if 和 v-for 一起用

当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名

```js
//  这会抛出一个错误，因为属性 todo 此时
//  没有在该实例上定义

<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

在外新包装一层 `<template>` 再在其上使用 v-for 可以解决这个问题 (这也更加明显易读)：

```js
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

在Vue 3中，虽然技术上v-if和v-for可以一起使用在一个元素上，但仍然不推荐这样做。

存在以下问题：

- 性能损耗：如前所述，每次循环迭代时都需要执行v-if条件判断，对于大数据量或复杂度高的场景，这会增加不必要的计算负担。

- 代码可读性与维护性：同时使用v-if和v-for在单个元素上可能会使模板逻辑变得复杂，不易于其他开发者理解与维护。这种混杂的条件与循环逻辑容易引发混淆，尤其是在处理较复杂的业务场景时。