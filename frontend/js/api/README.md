# 内置对象及语句

- [toStrng 和 valueOf](#tostrng-和-valueof)
- [charCodeAt()](#charcodeat)
- [eval](#eval)
- [箭头函数](#箭头函数)
- [padStart 和 padEnd](#padstart-和-padend)
- [模板字符串](#模板字符串)
- [扩展运算符](#扩展运算符)
- [Symbol](#symbol)
- [Set](#set)
- [Map](#map)
- [WeakMap](#weakmap)
- [WeakSet](#weakset)
- [Promise](#promise)
- [Reflect](#reflect)
- [Generator](#generator)
- [Proxy](#proxy)
- [Class](#class)
- [async 和 await](#async-和-await)

## toStrng 和 valueOf

`toString`: 返回该对象的字符串

`valueOf`: 返回该对象的原始值

```js
// toString 常用来判断类型
// Object.prototype.toString.call(obj)
toString.call(()=>{})       // [object Function]
toString.call([])           // [object Array]
toString.call('')           // [object String]
toString.call({})           // [object Object]
toString.call(22)           // [object Number]
toString.call(new Date)     // [object Date]
toString.call(Math)         // [object Math]
toString.call(window)       // [object Window]
toString.call(undefined)    // [object Undefined]
toString.call(null)         // [object Null]

let c = [1, 2, 3]
let d = {a:2}

console.log(c.valueOf())    // [1, 2, 3]
console.log(d.valueOf())    // {a:2}
```

共同点: 在输出对象的时候会自动调用

不同点: 默认返回值不同，存在优先级关系

在二者并存的情况下，数值运算时，优先调用 `valueOf`，字符串运算时，优先调用 `toString`

```js

```

## charCodeAt()

返回指定位置的字符的 Unicode 编码，返回值是 0 - 65535 之间的整数。

示例：

```js
"ABC".charCodeAt(0); // 返回 65
```

使用场景：

1. 判断大小写

    ```js
    function isUpper(ch) {
      var charCode = ch.charCodeAt(0)
      return charCode >= 65 && charCode <= 90
    }
    isUpper('A')
    // => true
    isUpper('a')
    // => false
    ```

2. 字符串相加转数字运算

```js
// 比如要完成 '5' + '5' = '55'

num = '5' * 10 + '5'.charCodeAt() - '0'.charCodeAt();
//等价于
num = '5' * 10 + Number('5')
```

## eval

`eval` 函数可以将一个字符串作为 `JavaScript` 代码来执行。

用法：

1. 动态执行 JavaScript 代码，实现动态更新页面的效果；

    ```js
    // 动态生成 HTML 元素
    var str = "<div>动态生成的元素</div>";
    eval("document.body.innerHTML += '" + str + "';");

    // 等价于
    eval("document.body.innerHTML += '<div>动态生成的元素</div>';");
    ```

2. 将字符串转换为 JavaScript 对象；

    ```js
    // 将 JSON 字符串转换为 JavaScript 对象
    var jsonStr = '{ "name": "张三", "age": 20 }';
    var jsonObj = eval("(" + jsonStr + ")");
    console.log(jsonObj.name); // 输出："张三"
    ```

3. 实现动态加载 JavaScript 文件:

    ```js
    // 动态加载 JavaScript 文件
    var scriptUrl = "http://example.com/script.js";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", scriptUrl, false);
    xhr.send(null);
    eval(xhr.responseText);
    ```

问题：

1. 安全问题：由于 `eval` 函数会将字符串解析为 js 代码并在当前作用域中执行，因此如果传入的字符串来源不可信，就可能会导致代码注入等安全问题。
2. 性能问题：由于 `eval` 函数的执行需要解析字符串并执行 JavaScript 代码，所以会比直接执行 JavaScript 代码要慢一些，尤其是在循环中多次执行时，性能影响会更明显。
3. 作用域问题：由于 `eval` 函数在当前作用域中执行代码，因此可能会导致变量名和函数名冲突等问题。

## 箭头函数

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

## padStart 和 padEnd

字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。

接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。

```js
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

// 原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

// 省略第二个参数，默认使用空格补全长度。
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

padStart()的常见用途是为数值补全指定位数。

```js
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"

'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## 模板字符串

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

A: Lydia 21 ["", " is ", " years old"]
B: ["", " is ", " years old"] Lydia 21
C: Lydia ["", " is ", " years old"] 21
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
const country = "China";
const age = 21;
function mytag(strings, ...values){
    console.log(strings);
    console.log(values);
}
mytag`age is ${age},country is ${country}`;

// output
// ['age is ', ',country is ', '']
// [ 21, "China"]
```

## 扩展运算符

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

## Symbol

原始数据类型。使用 `Symbol()` 创建 Symbol 类型的值。不支持 `new Symbol()`。

每个 Symbol 值都是唯一的，用来解决命名冲突的问题。

`Symbol.for(key)`：

`key`，字符串。和 `Symbol()` 不同，每次都会创建一个新的 symbol。`Symbol.for()` 会检查 `key` 对应的 symbol，有则返回，没有则会在全局 symbol 注册表中创建一个新的。

```js

Symbol.for("foo"); // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
Symbol.for("foo"); // 从 symbol 注册表中读取键为"foo"的 symbol
Symbol.for("bar") === Symbol.for("bar"); // true
Symbol("bar") === Symbol("bar"); // false, 每次会创建一个新的
```

`Symbol.keyFor(sym)`

`sym`: 必选，查找键值的某个 symbol.

如果全局注册表中查找到该 symbol，则返回该 symbol 的 key 值，返回值为字符串类型。否则返回 undefined

```js
var globalSym = Symbol.for("foo");
Symbol.keyFor(globalSym); // "foo"

var localSym = Symbol();
Symbol.keyFor(localSym); // undefined，
```

## Set

类似于数组，但是成员的值都是唯一的，没有重复的值

Set 结构没有键名，只有键值（或者说键名和键值是同一个值）

```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

// new Set([2, 3, 5, 4, 5, 2, 2])

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

## Map

js 中的对象，键值对的集合（Hash结构），只能用字符串当作键名

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
7. entries

遍历: Map 的遍历顺序就是插入顺序

```js
const map = new Map();
map.set('name', '张三');
map.set('title', 'Author');
map.set('age', 18);

// forEach
map.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
})

// entries()
// entries() 方法返回一个包含 Map 对象中每个元素的 [key, value] 数组的新迭代器
for (const [key, value] of myMap.entries()) {
  console.log(`${key}: ${value}`);
}

// for of
for (const [key, value] of myMap) {
  console.log(`${key}: ${value}`);
}

// for of keys()
for (const key of myMap.keys()) {
  console.log(key);
}
```

## WeakMap

WeakMap 是 ES6 提供的，键值对的集合。键必须是对象或者 `Symbol`，值可以是任意值。
`WeakMap` 键名是弱引用，不会阻止对象被垃圾回收。`WeakMap` 不允许枚举，如果想获取键的列表，应该使用 `Map` 而不是 `WeakMap`。

- `Map` 是强引用，`Map` 存在，它包含的键值对就不会被垃圾回收。
- `Map` 允许任意类型作为键。
- `Map` 有遍历键值对方法，`WeakMap` 不允许遍历键的列表，因为键值对集合可能因为垃圾回收动态变化。
- `Map` 要释放占用的内存，需要显式地删除其中的键值对（使用 delete 方法或 clear 方法），或者将 Map 对象本身置为 null;
  - WeakMap 的键对象没有其他强引用指向它，垃圾回收器可以在任何时候回收该键及其对应的值。

作用场景：

- 缓存 DOM 元素，比如 DOM 节点的属性值，DOM 节点的样式，DOM 节点的事件处理器，DOM 节点的属性值，DOM 节点的样式，DOM 节点的事件处理器。元素被移除后，会自动释放，避免泄漏。
- 缓存事件监听器，DOM元素移除后，事件监听也会自动移除。

```js
const wm1 = new WeakMap();
const o1 = {};
const o2 = "";

wm1.set(o1, 'ok');
console.log(wm1.get(o1));
// ok

wm1.set(o2, 'o2 ok?');
console.log(wm1.get(o2));
// Uncaught TypeError: Invalid value used as weak map key
```

## WeakSet

`WeakSet` 是可被垃圾回收的值的集合，包括对象和`Symbol`。`WeakSet` 中的值只能出现一次。

- WeakSet 弱引用：WeakSet 中对象的引用为弱引用。如果没有其他的对 WeakSet 中对象的引用存在，那么这些对象会被垃圾回收。
- WeakSet 只能是对象和 `Symbol` 的集合， Set 可以包含任何类型的任意值

作用场景：

- 对象唯一性检查。虽然不能迭代，但是可以利用它的特性来检查对象是否已经存在。

```js
// 使用场景：检测循环引用
function execRecursively(fn, subject, _res= new WeakSet()) {
  // 避免无限递归
  if (_res.has(subject)) return

  fn(subject)

  if (typeof subject === 'object') {
    _res.add(subject)

    for (const key in subject) {
      execRecursively(fn, subject[key], _res)
    }
  }
}

const foo = {
  foo: "Foo",
  bar: {
    bar: "Bar",
  },
}

foo.bar.baz = foo; // 循环引用！
execRecursively((obj) => console.log(obj), foo);
```

## Promise

链接: [promise](../promise/README.md)

Promise 是 ES6 出的异步编程的一种解决方案。

传统：回调函数，事件监听

## Reflect

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

## Generator

ES6 提供的一种异步编程的解决方案

- function 和函数名之间有个 `*` 号
- 函数内部使用 `yield` 表达式，用来暂停执行
- 返回一个遍历器对象，对象使用 `next` 方法进入下一个状态

async 是Generator函数的语法糖，并对Generator函数进行了改进。

## Proxy

在目标对象之前架设一层 “拦截”，外界对该对象的访问，都必须先通过这层拦截

`var proxy = new Proxy(target, handler)`

- `target`, 代理目标对象(数组，函数，甚至另一个代理)
- `handler` 一个对象，用来定制拦截行为
  - `has`: `in` 操作符捕捉器
  - `get`: 取值捕捉器
  - `set`: 赋值捕捉器

```js
const obj = {
  name: '张三',
  _age: 18
}
const handler = {
  has: function (target, propKey) {
    if (propKey[0] === '_') return false;
    return Reflect.has(target, propKey);
  },
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
}
var proxyObj = new Proxy(obj, handler)

proxyObj.count = 1
//  setting count!
++proxyObj.count
//  getting count!
//  setting count!
//  2

console.log("proxyObj.name", proxyObj.name)
console.log("obj.count", obj.count)
console.log("'_age' in proxyObj", "_age" in proxyObj) // false
console.log("'_age' in o", "_age" in obj) // true
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

## Class

一个定义类的语法糖，让 js 更像传统的面向对象语言（C++，java）

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

// class
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

  // 静态方法
  // 只能 类使用 Point.foo() 
  static foo() {}

  // 私有方法
  // 只能在 类的 内部使用的方法
  #bar() {}
}
```

## async 和 await

1. `async` 表示这是一个 `async` 函数， `await` 只能用在 `async` 函数里面，不能单独使用
2. `await` 等待的是一个 `Promise` 对象，后面必须跟一个 `Promise` 对象，但是不必写 `then()`，直接就可以得到返回值
3. `async` 返回的是一个 `Promise` 对象
