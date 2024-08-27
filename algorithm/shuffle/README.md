# shuffle 洗牌

> 洗牌算法，将数组随机排序

***待更新动画演示***

- [关于 sort](#关于-sort)
- [验证 sort 随机性](#验证-sort-随机性)
- [解决方案](#解决方案)
  - [1. 使用 Fisher–Yates shuffle](#1-使用-fisheryates-shuffle)
  - [2. 进阶方案](#2-进阶方案)

## 关于 sort

JavaScript 开发中有时会遇到要将一个数组随机排序（`shuffle`）的需求，一般采用 `array.sort` 方法，传入一个比较函数

```js
var arr = [1, 2, 3, 4, 5]
arr.sort(function() {
  return .5 - Math.random()
})

// ES6
arr.sort(() => .5 - Math.random())

```

这种写法看似都是随机，但其实**它不是真正的随机**

- v8 引擎实现的 `Array.prototype.sort` 方法对于短数组和长数组会使用不同的算法策略，短数组使用插入排序，长数组使用快速排序。
- ES 规范中规定排序比较函数 cmp(a, b) 对于相同的 a, b ，总是需要返回相同的比较结果，否则排序结果是不确定的。

## 验证 sort 随机性

见 [self-training](https://github.com/stephentian/daily-js/blob/master/09-Skills/01-shuffle/self-training.html)

## 解决方案

### 1. 使用 Fisher–Yates shuffle

`Lodash` 库中的 `shuffle` 算法, 使用的实际是 `Fisher–Yates` 洗牌算法

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

function shuffle(arr) {
  var i = arr.length,
      t,
      j;
  while(i) {
    // 在剩下的元素随机选择一位
    j = Math.floor(Math.random() * i--);
    t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr
}

// ES6
function shuffle(arr) {
  let i = arr.length
  while(i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]]
  }
  return arr
}

shuffle(arr)
```

### 2. 进阶方案

取自：[刘哇勇进阶方案](http://www.cnblogs.com/Wayou/p/fisher_yates_shuffle.html)

随机取数

如果要给每张洗牌， 最随机的方法是，在牌组里随机抽一张，放进另一个牌组，直到所有牌被抽出；
在代码里，在数组里随机抽取一个数（数组下标），放入一个空数组中，直到原数组所有元素都取掉。

```js
function shuffle(arr) {
  var copy = [],
      n = arr.length,
      i;
  while(n) {
    // 在数组里随机选取数组下标
    i = Math.floor(Math.random() * arr.length)
    if (i in arr) {
      copy.push(arr[i])
      delete arr[i]
      n--
    }
  }
  return copy
}
```

**注意：**

1. Math.random()产生 `[0,1)` 的小数
2. delete 操作只将数组元素的值删除，但不影响数组长度，删除后原来位置的值变为undefined

即使一个序号上的元素已经被处理过了，由于随机函数产生的数是随机的，所有这个被处理过的元素序号可能在之后的循环中不断出现，
一是效率问题，另一个就是逻辑问题了，存在一种可能是永远运行不完！
