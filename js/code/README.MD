# 代码题

- [代码题](#代码题)
  - [大数相加](#大数相加)
  - [EventEmitter](#eventemitter)
  - [异步并发调度器](#异步并发调度器)
  - [柯里化](#柯里化)
  - [防抖和节流](#防抖和节流)
  - [深拷贝](#深拷贝)

## 大数相加

链接: [1.BigNumAdd.js](1.BigNumAdd.js)

- 1. 补 0
- 2. temp = num1 + num2 + carry
- 3. 进位 carry = temp > 9 ? 1 : 0
- 4. 当前位 sum = temp % 10 + sum
- 5. 最终 sum = carry === '1' ? '1' + sum : sum

## EventEmitter

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

[deepClone](deepClone.js)
