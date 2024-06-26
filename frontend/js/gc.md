# 垃圾回收

> garbage colletion

- [何为垃圾](#何为垃圾)
- [如何认定垃圾变量](#如何认定垃圾变量)
- [垃圾回收算法](#垃圾回收算法)
  - [1. 标记清除算法](#1-标记清除算法)
    - [碎片空间](#碎片空间)
  - [2. 标记压缩算法](#2-标记压缩算法)
  - [3. 引用计数算法](#3-引用计数算法)
  - [4. 增量标记算法](#4-增量标记算法)
- [JS 垃圾回收是什么？](#js-垃圾回收是什么)

## 何为垃圾

不再使用，不被程序任何部分引用到的内存空间。

## 如何认定垃圾变量

通过 “可达性分析（Reachability Analysis）” 来判定。就是这个变量或者对象是否可达到，可用到。

1. **所有全局变量**，都不是垃圾。

2. 局部变量，使用完就是垃圾。

**所有的变量，都有生命周期** 局部变量在函数使用完时，变量就被回收了。

## 垃圾回收算法

### 1. 标记清除算法

标记清除（Mark-and-Sweep）算法是垃圾回收（Garbage Collection, GC）领域中一种基础且广泛使用的策略，用于自动管理内存，尤其是适用于像JavaScript这样的高级编程语言。它的核心思想是通过两个阶段来识别并回收不再使用的内存空间：

1. 标记阶段：从根对象（全局对象）开始遍历，遍历所有可达对象，将他们标记为 “已访问”。
2. 清除阶段：遍历完所有对象后，对未标记的对象进行清除。

**优点：**
  
- 快速，不需要额外的内存空间。

**缺点：**
  
- 标记清除回收后，内存空间会触发不连续状态（碎片空间）。

#### 碎片空间

“碎片空间” 在标记清除算法的上下文中，指的是由于清除操作后留下的不连续的、小块的空闲内存区域

可以想象成家里的储物柜或衣柜里散落的空隙。想象你有一排储物柜用来放各种大小不一的盒子（代表内存中的对象）。最初，这些盒子整齐地排列，每个盒子占据一定的空间，中间没有空隙。

但随着时间推移，你不断地取出一些盒子（代表不再需要的对象被垃圾回收器标记并清除），留下了一些空出来的位置。同时，你也不断放入新的盒子（代表新创建的对象）。由于新盒子不一定正好能填满之前盒子留下的空位，久而久之，储物柜里就会出现许多不连续的小空隙，这些小空隙就像是内存中的“碎片空间”。

这些碎片空间虽然加起来可能很大，但由于它们不连续，当你后来需要存放一个大盒子（一个需要大块连续内存的对象）时，即便碎片空间的总和足够大，也可能因为没有一块足够大的连续空间而无法存放，这就造成了空间利用率的下降，因为你有可用的空间却不能有效利用。

### 2. 标记压缩算法

标记压缩（Mark-Compact）算法是对标记清除算法的一种改进，旨在解决后者可能导致的内存碎片问题。该算法同样分为两个主要步骤：标记和压缩，但增加了额外的步骤来整理内存，减少碎片化。

1. 标记阶段：与标记清除算法相同。标记所有可达的对象。
2. 压缩阶段：将标记为“已访问”的对象移动到连续的内存空间中，同时删除未标记的对象。
3. 清除阶段：在所有存活对象被压缩到一起后，剩下的未被标记的区域被视为连续的空闲内存，可以直接被后续的新对象分配使用，而不需要进行碎片整理。

### 3. 引用计数算法

最初级的垃圾收集算法。

引用计数（Reference Counting）是一种简单的垃圾回收算法，它为每个对象维护一个计数器，用来记录当前有多少个引用指向该对象。

当一个对象被创建时，其引用计数初始化为1；每当有一个新的引用指向该对象时，计数器加1；当引用被删除或失效时，计数器减1。当一个对象的引用计数降为0时，表明没有变量引用该对象，此时该对象被视为垃圾，可以被回收。

优点：实时性好，一旦对象的引用计数为0，立即回收，不会产生延迟。
缺点：无法解决 “循环引用” 问题。每次引用关系改变都需要维护计数器，有一定的性能开销。

### 4. 增量标记算法

增量标记（Incremental Marking）算法是对传统的标记清除或标记压缩算法的一种优化，主要用于解决长时间停顿问题。

在大型应用程序中，一次性完成整个堆的标记工作可能会导致程序暂停执行较长时间，影响用户体验。增量标记算法通过将标记过程分割成多个小步骤，穿插在程序的执行过程中进行，从而减少单次暂停的时间，提高响应速度。

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
