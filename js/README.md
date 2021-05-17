# JS

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [JS 基础](#js-%E5%9F%BA%E7%A1%80)
  - [继承](#%E7%BB%A7%E6%89%BF)
- [ES6](#es6)
  - [箭头函数](#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)
  - [模板字符串](#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)
- [变量类型隐式转换](#%E5%8F%98%E9%87%8F%E7%B1%BB%E5%9E%8B%E9%9A%90%E5%BC%8F%E8%BD%AC%E6%8D%A2)
- [表达式和运算符](#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%92%8C%E8%BF%90%E7%AE%97%E7%AC%A6)
  - [this](#this)
  - [运算符位置](#%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BD%8D%E7%BD%AE)
  - [属性访问](#%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE)
- [语句和声明](#%E8%AF%AD%E5%8F%A5%E5%92%8C%E5%A3%B0%E6%98%8E)
  - [for in 和 for of](#for-in-%E5%92%8C-for-of)
  - [try catch](#try-catch)
- [DOM 事件](#dom-%E4%BA%8B%E4%BB%B6)
  - [DOM 事件级别](#dom-%E4%BA%8B%E4%BB%B6%E7%BA%A7%E5%88%AB)
  - [Event](#event)
  - [事件委托](#%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%89%98)
  - [事件模型](#%E4%BA%8B%E4%BB%B6%E6%A8%A1%E5%9E%8B)
  - [事件流](#%E4%BA%8B%E4%BB%B6%E6%B5%81)
- [函数式编程](#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B)
  - [纯函数](#%E7%BA%AF%E5%87%BD%E6%95%B0)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## JS 基础

### 继承

[JS 继承](./inherit/README.md)

### 垃圾回收

[垃圾回收](./gc.md)

## ES6

### ES6 新语法

- let, const
- 数组，对象解构赋值
- Object.assign 浅拷贝
- 箭头函数
- rest 剩余参数
- Promise
- Class

### 箭头函数

下面代码输出什么？

```js
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius
};

shape.diameter();
shape.perimeter();

A: 20 and 62.83185307179586
B: 20 and NaN
C: 20 and 63
D: NaN and 63
```

答案：`B`

对于箭头函数, this 指向它所在的上下文的环境, 与普通函数不同！
这意味着当我们调用 perimeter 时，它不是指向 shape 对象，而是指其定义时的环境（window）。
没有值 radius 属性，返回 undefined。

### 模板字符串

标签模板字符串

下面代码的输出是什么?

```js
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = "Lydia";
const age = 21;

getPersonInfo`${person} is ${age} years old`;

A: Lydia 21 ["", "is", "years old"]
B: ["", "is", "years old"] Lydia 21
C: Lydia ["", "is", "years old"] 21
```

答案：`B`

解析：

标签模板字符串是通过一个默认的函数(**标签函数**)对其中的插值进行运算和连接的。
这个标签函数会在处理完字符串后，且还没有输出前调用，可以认为是模版字符串的回调函数，或者拦截器。
标签函数第一个参数是一个数组，
是字符串的字面量的一个数组，
后面的参数是不定参数，一个参数代表一个表达式的计算结果

举例：

```js
function mytag(strings,...values){
    console.log(strings);
    console.log(values);
}
mytag`age is ${boy.age},country is ${boy.country}`;

// output
['age is', ',country is', '']
```

## 变量类型隐式转换

下面代码的输出是什么?

```js
function sum(a, b) {
  return a + b;
}

sum(1, "2")

A: NaN
B: TypeError
C: "12"
D: 3
```

答案：`C`

JavaScript 是一种动态类型语言：我们没有指定某些变量的类型。 在您不知情的情况下，值可以自动转换为另一种类型，称为隐式类型转换。 强制从一种类型转换为另一种类型。
在让数字类型（1）和字符串类型（'2'）相加时，该数字被视为字符串。 我们可以连接像 “Hello”+“World” 这样的字符串，所以这里发生的是 '1' + '2' 返回 “12”。

## 表达式和运算符

### this

Javascript 函数中的 `this` 表现与其他语言不同。此外，在严格模式和非严格模式之间也会有一些差别。

大多数情况，函数的调用方式决定了 this 的值（运行时绑定）。为当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。

1. 全局环境下，指向 `window`，严格模式下为 `undefined`
2. 对象静态方法，指向调用者
3. 箭头函数中, // TODO:

### 运算符位置

下面代码的输出是什么?

```js
let number = 0;
console.log(number++);
console.log(++number);
console.log(number);

A: 1 1 2
B: 1 2 2
C: 0 2 2
D: 0 1 2
```

答案：`C`
后缀一元运算符 i++：
返回值（返回0）
增加值（数字现在是1）

前缀一元运算符 ++i：
增加值（数字现在是2）
返回值（返回2）

### 属性访问

1.下面代码的输出是什么?

```js
const a = {};
const b = { key: "b" };
const c = { key: "c" };
a[b] = 123;
a[c] = 456;
console.log(a[b]);

A: 123
B: 456
C: undefined
D: ReferenceError
```

答案：`B`
对象键自动转换为字符串.
将一个对象设置为对象 a 的键, 其值为 123.
因为这个对象自动转换为字符串化时，它变成了 `[Object object]`.
打印 `a[b]`, 它实际上是 `a["Object object"]`

## 语句和声明

### for in 和 for of

`for in`: 以**任意顺序**遍历一个对象的除Symbol以外的**可枚举属性**。

`for of`: 遍历**可迭代对象**定义要迭代的数据。(可迭代对象: Array，Map，Set，String，arguments 等)

`for in` 是为遍历对象属性而构建的，**不建议与数组一起使用**。一般用于去检查对象属性，处理有 `key-value` 数据。比如配合 `hasOwnProperty()` 来确定某属性是否是对象本身的属性。

比如遍历数组, `for in` 遍历出是 `key 0, 1, 2`(array 自身的属性), `for of` 遍历出是 `value a b c`。

### try catch

下面代码的输出是什么?

```js
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();

A: 1 undefined 2
B: undefined undefined undefined
C: 1 1 2
D: 1 undefined undefined
```

答案： `A`

catch 块接收参数 x
这与变量的 x 不同。这个变量 x 是属于 catch 作用域的
我们将这个块级作用域的变量设置为 1, 并设置变量 y 的值.
现在，我们打印块级作用域的变量 x, 它等于 1
在 catch 块之外，x 仍然是 undefined，而 y 是 2.

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

### Event

```js
event.preventDefault()  // 例如阻止链接跳转
event.stopPropagation()
event.stopImmediatePropagation()  // 阻止事件冒泡, 并且阻止之后相同事件的其他函数执行
event.currentTarget() // 获取到的是绑定事件的标签元素
event.target()  // 获取的是触发事件的标签元素
```

### 事件委托

完美版，防止点击了子元素  
1

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

2

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

### 事件模型

DOM 事件模型分为捕获和冒泡

### 事件流

三个阶段

1.事件的捕获阶段

```js
windiw --> document --> html --> body --> ... --> 目标元素
```

2.事件目标阶段

3.事件冒泡阶段

## 函数式编程

"函数式编程"是一种"编程范式"（programming paradigm），也就是如何编写程序的方法论。

面向对象编程是假设一个实体，然后给它属性，方法。

而函数式编程是造工具，把运算过程写成一套函数调用。

### 纯函数

对于一个函数，

1. 相同的输入，永远会得到相同的输出；
2. 不产生副作用；
3. 不依赖外部状态；
我们就把这个函数叫做纯函数
比如 `slice` 和 `splice`， 都可以做同样的操作，
但是 `splice` 会修改参数，也就是传入的数组，所以不是纯函数，而 `slice` 是纯函数。
