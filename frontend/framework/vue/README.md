# Vue

- [基础知识](#基础知识)
  - [Vue 发展史](#vue-发展史)
  - [api 风格](#api-风格)
  - [生命周期](#生命周期)
  - [Vue 实例过程](#vue-实例过程)
  - [数据响应式原理](#数据响应式原理)
  - [双向绑定原理](#双向绑定原理)
- [虚拟 DOM](#虚拟-dom)
- [组件中 name 选项作用](#组件中-name-选项作用)
- [nextTick 原理](#nexttick-原理)
- [父子组件渲染过程](#父子组件渲染过程)
- [组件之间的通信](#组件之间的通信)
- [keep-alive](#keep-alive)
- [Vue3](#vue3)
  - [vue3 更新](#vue3-更新)
  - [vue3 Diff](#vue3-diff)
  - [Vue3 组件通信](#vue3-组件通信)
  - [defineProperty 缺点](#defineproperty-缺点)
  - [Vue3.0 性能提升](#vue30-性能提升)
  - [ref 和 reactive](#ref-和-reactive)
  - [watch 和 watchEffect](#watch-和-watcheffect)
- [Vue-Router](#vue-router)
- [问题](#问题)
  - [v-if 和 v-for 一起用有什么问题](#v-if-和-v-for-一起用有什么问题)

## 基础知识

### Vue 发展史

- 2015年，Vue1.0

  1. 和 `Angular` 一样，把 `template` 扔给浏览器渲染，有点像 `jQuery`。
  2. 异步请求库用 `vue-resource`

- 2016年，Vue2.0

  文档地址：[https://v2.cn.vuejs.org/v2/guide/](https://v2.cn.vuejs.org/v2/guide/)

  1. 吸收了 React 虚拟 DOM 的方案，将 `template` 编译为 `render` 函数，`render` 返回 `Virtual DOM`，然后 `patch` 对比差异，最后渲染
  2. `runtime` 版本（使用 `render` 渲染）和 `compiler` 版本(使用 `template`)
  3. 支持服务端渲染
  4. 异步请求库用 `axios`

- 2020年，Vue3

  文档地址：[https://cn.vuejs.org/guide/introduction.html](https://cn.vuejs.org/guide/introduction.html)

  1. 源码使用 `TypeScript` 重写，原来是 `Flow`
  2. `Virtual Dom` 重构
  3. 使用 `Proxy` 代替 `defineProperty`
  4. 自定义 `render API`
  5. 支持 `Time Slicing` 时间切片(类似 `React Fiber` 切片架构)，Vue 会限制执行时间(小于 `16ms`)，只在一个时间片段内运行。

### api 风格

选项式 API (Options API)

可以用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。

组合式 API (Composition API)

这套 API 的风格是基于函数的组合。组合式 API 通常会与 `<script setup>` 搭配使用。使用导入的 API 函数来描述组件逻辑。

选择哪个：

- 其实都可以完成业务场景，复杂的业务场景建议使用组合式 API。
- 选项式 API 中我们主要的逻辑复用机制是 mixins，而组合式 API 解决了 mixins 的所有缺陷。
- 选项氏 API 简单逻辑代码组织很好，但是代码量一多，拆分在了不同的选项中，就很零散；组合式 API 代码组织更好。

### 生命周期

选项式：

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

组合式：

- setup
- beforeCreate
- 初始化选项式 api
- created
- 检查是否存在模版，存在模版，即时编译模版
- onBeforeMount
- onMounted
- 挂载
  - 数据变化时，触发 `onBeforeUpdate` 和 `onUpdated`
- 取消挂载，`onBeforeUnmount` 和 `onUnmounted`

### Vue 实例过程

1. Vue 构造函数执行，全局数据和根组件属性合并
2. 初始化生命周期
3. 初始化自定义事件
4. 执行 `beforeCreate`
5. 初始化模板，解析插槽，`render(h)` 方法
6. 初始化响应式数据
7. 执行 `created`
8. 执行 `mount` 挂载 `el dom` 元素

### 数据响应式原理

响应性是一种可以使我们声明式地处理变化的编程范式。

Vue 数据响应式是通过数据劫持和发布-订阅模型来实现的。

数据劫持：Vue 2 使用 `Object.defineProperty()` 设置属性的 `getter / setters`。Vue 3 中则使用了 `Proxy` 来创建响应式对象，仅将 `getter / setter` 用于 `ref`。

在 `get` 里记录下访问者的信息，添加订阅者 `Watcher`， 因为响应式属性可能被多个地方使用，就是有很多订阅者，消息订阅器存储在一个全局的 `WeakMap` 中。

发布订阅：`Vue` 内部维护的一个订阅者集合 `WeakMap`，当属性发生变化时，`whenDepsChange` 回把订阅者设为活跃状态，然后遍历执行活跃状态订阅者的`update` 方法。

### 双向绑定原理

双向数据绑定就是无论用户更新视图 View 还是数据 Model，另一个都能跟着自动更新。

数据层（Model）：页面渲染所需要的数据
视图层（View）：所呈现出来的页面
业务逻辑层（ViewModel）：框架封装的核心

## 虚拟 DOM

`Virtual DOM`, 用 js 对象来描述真实 DOM 结构

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

作用:

1. 在负责视图中提升渲染性能
2. 维护视图和状态之间的关系
3. 可以支持服务端渲染 `ssr`, 框架跨平台, 原生应用 rn, 小程序等

为什么需要虚拟 DOM

1. 使用 虚拟 DOM 检查差异性能比较好。
2. DOM 对象创建和销毁非常耗费性能。用虚拟 DOM 减少 DOM 创建和销毁。

## 组件中 name 选项作用

1. 允许组件模板递归调用自身。
2. 项目使用 `keep-alive`，可使用组件的 name 进行过滤
3. 便于调试，有名字的组件有更友好的警告信息，搭配 `dev-tools`。

## nextTick 原理

- Vue 是异步渲染 DOM，修改数据，立马获取 DOM 元素是不变的。
- 有时候业务需要必须对数据更改后的 DOM 做相应的处理，这时候就可以使用 Vue.nextTick。

实现:

- 源码首先使用 `promise, MutationOberver` 微任务去实现
- 如果不支持, 就是使用 `setImmediate` 和 `setTimeout`, 等待当前微/宏任务执行完, 再执行回调
- 一次事件循环是一个 `tick`, UI 渲染是在两个 `tick` 之间。

## 父子组件渲染过程

创建过程自上而下, 挂载过程自下而上

- parent created
- child created
- child mounted
- parent mounted

1. Vue 源码中, 会从根组件递归组件, 创建父组件, 有子组件就创建子组件
2. 子组件被创建完, 如果没有子组件, 会添加 `mounted` 钩子到队列中, 等 `patch` 结束后执行. 然后再去父组件执行挂载 `mounted`

## 组件之间的通信

4 种方式:

1. `props/$emit`
2. `eventBus`
3. `provide/inject`
4. `ref/$refs`
5. Vuex, pinia 等全局状态管理

props/$emit

- 使用 `defineProps` 和 `defineEmits` 获得类型推导
- 适用于**父子组件**

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
    </script>
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

`provide/inject`

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

`ref/$refs`

有的时候你仍可能需要在 `JavaScript` 里直接访问一个子组件。可以通过 `ref` 特性为这个子组件赋予一个 ID 引用。

```js
<Child ref="child1"></Child>
```

现在在你已经定义了这个 ref 的组件里，你用下面的指令来访问。

```js
this.$refs.child1
```

## keep-alive

- `<KeepAlive>` 默认会缓存内部的所有组件实例，可以通过 `include` 和 `exclude` prop 来定制该行为
- 传入 `max` prop 来限制可被缓存的最大组件实例数
- 通过 `onActivated`() 和 `onDeactivated`() 注册相应的两个状态的生命周期钩子

原理：采用了 `LRU` (最近最少使用 least recently used)缓存算法管理

1. 缓存组件 vnode 到 cache 对象，键名 `key` 保存为数组 `keys`
2. 将不经常用的缓存组件放前面，常用的放后面
3. 缓存消耗内存，会设一个 max 值，如果超过 max 就将第一个 `key` 删除，对应 `cache` 对象里也删除该节点。

LRU：[LRU.js](https://github.com/stephentian/interview-material/blob/1e031bc07cd58f7f122cddc787e1672efd9395c0/algorithm/LRU.js)

## Vue3

### vue3 更新

1. 提供了组合式API composition API 书写风格 ，和 `setup` 搭配使用
2. 生命周期 `destroyed` 变为 `unmounted`, `beforeDestroy` 变为 `beforeUnmount`
3. `$children` 移除。要访问子组件实例，使用模版引用 `ref`
4. `Mixin` 合并行为变更，`data` 同名属性直接覆盖，而不是合并
5. `$on, $off, $once` 被移除
   - 使用 `provide/inject`
   - 替换使用外部的库，例如`mitt tiny-emitter`
   - 全局状态管理, `pinia`
6. 过滤器 `filters` 移除，使用 计算属性或者方法代替
7. 过渡类名 `v-enter` 修改为 `v-enter-from`、过渡类名 `v-leave` 修改为 `v-leave-from`
8. 提供了 `defineAsyncComponent` 方法，用于异步加载组件
9. 增加了内置组件 `suspense`，用于在组件异步加载时，提供加载状态。
10. 将全局的API，即：Vue.xxx 调整到应用实例（app）上，使用 `app.xxx`（如 `app.use`，`app.config`）

### vue3 Diff

vue2

1. 进行新老节点头尾对比，头与头、尾与尾对比，寻找未移动的节点。
2. 新老节点头尾对比完后，进行交叉对比，头与尾、尾与头对比，这一步即寻找移动后可复用的节点。
3. 在剩余新老结点中对比寻找可复用节点，创建一个老节点 keyToIndex 的哈希表map 记录 key，然后继续遍历新节点索引通过 key 查找可以复用的旧的节点。
4. 节点遍历完成后，通过新老索引，进行移除多余老节点或者增加新节点的操作。

vue3

1. 进行新老节点头尾对比，头与头、尾与尾对比，寻找未移动的节点。
2. 创建一个新节点在旧节点中的位置的映射表，这个映射表的元素如果不为空，代表可复用。
3. 根据这个映射表计算出最长递增子序列，这个序列中的结点代表可以原地复用。之后移动剩下的新结点到正确的位置即递增序列的间隙中。
4. 最长递增子序列：在一个给定的数值序列中，找到一个子序列，使得这个子序列元素的数值依次递增，并且这个子序列的长度尽可能地大。最长递增子序列中的元素在原序列中不一定是连续的。

差别

- 处理完首尾节点后，对剩余节点的处理方式。
- vue2 是通过对旧节点列表建立一个 `{ key, oldVnode }` 的映射表，然后遍历新节点列表的剩余节点，根据 newVnode.key 在旧映射表中寻找可复用的节点，然后打补丁并且移动到正确的位置。
- vue3 则是建立一个存储新节点数组中的剩余节点在旧节点数组上的索引的映射关系数组，建立完成这个数组后也即找到了可复用的节点，然后通过这个数组计算得到最长递增子序列，这个序列中的节点保持不动，然后将新节点数组中的剩余节点移动到正确的位置。

### Vue3 组件通信

- `props` 和 `emit` (`defineProps 和 defineEmits`): 父子组件通信，兄弟节点通过父组件通信
- `provide/inject`: 父组件 provide，所有后代子组件注入 inject
- 全局状态管理：Vuex, pinia

### defineProperty 缺点

- 1. 监控数组麻烦
  - 使用 `Object.defineProperty` 无法监听数组变更,之前是通过 `push、pop、shift、unshift、splice、sort、reverse` 监控
  - 无法监听 通过索引修改数组： `arr[i] = value`
  - 无法监听 `length`
- 2. `Object.defineProperty` 是对属性进行劫持，需要遍历对象的每个属性；`Proxy` 直接代理对象
- 3. 对象新增属性，要重新遍历对象，对新对象使用 `Object.defineProperty` 进行劫持
- 4. `Proxy` 为新标准，浏览器会对其进行优化

### Vue3.0 性能提升

- 在 bundle 包大小方面（tree-shaking 减少了 41% 的体积）
- 初始渲染速度方面（快了 55%）
- 更新速度方面（快了 133%）
- 内存占用方面（减少了 54%）

### ref 和 reactive

两个都是用于创建响应式数据的。

- `ref` 一般用来处理基本数据类型；返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。
- `ref` 也可以绑定对象，对于深层对象会使用 `reactive` 深层转化为响应式；避免深层对象数据绑定 使用 `shallowRef` 替代，不会被深层递归地转为响应式。只有对 `.value` 的访问是响应式的。
- reactive 专门用于处理对象和数组，利用Proxy进行深度数据代理，不需要访问 `.value`。
- reactive 只想保留对这个对象顶层次访问的响应性，请使用 `shallowReactive` 作替代。

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

### v-if 和 v-for 一起用有什么问题

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

在 Vue3 中，虽然技术上 v-if 和 v-for 可以一起使用在一个元素上，但仍然不推荐这样做。

存在以下问题：

- 性能损耗：如前所述，每次循环迭代时都需要执行 v-if 条件判断，对于大数据量或复杂度高的场景，这会增加不必要的计算负担。

- 代码可读性与维护性：同时使用 v-if 和 v-for 在单个元素上可能会使模板逻辑变得复杂，不易于其他开发者理解与维护。这种混杂的条件与循环逻辑容易引发混淆，尤其是在处理较复杂的业务场景时。


