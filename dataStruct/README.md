# DataStruct

- [栈](#栈)
- [堆](#堆)
- [队列](#队列)
- [链表](#链表)
  - [单向链表](#单向链表)
  - [双向链表](#双向链表)
- [数](#数)
  - [二叉树](#二叉树)
- [图](#图)
- [经典例题](#经典例题)
  - [数组和链表区别](#数组和链表区别)
  - [链表和数组，哪个实现队列更快](#链表和数组哪个实现队列更快)
  - [数组转成树](#数组转成树)

## 栈

stack 又名堆栈，它是一种只能在一端进行插入和删除操作的特殊线性表。

LIFO 后进先出，先进入的数据被压入栈底，最后的数据在栈顶，需要读数据的时候从栈顶开始弹出数据（最后一个数据被第一个读出来）。

## 堆

堆 指一种常见的树形结构，特殊的完全二叉树

根节点最大（或最小），同级节点左右没有大小顺序

## 队列

特殊的线性表，特殊之处在于它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作

因为队列只允许在一端插入，在另一端删除，所以只有最早进入队列的元素才能最先从队列中删除，
故队列又称为先进先出（FIFO — first in first out）线性表。

[ArrayQueue](./queue.js)

源码地址：[webpack/lib/util/ArrayQueue.js](https://github.com/webpack/webpack/blob/main/lib/util/ArrayQueue.js)

## 链表

- 存储有序元素集合，但链表中的元素在内存中并不连续设置。
- 每个元素由一个节点和一个指向下一个元素的引用。
- 修改元素时间复杂度 O(1)；适合元素频繁插入和删除场景。

类型：单链表，双链表，循环单链表

```js
class Node {
  constructor(key) {
      this.next = null;
      this.key = key;
      this.head = null
  }
}
```

### 单向链表

### 双向链表

## 数

### 二叉树

每个节点至多只有两个子树的结构，在父节点中有指向左右子树的指针

二叉树遍历:

- 先序遍历：根 - 左 - 左（尽头）- 右
- 中序遍历：左 - 根 - 右
- 后序遍历：左 - 右 - 根

查找二叉树：左子树的值小于根节点的值，右子树的值大于根节点的值。

平衡二叉树：左右子树高度差绝对值不超过 1

## 图

## 经典例题

### 数组和链表区别

| 数组                       | 链表                                   |
| -------------------------- | -------------------------------------- |
| 数组在内存中连续           | 链表不连续                             |
| 数组从栈上分配内存         | 链表从堆上分配内存                     |
| 可通过下标访问，访问效率高 | 访问效率低，访问某个元素，需要从头遍历 |

### 链表和数组，哪个实现队列更快

- 数组为连续存储， `push` 快， `shift` 慢
- 链表是非连续存储，`add` 和 `delete` 都快
- 结论：链表实现队列更快

```JS
// 从尾部 tail 入队，head 出队
// 因为单向链表, 无法找到 tail 前一个，所以从 tail 入队

class myQueue {
  private head = null
  private tail = null
  private len = 0

  add(n) {
    const newNode = {
      value: n,
      next: null
    }

    if(this.head === null) {
      this.head = newNode
    }

    if (this.tail) {
      this.tail.next = newNode
    }

    this.tail = newNode

    this.len++
  }

  delete() {
    if (this.head === null || this.length === 0) return null
    
    const val = this.head.value
    this.head = this.head.next

    this.len --

    return val
  }

  get length() {
    return this.len
  }
}
```

### 数组转成树

数据：

```js
const arr = [
  { id: 6, name: 'a', pId: 3 },
  { id: 2, name: 'a', pId: 1 },
  { id: 3, name: 'a', pId: 1 },
  { id: 4, name: 'a', pId: 2 },
  { id: 1, name: 'a', pId: 0 },
  { id: 5, name: 'a', pId: 3 },
]

// 转变成
{
  id: 1, pId: 0, name: 'a',
  child: [{ 
    id:2, pId: 1, name: 'a',
    child: [
      { id: 4, name: 'a', pId: 2 },
    ]
  }, {
    id: 3, pId: 1, name: 'a',
    child: [
      { id: 5, name: 'a', pId: 3 },
      { id: 6, name: 'a', pId: 3 },
    ]
  }]
}
```

```js
// 针对有序数组, pId 有序
function arrToTree(arr) {
  const map = new Map()
  let root = null

  for(let i in arr) {
    const node = arr[i]
    map.set(node.id, node)

    const parent = map.get(node.pId)
    if (parent) {
      if (!parent.child) parent.child = []
      parent.child.push(node)
    }

    if (!node.pId) {
      root = arr[i]
    }
  }
  return root
}
```

父级id 无序数组

```js
// 方法一
// 利用了对象引用类型，浅拷贝
// 缺点: 改变了 arr
function arrTranslateTree(arr) {
  let data = arr.filter(item => {
    item.children = arr.filter(e => {
      return item.id === e.pId
    })
    return !item.pId
  })
  return data
}

// 方法二
function arrToTree(arr) {
  let data = {}
  const res = []

  for(let i in arr) {
    data[arr[i].id] = arr[i]
  }
  arr.forEach(item => {
    if(data[item.pId]) {
      if (!data[item.pId].children) data[item.pId].children = []
      data[item.pId].children.push(item)
    } else {
      res.push(item)
    }
  })
  return res
}
```
