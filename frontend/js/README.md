# JS

官方文档地址：[https://tc39.es/ecma262/](https://tc39.es/ecma262/)

- [JS 基础](#js-基础)
  - [特点](#特点)
  - [设计缺陷](#设计缺陷)
  - [数据类型](#数据类型)
  - [继承](#继承)
  - [垃圾回收](#垃圾回收)
  - [内置对象，方法及语句](#内置对象方法及语句)
- [JS 执行过程](#js-执行过程)
  - [提升](#提升)
  - [作用域](#作用域)
  - [词法作用域](#词法作用域)
  - [执行上下文](#执行上下文)
  - [词法环境](#词法环境)
  - [变量环境](#变量环境)
  - [为什么要有两个词法环境](#为什么要有两个词法环境)
  - [语法环境](#语法环境)
  - [作用域链](#作用域链)
  - [闭包使用场景，注意点](#闭包使用场景注意点)
- [变量类型隐式转换](#变量类型隐式转换)
- [表达式和运算符](#表达式和运算符)
  - [this](#this)
  - [属性访问](#属性访问)
  - [运算符](#运算符)
  - [typeof](#typeof)
- [语句和声明](#语句和声明)
  - [let 和 const](#let-和-const)
  - [for in 和 for of](#for-in-和-for-of)
  - [for await of](#for-await-of)
  - [try catch](#try-catch)
- [DOM](#dom)
- [函数式编程](#函数式编程)
  - [纯函数](#纯函数)
  - [柯里化](#柯里化)
- [问题](#问题)
  - [为什么设计成单线程？](#为什么设计成单线程)
  - [defer 和 async](#defer-和-async)
  - [Event Loop 执行顺序](#event-loop-执行顺序)
- [代码题](#代码题)

## JS 基础

### 特点

- 动态类型语言，声明数据时不需要指明该数据的类型，给数据赋予不同的值，数据变成不同的类型。
- 弱类型, 没有严格的类型检查
- 解释型脚本语言, 不需要编译直接由解释器运行(但是 v8 加入了解释器，很难界定)
- 跨平台性, 依赖于浏览器环境
- 单线程, 适合异步并发, 这也是选择 js 写 Node 的原因
- 面向对象语言, 有类, 对象等
- 支持函数式编程(箭头函数, 高阶函数, 柯里化等)

### 设计缺陷

1. `this` 的设计
2. `type null  = object`
3. `instanceof` 只检查原型，只适用于对象，不适用基础类型。`"a" instanceof String === false`, `"a"` 不是字符串？
4. 隐式转换 `[] + {}` 返回 `"[object Object]"`
5. `==` 类型转换规则极复杂
6. `new Date().getYear()` 返回是 1900 开始计算, 要用 `getFullYear`, 月份为 `getMonth() - 1`
7. `toFixed` 精度问题(`1.335.toFixed(2) = 1.33`，`1.135.toFixed(2) = 1.14`)

### 数据类型

8 种数据类型

基本类型 7 种：

1. `undefined`: 声明变量未初始化的值
2. `null`: 用来保存对象, 没有值. `null` 值表示一个空对象指针. `typeof null` 为 `object`
3. `boolean`
4. `number`
5. `string`
6. `Symbol`
7. `BigInt`: ES2020，大于 `2^53 - 1` 的整数

还有一个 `Object`

### 继承

前置知识： `call, apply, bind`

[JS 继承](./inherit/README.md)

### 垃圾回收

[垃圾回收](./gc.md)

### 内置对象，方法及语句

[内置对象，方法及语句](./api/README.md)

## JS 执行过程

js 执行过程分为两个阶段：

1. 编译阶段
2. 执行阶段

一、编译阶段

编译阶段（序列化-->抽象语法树-->可执行代码）， js 引擎做 3 件事

- 词法分析 `Lexical analyzer` (`Scanner`)
  - 预编译：变量提升，函数提升
  - 将代码分解成各个模块， tokens
- 语法分析 `Syntax analyzer` (`Parser`)
  - 生成 AST，检查语法
- 字节码生成
- 即时编译 JIT：发现某个函数或代码块被频繁执行，就会将其编译成高度优化的机器码

参考文章：

- [Blazingly fast parsing, part 2: lazy parsing](https://v8.dev/blog/preparser)  
- [JavaScript Execution Context and Hoisting Explained with Code Examples](https://www.freecodecamp.org/news/javascript-execution-context-and-hoisting/)
- [万字干货！详解JavaScript执行过程](https://blog.csdn.net/howgod/article/details/118097654?ydreferer=aHR0cHM6Ly9jbi5iaW5nLmNvbS8%3D)
- [JavaScript的执行过程（深入执行上下文、GO、AO、VO和VE等概念）](https://www.cnblogs.com/MomentYY/p/15785719.html)
- 《你不知道的 JavaScript》词法分析

二、执行阶段

<!-- 执行阶段会创建不同类型上下文：全局上下文、函数执行上下文

- 初始化上下文
  - 创建全局变量 Global Object(GO)
  - 添加全局访问变量 Date, Array, String, setTimeout 等等
  - 为函数和变量分配内存（变量提升、函数提升等）
  - 绑定 this
- 执行上下文
  - 执行上下文栈 Execution Context Stack(ECS)
  - 全局执行栈 Global Execution Context(GEC)
  - 函数执行上下文 -->

### 提升

提升包括：参数，变量提升，函数提升

参数：形参 和 实参。形参是函数声明时的变量，实参是调用该函数时传入的具体参数。

函数在运行时 会生成一个活动对象 `Active Object` 简称 AO：

- 分析函数参数
  - 函数接收形式参数，添加到 AO 属性中，这个时候值为 undefined  
  - 接收实参，添加到 AO 属性中，覆盖之前的 undefined
- 分析变量声明  
  - 在分析变量声明时，如果 AO 上已经有该属性了 则不作任何修改
  - 如果 AO 上还没有该属性 则为 undefined
- 分析函数声明  
  - 分析函数声明时 如果 AO 上已经有该属性了 则会覆盖掉

```js
function func(age) {
    console.log(age);   // ƒ age() {}
    var age = 25;
    console.log(age);   // 25
    function age() {}
    console.log(age);   //  25
}
func(18);

// var 换成 let 和 const 会报错: SyntaxError: Identifier 'age' has already been declared
// 因为 let 和 const 是块级作用域，会改变当前作用域
```

提升的优先级：函数提升，变量提升，实参

### 作用域

作用域是一套规则，用来管理引擎如何查找变量。简单的来说，作用域就是个盒子，规定了变量和函数的可访问范围以及他们的生命周期。

编程语言中, 作用域有两种: 词法作用域, 动态作用域

`JavaScript` 的作用域是词法作用域

最外层是 全局作用域, 由 `{}` 包裹为块级作用域

### 词法作用域

也叫 静态作用域, 指作用域是由代码写在哪里来决定的；

无论函数在哪里被调用, 它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定

### 执行上下文

执行上下文（`Execution Contexts`）。

JavaScript 中有三种执行上下文类型：

- 全局执行上下文 (只有一个)
- 函数执行上下文
- eval

每个执行上下文，都有三个重要属性：

- 变量对象(`Variable Object`，VO)
- 作用域链(Scope chain)
- this

上下文环境结构由：词法环境（`Lexical Environments`）和 变量环境（`Variable Environment`）

js 执行上下文两个阶段：1.创建阶段 2.执行阶段

- 创建阶段
  - 当 JS 被编译时，一个执行上下文就被创建
  - 确定 this 的值，也被称为 `This Binding`
  - `Lexical Environment`（词法环境） 组件被创建。
  - `Variable Environment`（变量环境） 组件被创建。

- 当执行上下文准备就绪，进入执行阶段

### 词法环境

词法环境（`Lexical Environment`）

词法环境是在 JavaScript 解析（**代码编译阶段**）代码时创建的一个对象。每个函数和代码块都有它自己的词法环境，用于存储变量和函数的定义和值。包括以下成员：

- 环境记录：environment record，用于记录变量和函数的定义和值；
- 外部环境引用：用于指向外部环境，也就是包含当前词法环境的函数或代码块的词法环境。

词法环境和四个类型的代码结构相对应:

- Global code: 通俗点讲就是源文件代码，就是一个词法环境
- 函数代码：一个函数块内自己是一个新的词法环境
- eval：进入 eval 调用的代码有时会创建一个新的词法环境
- with 结构：一个 with 结构块内也是自己一个词法环境
- catch 结构：一个 catch 结构快内也是自己一个词环境

### 变量环境

变量环境也是一个词法环境，它具有上面定义的词法环境的所有属性，其 EnvironmentRecord 包含了由 VariableStatements 在此执行上下文创建的绑定。

### 为什么要有两个词法环境

变量环境组件（VariableEnvironment） 是用来登记 var function 变量声明，词法环境组件（LexicalEnvironment）是用来登记 let const class 等变量声明。

在ES6之前都没有块级作用域，ES6之后我们可以用let const来声明块级作用域，有这两个词法环境是为了实现块级作用域的同时不影响var变量声明和函数声明。

### 语法环境

语法环境（Syntax Environment）

语法环境：语法环境是在 JavaScript 运行（**代码执行阶段**）代码时创建的一个对象。每个执行上下文都有自己的语法环境，用于存储当前执行代码的上下文信息。包含以下成员：

- 变量环境：用于存储变量和函数的定义和值；
- 外部环境引用：用于指向外部环境，也就是包含当前语法环境的函数或代码块的语法环境；
- this 值：用于存储当前执行上下文中的 this 值。

### 作用域链

- 本质上是一个指向变量对象的指针列表
- 在执行阶段确定, 由当前环境和上层环境一系列变量对象组成
- 保证变量和函数的有序访问

从当前上下文查找, 从父级找, 一直找到全局上下文, 这样形成的链表

### 闭包使用场景，注意点

概念: 一个函数和它的词法环境捆绑在一起, 这样的组合叫闭包

通俗说法: 闭包是由函数和其相关的引用环境组成的一个整体，它可以访问外部函数的变量和参数，并保留这些变量和参数的状态。

使用场景：

1. 封装私有变量和方法：由于之前 JavaScript 中没有类的概念，因此可以使用闭包来模拟私有变量和方法的功能。通过将变量和方法定义在一个函数内部，并返回一个内部函数，可以创建一个闭包，从而实现对变量和方法的私有化。

    ```js
      function Counter() {
        let count = 0; // 私有变量
        function inner() {
          count++;
          console.log(count);
        }
        return inner;
      }
      const counter = Counter();
      counter(); // 输出 1
      counter(); // 输出 2
    ```

2. 延迟执行：闭包可以用于延迟函数的执行。通过将函数定义在一个函数内部，并返回一个内部函数，可以创建一个闭包，从而实现对函数的延迟执行。

    ```js
    function delayedGreeting(name) {
      return function() {
        console.log(`Hello, ${name}!`);
      };
    }
    const greeting = delayedGreeting("Alice"); // 创建闭包
    setTimeout(greeting, 1000); // 延迟 1 秒后执行函数
    ```

3. 记忆化：闭包可以用于缓存函数的计算结果。通过将函数定义在一个函数内部，并返回一个内部函数，可以创建一个闭包，从而实现对函数计算结果的缓存。

    ```js
    function memoize(fn) {
      const cache = {}; // 缓存对象
      return function(...args) {
        const key = JSON.stringify(args); // 将参数转换为字符串作为缓存的键
        if (cache[key]) {
          return cache[key]; // 如果缓存中已经有结果，则直接返回结果
        }
        const result = fn(...args); // 否则计算结果，并存入缓存
        cache[key] = result;
        return result;
      };
    }
    const expensiveFunction = memoize(function(x, y) {
      console.log("calculating...");
      return x + y;
    });
    console.log(expensiveFunction(1, 2)); // 输出 "calculating..." 和 3
    console.log(expensiveFunction(1, 2)); // 只输出 3，因为结果被缓存了
    ```

注意点：

因为闭包会持有外部函数的变量和参数，如果这些变量和参数占用的内存比较大，就会导致内存泄漏。因此，在使用闭包时需要注意内存管理。

如何避免闭包内容泄漏：

1. 及时释放闭包：在不再需要闭包时，可以将闭包设置为 null，从而释放其对外部变量和参数的引用。

2. 减少闭包的使用：尽量避免在循环中创建闭包，因为在循环中创建的闭包很容易导致内存泄漏。

3. 使用事件委托：在处理 DOM 事件时，可以使用事件委托的方式，将事件处理程序定义在父元素上，从而避免在每个子元素上都创建一个闭包。

4. 使用 WeakMap：可以使用 WeakMap 来存储闭包和其相关的数据，这样当闭包不再被使用时，相关的数据会自动被垃圾回收。

    ```js
    const map = new WeakMap();
    function createClosure() {
      const data = { /* 一些数据 */ };
      const closure = function() {
        /* 一些操作 */
      };
      map.set(closure, data); // 使用 WeakMap 存储闭包和相关数据
      return closure;
    }
    const closure = createClosure();
    closure();
    map.delete(closure); // 及时删除闭包和相关数据
    ```

5. 避免循环引用：在使用闭包时，应避免出现循环引用的情况，即闭包和外部变量相互引用，从而导致内存泄漏。可以使用函数参数或全局变量来解决这个问题。

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

1. 全局作用域
   1. 非严格模式，浏览器指向 `window`，node 环境指向 `global`
   2. 严格模式下为 `undefined`
2. 函数作用域
   1. 非严格模式，指向全局对象
   2. 严格模式，指向 `undefined`
3. 对象方法，指向调用者(谁调用指向谁)
4. 构造函数，指向 `new` 创建的对象实例，用 `this` 来设置实例的属性
5. 箭头函数
   1. 本身没有 `this`, 不能当构造函数；
   2. 从外层作用域继承, 在声明的位置时确定 `this`；
   3. 并且不会被 `bind` 改变
6. 类 Class
   1. `this` 指向类的实例，类的静态方法里指向类；
   2. 如果将实例方法解构出来调用会报错 `undefined`，需要在定义的时候 `bind` 绑定 `this` 或使用箭头函数

    ```js
    class Foo {
      sayName(name) {
        this.say(name)
      }

      say(name) {
        console.log("foo name: ", name)
      }
    }

    const foo = new Foo()
    foo.sayName("foo") // foo name:  foo
    const { sayName } = foo
    sayName("foo1") // TypeError: Cannot read properties of undefined (reading 'say')
    const sayName2 = foo.sayName
    sayName2("foo2") // TypeError: Cannot read properties of undefined (reading 'say')

    class Foo1 {
      constructor() {
        this.sayName = this.sayName.bind(this)
      }

      sayName(name) {
        this.say(name)
      }

      say(name) {
        console.log("foo1 name: ", name)
      }
    }

    const foo1 = new Foo1()
    foo1.sayName("foo1")
    const { sayName: sayNameFoo1 } = foo1
    sayNameFoo1("foo2")
    const sayName3 = foo1.sayName
    sayName3("foo3")
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
将一个对象设置为对象 a 的键, 其值为 `123`.
因为这个对象自动转换为字符串化时，它变成了 `[Object object]`.
打印 `a[b]`, 它实际上是 `a["Object object"]`

### 运算符

[运算符](./operator.md)

### typeof

`typeof` 可能的返回值

1. `number`
2. `string`
3. `boolean`
4. `undefined`
5. `symbol`
6. `bigint`
7. `object`
8. `function`
``

`typeof null === 'object'`: 对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"。

## 语句和声明

### let 和 const

1. 两者都是声明变量，但是 `let` 是声明变量，可以重新赋值；`const` 是声明常量，需要在声明的时候就要初始化。
2. 两者都是块级作用域，声明前不可访问；
3. 也会有提升，但是不会像 `var` 一样提升变量为 `undefined`；它们的提升表现为改变了作用域，让当前作用域存在“暂时性死区”；也可以认为不提升，因为暂时性死区严格禁止在声明之前使用变量。访问会报引用错误。

### for in 和 for of

`for in`: 遍历**可枚举属性**数据。得到 key

- **任意顺序**遍历一个对象的除 Symbol 以外的**可枚举属性**
- 遍历数组, 字符串
- 可枚举属性: Object 属性的 `enumerable`

`for of`: 遍历**可迭代对象**定义要迭代的数据。得到 value

- Array，Map，Set，String，arguments 等
- 可迭代: 对象 `[Symbol.iterator]` 有 `next` 方法

总结：

`for in` 是为遍历对象属性而构建的，**不建议与数组一起使用**。一般用于去检查对象属性，处理有 `key-value` 数据。比如配合 `hasOwnProperty()` 来确定某属性是否是对象本身的属性。

比如遍历数组, `for in` 遍历出是 `key(0, 1, 2)`(array 自身的属性), `for of` 遍历出是 `value(a b c)`。

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

### 柯里化

柯里化：只传递函数一部分参数来调用它，让它返回一个函数去处理剩余参数。

简单来说，就是调用函数，它可以接收一部分参数，并返回一个函数，直到收到所有参数为止就输出。

作用：

1. 参数复用
2. 提前返回
3. 延迟执行

```js
// 1. 实现 add(1)(2)(3)

// 箭头函数

// const add = x => y => z => x + y + z;

// 支持以下功能
// add(1, 2, 3)
// add(1, 2)(3)
// add(1)(2, 3)

function add(...args) {
  let sum = args.reduce((res, cur) => res + res)
  return function (...next) {
    return next.length ? add(sum, ...next) : sum
  }
}

const curry = (fn, ...args) => {
  args.length >= fn.length ? fn(...args)
   : (..._args) => curry(fn, ...args, ..._args)

}

```

## 问题

### 为什么设计成单线程？

作者布兰登，不想让浏览器变得太复杂

1. JavaScript的诞生就是为了处理浏览器网页的交互
2. 因为多线程需要共享资源、且有可能修改彼此的运行结果
3. 两个线程修改了同一个 DOM 节点就会产生不必要的麻烦

### defer 和 async

defer 和 async 在网络读取（下载）这块儿是一样的，都是异步的（相较于 HTML 解析）

- defer: 会在整个文档解析完成后, document 的 DOMContentLoaded 之前执行
- async: js 在下载完后会立即执行

### Event Loop 执行顺序

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

打印顺序: `0 3 4 7 9 10 5 8 2 1 6`

## 代码题

代码: [code](./code/README.MD)
