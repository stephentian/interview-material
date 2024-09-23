# 代码题

- [大数相加](#大数相加)
- [事件订阅 EventEmitter](#事件订阅-eventemitter)
- [异步并发调度器](#异步并发调度器)
- [柯里化](#柯里化)
- [防抖和节流](#防抖和节流)
- [深拷贝](#深拷贝)
- [数组及对象扁平化](#数组及对象扁平化)
- [call, apply, bind](#call-apply-bind)
- [判断 Array 类型](#判断-array-类型)
- [实现一个 const](#实现一个-const)
- [实现一个 JSON.parse](#实现一个-jsonparse)
- [toString 和 valueOf](#tostring-和-valueof)
  - [让 a===1，a===2，a===3 同时为true](#让-a1a2a3-同时为true)
  - [实现一个无限累加函数](#实现一个无限累加函数)
  - [柯里化多参累加](#柯里化多参累加)
- [消除 await 里的 try catch](#消除-await-里的-try-catch)

## 大数相加

链接: [01.BigNumAdd.js](01.BigNumAdd.js)

JS 在存放整数的时候是有一个安全范围的，一旦数字超过这个范围便会损失精度。

```js
// Number.MAX_SAFE_INTEGER = 9007199254740991 = 2^53 - 1
console.log(Math.pow(2, 53)); // 9007199254740992
console.log(Math.pow(2,53) + 1); //9007199254740992
console.log(-Math.pow(2, 53)); // -9007199254740992
console.log(-Math.pow(2, 53) - 1); //-9007199254740992
```

`2^53 + 1` 数值超过了JS的整数限制，造成了数值溢出。负数也是同样的原因。

使用字符串的方式实现相加。或者引入 `ES2020` 新增的数据类型 `BigInt` 来计算

1. 补 0
2. temp = num1 + num2 + carry
3. 进位 carry = temp > 9 ? 1 : 0
4. 当前位 sum = temp % 10 + sum
5. 最终 sum = carry === '1' ? '1' + sum : sum

## 事件订阅 EventEmitter

链接: [02.EventEmitter.js](02.EventEmitter.js)

核心方法: `on, emit, off, once`

## 异步并发调度器

实现一个异步并发调度器，并有并发限制，最多同时运行 2个任务。 `add` 方法添加任务，`run` 执行任务

链接: [03.Scheduler](03.Scheduler.js)

思路:

- `tasks` 等待执行队列
- `working` 正在执行的
- 超过 并发数 则 `push` 进 `tasks`

## 柯里化

链接: [04.Curry](04.Curry.js)

## 防抖和节流

链接:

- [debounce](debounce.js)
- [throttle](throttle.js)

防抖 `debounce`: 单位时间后执行，如果重复触发，就重新开始计时
节流 `throttle`: 单位时间内只运行一次，在这段时间重复触发，只生效一次

## 深拷贝

代码: [deepClone](deepClone.js)

## 数组及对象扁平化

代码: [Flatten](Flatten.js)

## call, apply, bind

1. 三者都可以改变函数的 `this` 指向

2. `apply` 传数组，`call` 是参数列表；`bind` 参数可以分多次传入

3. `call` 和 `apply` 是直接执行函数, `bind` 是返回一个绑定 `this` 的函数

代码:

1. [call](06.call.js)
2. [apply](05.apply.js)
3. [bind](07.bind.js)

## 判断 Array 类型

1. 原型, Array.prototype.isPrototypeOf(obj)
2. 构造函数, obj instanceof Array
3. Object.prototype.toString.call(obj) === '[object Array]'
4. Array.isArray(obj)
5. Array.from() 将数组转换为一个新的数组对象，并且需要使用 instanceof 运算符进行类型判断。

```js
var arr = [1, 2, 3];

// instanceof
if (arr instanceof Array) {
  console.log("arr 是 Array 类型");
}
// Object.prototype.toString.call
if (Object.prototype.toString.call(arr) === "[object Array]") {
  console.log("arr 是 Array 类型");
}

// Array.from
if (Array.from(arr) instanceof Array) {
  console.log("arr 是 Array 类型");
}

// Array.isArray
// Array.isArray(arr)
```

## 实现一个 const

```js
function __const(data, value) {
  let c = 1
  Object.defineProperty(window, data, {
      enumerable: true, // 可枚举
      configurable: false, // 可配置
      value: value,
      writable: false, // 防止常量值被更改
      get: function () {
        return value
      },
      set: function (newVal) {
        if(c >= 1) throw new TypeError('Assignment to constant variable')
        
        c++
        value = newVal
      }
  })
}

__const('a', 10)
a = 10 // 报错
console.log(a)
```

## 实现一个 JSON.parse

```js
function parse (json) {
    return eval("(" + json + ")");
}
// 相关地址：https://github.com/douglascrockford/JSON-js/blob/master/json2.js#L373
```

## toString 和 valueOf

### 让 a===1，a===2，a===3 同时为true

a 是原始类型，不能同时等于 1，2，3。但是可以利用调用顺序，让 a === 1 && a === 2 && a === 3 为true

```js
// 重写 valueOf
class A {
    constructor(value) {
        this.value = value;
    }
    valueOf() {
        return this.value++;
    }
}
const a = new A(1);
// a 为对象, 用 == 
if (a == 1 && a == 2 && a == 3) {
    console.log("Hi Libai!");
}

// 数据劫持
let value = 1;
Object.defineProperty(window, 'a', {
    get() {
        return value++
    }
})
if (a === 1 && a === 2 && a === 3) {
    console.log("Hi Libai!")
}
```

### 实现一个无限累加函数

利用 闭包 和 `toString` 实现

```js
// add(1)              // 1
// add(1)(2)           // 3
// add(1)(2)(3)        // 6
// add(1)(2)(3)(4)     // 10

function add(a) {
    function sum(b) { // 使用闭包
        a = b ? a + b : a; // 累加
        return sum;
    }
    sum.toString = function() { // 只在最后一次调用
        return a;
    }
    return sum; // 返回一个函数
}

add(1)              // 1
add(1)(2)           // 3
add(1)(2)(3)        // 6
add(1)(2)(3)(4)     // 10

// toString 要 + 号触发
// +add(1)
// +add(1)(2)           // 3
// +add(1)(2)(3)        // 6
// +add(1)(2)(3)(4)

// 或者显式调用
// add(1).toString()
```

### 柯里化多参累加

[04.Curry](04.Curry.js)

## 消除 await 里的 try catch

```js
function to(promise) {
  return promise.then(res => {
    return [null, res]
  }).catch(err => {
    return [err, undefined]
  })
}
```
