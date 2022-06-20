# JS

- [JS](#js)
  - [JS 基础](#js-基础)
    - [类型](#类型)
    - [判断 Array 类型](#判断-array-类型)
    - [继承](#继承)
    - [垃圾回收](#垃圾回收)
    - [事件循环 和 setTimeout requestAnimationFrame](#事件循环-和-settimeout-requestanimationframe)
  - [作用域,作用域链及闭包](#作用域作用域链及闭包)
    - [词法作用域](#词法作用域)
    - [作用域链](#作用域链)
    - [闭包](#闭包)
    - [ES6 新语法](#es6-新语法)
    - [箭头函数](#箭头函数)
    - [模板字符串](#模板字符串)
    - [Promise](#promise)
  - [变量类型隐式转换](#变量类型隐式转换)
  - [表达式和运算符](#表达式和运算符)
    - [this](#this)
    - [算术运算符](#算术运算符)
    - [属性访问](#属性访问)
  - [语句和声明](#语句和声明)
    - [for in 和 for of](#for-in-和-for-of)
    - [try catch](#try-catch)
  - [DOM](#dom)
    - [Event](#event)
    - [事件委托](#事件委托)
    - [事件模型](#事件模型)
    - [事件流](#事件流)
  - [函数式编程](#函数式编程)
    - [纯函数](#纯函数)
  - [常见例题](#常见例题)
    - [defer 和 async](#defer-和-async)
  - [代码题](#代码题)

## JS 基础

### 类型

基本类型: undefined, null, boolean, number, string

引用类型: function, object, array

undefined: 声明变量未初始化的值

null: 用来保存对象, 没有值。null 值表示一个空对象指针. `typeof null` 为 `object`

### 判断 Array 类型

1. 原型, Array.prototype.isPrototypeOf(obj)
2. 构造函数, obj instanceof Array
3. Object.prototype.toString.call(obj) === '[object Array]'
4. Array.isArray(obj)

### 继承

[JS 继承](./inherit/README.md)

### 垃圾回收

[垃圾回收](./gc.md)

### 事件循环 和 setTimeout requestAnimationFrame

JavaScript 是单线程的，防止主线程的不阻塞，Event Loop 的方案应用而生

Event Loop 包含两类

-
- 每一个 Web Worker 也有一个独立的 Event Loop

宏任务 task: script(整体代码), setTimeout, setInterval

微任务 microtask: Promise.then, MutaionObserver

async/await:

- chrome 70 版本

```js
async function async1(){
  await async2()
  console.log('async1 end')
}
// 等价于
async function async1() {
  return new Promise(resolve => {
    resolve(async2())
  }).then(() => {
    console.log('async1 end')
  })
}
```

- chrome 70 版本以上, await 将直接使用 Promise.resolve() 相同语义

setTimeout: 浏览器设置最好间隔 4ms; 经过 5 重嵌套定时器之后，时间间隔被强制设定为至少 4 毫秒。

requestAnimationFrame: 既不是宏任务也不是微任务，render 后，渲染之前执行。

requestAnimationFrame

## 作用域,作用域链及闭包

编程语言中, 作用域有两种: 词法作用域, 动态作用域

`JavaScript` 的作用域是词法作用域

最外层是 全局作用域, 由 `{}` 包裹为块级作用域

### 词法作用域

也叫静态作用域, 在写代码时将变量和块作用域写在哪里来决定的

无论函数在哪里被调用, 它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定

### 作用域链

在执行阶段确定, 由当前环境和上层环境一系列变量对象组成. 保证变量和函数的有序访问

从当前上下文查找, 从父级找, 一直找到全局上下文, 这样形成的链表

### 闭包

概念: 一个函数和它的词法环境捆绑在一起, 这样的组合叫闭包

通俗说法: 可以访问其他函数内部变量的函数

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
  long() {
    return this.radius * 2;
  },
  circular: () => 2 * Math.PI * this.radius
};

shape.long();
shape.circular();

A: 20 and 62.83185307179586
B: 20 and NaN
C: 20 and 63
D: NaN and 63
```

答案：`B`

对于箭头函数, this 指向它所在的上下文的环境, 与普通函数不同！
这意味着当我们调用 `circular` 时，它不是指向 shape 对象，而是指其定义时的环境（window）。
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

### Promise

链接: [promise](./promise/README.md)

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

### 算术运算符

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

// 答案：`C`
// 后缀一元运算符 i++：
// 返回值（返回0）
// 增加值（数字现在是1）

// 前缀一元运算符 ++i：
// 增加值（数字现在是2）
// 返回值（返回2）
```

数据运算中:

`+` 与字符串运算，会变成字符串连接符; 其他运算符会将字符串数字转成数字

```js
"10" + 1
1 + "01"
// "101"

'10' - "1"
10 - "1"
'10' - 1
// 9
```

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

## DOM

文档：[DOM](./dom/README.md)

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

## 常见例题

### defer 和 async

defer 和 async 在网络读取（下载）这块儿是一样的，都是异步的（相较于 HTML 解析）

- defer: 会在整个文档解析完成后, document 的 DOMContentLoaded 之前执行
- async: js 在下载完后会立即执行

## 代码题

代码: [code](./code/README.MD)
