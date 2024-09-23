# DOM

- [Event](#event)
- [事件委托](#事件委托)
- [事件模型](#事件模型)
- [事件流](#事件流)
- [DOM 操作](#dom-操作)
  - [获取元素](#获取元素)
  - [创建节点](#创建节点)
- [DOM 事件](#dom-事件)
  - [DOM 事件级别](#dom-事件级别)
- [MutationObserver](#mutationobserver)
  - [执行时机](#执行时机)

DOM 标准文档地址: [whatwg DOM](https://dom.spec.whatwg.org/)

## Event

```js
event.preventDefault()  // 例如阻止链接跳转
event.stopPropagation() // 阻止事件冒泡
event.stopImmediatePropagation()  // 阻止事件冒泡, 并且阻止之后相同事件的其他函数执行
event.currentTarget() // 获取到的是绑定事件的标签元素
event.target()  // 获取的是触发事件的标签元素
```

## 事件委托

完美版，防止点击了子元素  

```js
let delegate = function(element, eventType, selector, fn) {
  element.addEventListener(eventType, e => {
    let el = e.target
    while (!el.matches(selector)) {
      el = el.parentNode
      if(element === el) {
        el = null
        break
      }
    }
    el && fn.call(el, e, el)
  })
  return element
}
```

```js
var element = document.querySelector('.list')
element.addEventListener('click', e => {
  let el = e.target
  while(el.tagName.toLowerCase() !== 'li') {
    el = el.parent
    if (el === element) {
      el = null
      break
    }
  }
  el && console.log('点击了 xxx')
})
```

## 事件模型

DOM 事件模型分为捕获和冒泡

## 事件流

三个阶段

1.事件的捕获阶段

```js
windiw --> document --> html --> body --> ... --> 目标元素
```

2.事件目标阶段

3.事件冒泡阶段

## DOM 操作

### 获取元素

| api                             | 含义                                                      |
| ------------------------------- | --------------------------------------------------------- |
| document.getElementById         | 返回第一个匹配元素，根据ID查找     |
| document.getElementsByClassName | 返回元素集合，伪数组, 一个 HTMLCollection；根据类名查找, 多个类名用空格分隔 |
| dodument.getElementsByTagName   | 返回伪数组；根据标签查找, * 表示查找所有标签, 返回一个 HTMLCollection |
| document.getElementsByName      | 返回伪数组；根据元素 name 属性查找                                      |
| document.querySelector          | 返回单个 Node                                             |
| document.querySelectorAll       | 返回伪数组，一个 NodeList                                      |

### 创建节点

1. createElement

    ```js
    var el = document.createElement("div");
    document.body.appendChild(el);
    // createElement 创建的元素不属于 document 对象
    // 需调用 appendChild 或 insertBefore 添加到 HTML 文档
    ```

2. createTextNode 创建文本节点

    ```js
    var node = document.createTextNode("文本节点");
    document.body.appendChild(node);
    ```

3. cloneNode 克隆节点

    ```js
    var form = document.getElementById("form");
    var clone = form.cloneNode(true);
    clone.id = "form2";
    document.body.appendChild(clone);
    // 克隆节点, 不会克隆事件
    ```

4. createDocumentFragment

   创建一个 文档碎片 documentFragment. 轻量型文档，用于存储临时节点。

## DOM 事件

### DOM 事件级别

DOM事件分为3个级别：DOM0 级事件处理，DOM2 级事件处理和 DOM3 级事件处理

1.DOM0 级别

```js
el.onclick = function() {}
```

2.DOM2 级别

```js
el.addEventListener(event, callback, useCapture)
```

3.DOM3 级别
在 DOM2 级事件的基础上添加了更多的事件类型

- UI事件，当用户与页面上的元素交互时触发，如：load、scroll
- 焦点事件，当元素获得或失去焦点时触发，如：blur、focus
- 鼠标事件，当用户通过鼠标在页面执行操作时触发如：dblclick、mouseup
- 滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
- 文本事件，当在文档中输入文本时触发，如：textInput
- 键盘事件，当用户通过键盘在页面上执行操作时触发，如：keyup、keydown、keypress
- 合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
- 变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
- 同时DOM3级事件也允许使用者自定义一些事件

## MutationObserver

`MutationObserver` 是一个用于监听 DOM 变化的接口，它可以检测到 DOM 元素的增删改查等操作。

DOM 事件同步触发，`MutationObserver` 异步触发，不会阻塞页面的渲染。

应用场景:

1. 子节点变化，比如添加、删除、替换节点，修改属性值等。
2. 表单验证，比如用户输入内容时，实时验证是否符合要求。
3. 响应式布局，比如根据屏幕宽度动态调整布局。
4. 滚动监听，比如监听滚动条的位置，判断是否滚动到顶部、底部等。

案例：[mutationObserver](./mutationObserver.html)

### 执行时机

异步任务，在微任务队列中执行

`MutationObserver` 是异步触发的。这意味着当 DOM 发生变化时，它并不会立即触发，而是等到当前所有DOM操作都结束后才触发。这个执行时机类似于微任务，但与微任务和宏任务在 JavaScript 中的处理方式有所不同。
