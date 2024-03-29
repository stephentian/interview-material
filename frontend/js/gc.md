# 垃圾回收

> garbage colletion

- [何为垃圾](#何为垃圾)
- [如何认定垃圾变量](#如何认定垃圾变量)
- [垃圾回收算法](#垃圾回收算法)
  - [1. 标记清除算法](#1-标记清除算法)
  - [2. 标记压缩算法](#2-标记压缩算法)
  - [3. 引用计数算法](#3-引用计数算法)
  - [4. 增量标记算法](#4-增量标记算法)
- [JS 垃圾回收是什么？](#js-垃圾回收是什么)

## 何为垃圾

不再需要的东西，比如说不再使用的代码。

## 如何认定垃圾变量

**所有全局变量**，都不是垃圾。

局部变量，使用完就是垃圾。

**所有的变量，都有生命周期**。
局部变量在函数使用完时，变量就被回收了。

## 垃圾回收算法

### 1. 标记清除算法

从 `global` 全局开始，找每一个引用变量，如果有引用，则标记为 不可回收。
然后遍历上一步找到的 不可回收 变量， 将变量引用的 “局部” 变量标记为 不可回收。
重复上一步，直至全部标记完。其他没有标记的变量清除。

### 2. 标记压缩算法

### 3. 引用计数算法

无法解决 “循环引用” 问题

### 4. 增量标记算法

**缺点：**
变量多了耗时多

## JS 垃圾回收是什么？

1. 回答什么是垃圾(变量)
  没有被引用的对象，即为垃圾；即使被引用，但是可能和其他变量形成 “环” 的，也是垃圾
2. 浏览器如何回收垃圾
  标记扫除法，
  从全局标记，然后局部标记
3. 前端特殊性
  可能 DOM 里面引用了 变量
  *IE 里要主动删除函数
