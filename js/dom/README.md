# DOM

- [DOM 操作](#dom-操作)
  - [节点查找](#节点查找)
  - [创建节点](#创建节点)
- [DOM 事件](#dom-事件)
  - [DOM 事件级别](#dom-事件级别)

## DOM 操作

### 节点查找

| api                             | 含义                                                      |
| ------------------------------- | --------------------------------------------------------- |
| document.getElementById         | 根据ID查找, 只返回第一个                                  |
| document.getElementsByClassName | 根据类名查找, 多个类名用空格分隔, 返回一个 HTMLCollection |
| dodument.getElementsByTagName   | 根据标签查找, * 表示查找所有标签, 返回一个 HTMLCollection |
| document.getElementsByName      | 根据元素name属性查找                                      |
| document.querySelector          | 返回单个 Node                                             |
| document.querySelectorAll       | 返回一个 NodeList                                         |

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
