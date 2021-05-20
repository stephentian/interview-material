# 代码

## 目录

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

链接: [3.Scheduler]

思路:

- tasks 等待执行队列
- working 正在执行的
- 超过 并发数 则 push 进 tasks