# Vue vs React

- [Vue vs React](#vue-vs-react)
  - [MVVM](#mvvm)
  - [Vue 和 React 区别](#vue-和-react-区别)
    - [两者本质的区别](#两者本质的区别)
    - [模板的区别](#模板的区别)
    - [组件化的区别](#组件化的区别)
    - [原理不同](#原理不同)
    - [diff 算区别](#diff-算区别)
  - [Vue 和 React 共同点](#vue-和-react-共同点)
  - [key 值的作用](#key-值的作用)
  - [虚拟 Dom(Virtual Dom)](#虚拟-domvirtual-dom)
  - [Diff 算法](#diff-算法)

## MVVM

传统的 MVC：model view controller；

MVVM 是 Model-View-ViewModel 的缩写

Model 代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑。
View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来。
ViewModel 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步 View 和 Model 的对象，连接 Model 和 View。

## Vue 和 React 区别

其实技术选型没有绝对的对与错，只是考虑的因素不同。

### 两者本质的区别

Vue - 本质是 MVVM 框架， 由 MVC 发展来的
React - 本质是前端组件化框架，由后端组件化发展来的

### 模板的区别

Vue - 使用模板，指令(最初由 angular 提出)
React - 使用 JSX

模板语法上，我更倾向于 React

```
// React:
// 只需要知道一点， {} 里放 js 表达式
<div>
  { ok ? <h1>Yes</h1> : <h1>No</h1>}
</div>

// Vue:
// 需要学习 vue 语法
<div>
  <h1 v-if="ok">Yes</h1>
  <h1 v-else>Yes</h1>
</div>
```

模板分离上，我更倾向于 Vue

```
// React:
class Todo extends Component {
  constructor(props) {
    super(props)
  }
  // render 里模板和 JS 混在一起，未分离
  render() {
    return (
      <div></div>
    )
  }
}

// Vue:

```

### 组件化的区别

React 本身就是组件化，没有组件化就不是 React
Vue 也支持组件化，不过是在 MVVM 上的扩展

组件化，我更倾向于 React

### 原理不同

vue 使用响应式系统 + 虚拟 Dom；
React 使用 虚拟 Dom 进行 diff 检查差异。

### diff 算区别

两者都使用来 Virtual Dom

不同层级之间的节点（Node）没有必要对比，因为这可能会带来 O(N³) 的计算复杂度

因此，狭义的 DOM Diff 算法，一般指的是同一层级兄弟节点的范围之内

- React
  - 首个节点不执行移动操作（除非它要被移除），以该节点为原点，其它节点都去寻找自己的新位置
  - 每一个节点与前一个节点的先后顺序与在 Real DOM 中的顺序进行比较，如果顺序相同，则不必移动，否则就移动到前一个节点的前面或后面

- Vue
  - 建立新序列（Virtual DOM）头（NS）尾（NE）、老序列（Real DOM）头（OS）尾（OE）一共4个指针，然后让NS/NE与OS/OE比较；
  - 双向遍历的方式，加速了遍历的速度
  - compile 阶段的optimize标记了static 点,可以减少 differ 次数,而且是采用双向遍历方法;

## Vue 和 React 共同点

1. 都支持组件化；
2. 都是数据驱动视图。
3. 都是基于 虚拟 Dom

## key 值的作用

1. 是给每一个 vnode 的唯一 id,可以依靠 key, 更准确, 更快的拿到 oldVnode 中对应的 vnode 节点。
2. 更新组件时判断两个节点是否相同。相同就复用，不相同就删除旧的创建新的。

我不认为带 key 一定可以增加 diff 效率，因为 key 的增删也是耗时的。

当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。
如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，
而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。
key 的作用主要是为了高效的更新虚拟 DOM。

## 虚拟 Dom(Virtual Dom)

Virtual Dom 结构：

```
// 标签名，属性，孩子节点，render 函数

class Element {
  constrctor(tagName, attrs, children) {
    this.tagName = tagName
    this.attrs = attrs || {}
    this.children = children || []
  }
  render() {
    // 用来生成真实的 Dom
  }
}

```

Virtual Dom 转换成真实 Dom 并添加到网页的过程：

```
<ul id="list">
  <li class="a">1</li>
  <li>2</li>
</ul>

// 创建成 Virtual Dom
let ul = Element('ul', {id: 'list'}, [
  Element('li', {class: 'a'}, ['1']),
  Element('li', {}, ['2'])
])

// 生成真实 Dom
let ulDom = ul.render()

// 添加到页面中
document.body.appendChild(ulDom)
```

## Diff 算法

首先，diff 算法也不是前端创造的，比如我日常使用的 `git diff` 也是运用了 diff 算法。
linux 系统里好像也有 diff 命令来比较文件。

vue 和 react 里的 diff 算法有所不同。它们的 diff 算法就是对虚拟节点 Element 进行对比，并返回一个 patchs 对象，用来存储两个节点不同的地方，最后用 patchs 记录的消息去局部更新 Dom。

**注意点：**
同层比较，如果不同层会直接删掉老的，直接创造一个新的。
所以官方建议不要进行 DOM 节点跨层级的操作。

不设 key 时，newNode 和 oldNode 只会头尾两端相互比较，
有 key 时， 还会从 key 生成的的对象找匹配节点，如果有说明只是换了位置。
