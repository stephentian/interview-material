# 代码题

- [代码输出问题](#代码输出问题)
- [大数相加](#大数相加)
- [事件订阅 EventEmitter](#事件订阅-eventemitter)
- [异步并发调度器](#异步并发调度器)
- [柯里化](#柯里化)
- [防抖和节流](#防抖和节流)
- [深拷贝](#深拷贝)
- [数组扁平化](#数组扁平化)
- [call, apply, bind](#call-apply-bind)
- [判断 Array 类型](#判断-array-类型)
- [实现一个 const](#实现一个-const)
- [实现一个 JSON.parse](#实现一个-jsonparse)

## 代码输出问题



## 大数相加

链接: [1.BigNumAdd.js](1.BigNumAdd.js)

- 1. 补 0
- 2. temp = num1 + num2 + carry
- 3. 进位 carry = temp > 9 ? 1 : 0
- 4. 当前位 sum = temp % 10 + sum
- 5. 最终 sum = carry === '1' ? '1' + sum : sum

## 事件订阅 EventEmitter

链接: [2.EventEmitter.js](2.EventEmitter.js)

核心方法: on, emit, off, once

## 异步并发调度器

链接: [3.Scheduler](3.Scheduler.js)

思路:

- tasks 等待执行队列
- working 正在执行的
- 超过 并发数 则 push 进 tasks

## 柯里化

链接: [4.Curry](4.Curry.js)

## 防抖和节流

链接:

- [debounce](debounce.js)
- [throttle](throttle.js)

防抖 debounce: 单位时间后执行，如果重复触发，就重新开始计时
节流 throttle: 单位时间内只运行一次，在这段时间重复触发，只生效一次

## 深拷贝

代码: [deepClone](deepClone.js)

## 数组扁平化

代码: [Flatten](Flatten.js)

## call, apply, bind

1. 三者都可以改变函数的 `this` 指向.

2. `apply` 传数组，`call` 是参数列表；`bind` 参数可以分多次传入

3. `call` 和 `apply` 是直接执行函数, `bind` 是返回一个绑定 `this` 的函数

代码:

1. [call](call.js)
2. [apply](apply.js)
3. [bind](bind.js)

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
    window[data] = value // 把要定义的data挂载到window下，并赋值value
	let c=1
    Object.defineProperty(window, data, { 
        enumerable: true, // 可枚举
        configurable: false, // 可配置
        get: function () {
			return value
        },
        set: function (newVal) {
			if(c>=1) throw new TypeError('Assignment to constant variable')
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
// 相关地址：https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdouglascrockford%2FJSON-js%2Fblob%2Fmaster%2Fjson2.js%23L373
```
