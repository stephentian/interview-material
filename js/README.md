# JS

- [JS](#js)
  - [JS 基础](#js-基础)
    - [特点](#特点)
    - [单线程](#单线程)
    - [类型](#类型)
    - [判断 Array 类型](#判断-array-类型)
    - [继承](#继承)
    - [垃圾回收](#垃圾回收)
    - [JS 执行过程](#js-执行过程)
  - [作用域,作用域链及闭包](#作用域作用域链及闭包)
    - [词法作用域](#词法作用域)
    - [作用域链](#作用域链)
    - [闭包](#闭包)
    - [执行上下文](#执行上下文)
  - [ES6 新语法](#es6-新语法)
    - [箭头函数](#箭头函数)
    - [模板字符串](#模板字符串)
    - [扩展运算符](#扩展运算符)
    - [Set](#set)
    - [Map](#map)
    - [WeakMap](#weakmap)
    - [Promise](#promise)
    - [Reflect](#reflect)
    - [Proxy](#proxy)
  - [变量类型隐式转换](#变量类型隐式转换)
  - [表达式和运算符](#表达式和运算符)
    - [this](#this)
    - [算术运算符](#算术运算符)
    - [属性访问](#属性访问)
  - [语句和声明](#语句和声明)
    - [for in 和 for of](#for-in-和-for-of)
    - [for await of](#for-await-of)
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
    - [考察 Event Loop 执行顺序](#考察-event-loop-执行顺序)
  - [代码题](#代码题)

## JS 基础

### 特点

- 弱类型, 没有严格的类型检查
- 解释型脚本语言, 不需要编译直接由解释器运行
- 跨平台性, 依赖于浏览器环境
- 单线程, 适合异步并发, 这也是选择 js 写 Node 的原因
- 面向对象语言, 有 类, 对象等
- 也可以是函数式语言(箭头函数, 高阶函数, 柯里化等)

当然也有不严谨, 不规范的地方

1. this 的设计
2. type null  = object
3. 隐式转换 [] + {} 返回 "[object Object]"
4. == 类型转换规则极复杂
5. `new Date().getYear()` 返回是 1900 开始计算, 要用 `getFullYear`

### 单线程

不想让浏览器变得太复杂

1. JavaScript的诞生就是为了处理浏览器网页的交互
2. 因为多线程需要共享资源、且有可能修改彼此的运行结果
3. 两个线程修改了同一个DOM节点就会产生不必要的麻烦

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

### JS 执行过程

js 执行过程分为两个阶段：

1. 编译阶段
2. 执行阶段

一、编译阶段

编译阶段 js 引擎做 3 件事

- 词法分析
- 语法分析
- 字节码生成

二、执行阶段

执行阶段会创建不同类型上下文：全局上下文、函数执行上下文

创建上下文分为两个阶段

- 创建阶段
  - 绑定 this
  - 为函数和变量分配内存（变量提升、函数提升等）
  - 初始化变量为 undefined
- 执行阶段

## 作用域,作用域链及闭包

编程语言中, 作用域有两种: 词法作用域, 动态作用域

`JavaScript` 的作用域是词法作用域

最外层是 全局作用域, 由 `{}` 包裹为块级作用域

### 词法作用域

也叫静态作用域, 在写代码时将变量和块作用域写在哪里来决定的

无论函数在哪里被调用, 它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定

### 作用域链

- 本质上是一个指向变量对象的指针列表
- 在执行阶段确定, 由当前环境和上层环境一系列变量对象组成
- 保证变量和函数的有序访问

从当前上下文查找, 从父级找, 一直找到全局上下文, 这样形成的链表

### 闭包

概念: 一个函数和它的词法环境捆绑在一起, 这样的组合叫闭包

通俗说法: 可以访问其他函数内部变量的函数

### 执行上下文

执行上下文指 函数调用时 产生的变量对象. 这个对象无法访问，但是可以访问其中的变量、this 等。

js 执行两个阶段：编译阶段，执行阶段

- 当 JS 被编译时，一个执行上下文就被创建
- 当执行上下文准备就绪，进入执行阶段

## ES6 新语法

- let, const
- 数组，对象解构赋值
- 扩展运算符
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

### 扩展运算符

扩展运算符（spread）是三个点（`...`）

1. 复制数组, 浅拷贝, 深拷贝一层, 后面的还是浅拷贝
2. 合并数组

```js
// 剩余参数
function push(array, ...items) {
  array.push(...items);
}

console.log(...[1, 2, 3])
// 1 2 3

// 字符串转数组
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

### Set

类似于数组，但是成员的值都是唯一的，没有重复的值

Set 结构没有键名，只有键值（或者说键名和键值是同一个值）

```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

属性和方法

1. size
2. add
3. delete
4. has
5. clear

遍历: Set 的遍历顺序就是插入顺序

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue
```

### Map

js 中的对象，本质是键值对的集合（Hash结构），只能用 字符串当作键名

Map 结构, 键名不限于字符串，各种类型都可以当键名。

```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

Map 也可以接受一个数组作为参数

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
])
```

Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键

属性和方法

1. size
2. set
3. get
4. has
5. delete
6. clear

遍历: Map 的遍历顺序就是插入顺序

```js

```

### WeakMap

WeakMap 只接受对象作为键名（null除外），不接受其他类型的值作为键名

### Promise

链接: [promise](./promise/README.md)

### Reflect

用于操作对象的 API

1. Reflect.defineProperty
2. 很多操作会更易读

    ```js
    // 老写法
    Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

    // 新写法
    Reflect.apply(Math.floor, undefined, [1.75]) // 1
    ```

3. 让`Object`操作都变成函数行为

    ```js
    'assign' in Object // true
    Reflect.has(Object, 'assign') // true

    delete myObj.foo
    Reflect.deleteProperty(myObj, 'foo')

    // 代替 new
    const instance = new Greeting('张三');
    const instance = Reflect.construct(Greeting, ['张三']);
    ```

### Proxy

在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截

`var proxy = new Proxy(target, handler)`

- target, 代理目标对象
- handler 一个对象，用来定制拦截行为

```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
})

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

this 问题: 目标对象 this 指向 proxy 代理

```js
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const proxy = new Proxy(target, {});

target.m() // false
proxy.m()  // true
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

`for in`: 遍历**可枚举属性**数据。得到 key

- **任意顺序**遍历一个对象的除Symbol以外的**可枚举属性**
- 遍历数组, 字符串
- 可枚举属性: Object 属性的 `enumerable`

`for of`: 遍历**可迭代对象**定义要迭代的数据。得到 value

- Array，Map，Set，String，arguments 等
- 可迭代: 对象 `[Symbol.iterator]` 有 `next` 方法

`for in` 是为遍历对象属性而构建的，**不建议与数组一起使用**。一般用于去检查对象属性，处理有 `key-value` 数据。比如配合 `hasOwnProperty()` 来确定某属性是否是对象本身的属性。

比如遍历数组, `for in` 遍历出是 `key 0, 1, 2`(array 自身的属性), `for of` 遍历出是 `value a b c`。

### for await of

for await of 用于遍历多个 `Promise`

```js
function createPromise(val) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val)
    }, 1500)
  })
}
(async function () {
  const p1 = createPromise(1)
  const p2 = createPromise(2)
  const p3 = createPromise(3)

  // const res1 = await p1
  // console.log(res1)
  // const res2 = await p2
  // console.log(res2)
  // const res3 = await p3
  // console.log(res3)
  // 1 
  // 2 
  // 3

  const list = [p1, p2, p3]
  Promise.all(list).then(res => console.log(res))
  // [1 2 3]

  for await (let p of list) {
    console.log(p)
  }
  // 1
  // 2 
  // 3
})()
```

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

### 考察 Event Loop 执行顺序

```js
console.log(0)
setTimeout(()=>{
    console.log(1)
})
requestAnimationFrame(()=>{
    console.log(2)
})
console.log(3)
new Promise(function(resolve){
    console.log(4)
    resolve(5);
}).then(res=>{
    console.log(res)
})
requestIdleCallback(()=>{
    console.log(6)
})
async function async1() {
    console.log(7)
    await async2()
    console.log(8)
}
async function async2() {
    console.log(9)
}
async1()
console.log(10)
```

打印顺序: `0 3 4 7 9 10 5 8 2 6 1`

###

## 代码题

代码: [code](./code/README.MD)
