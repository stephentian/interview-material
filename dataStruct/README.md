# DataStruct

- [DataStruct](#datastruct)
  - [栈](#栈)
  - [队列](#队列)
  - [链表](#链表)
    - [单向链表](#单向链表)
    - [双向链表](#双向链表)
  - [数](#数)
    - [二叉树](#二叉树)
  - [图](#图)
  - [经典例题](#经典例题)
    - [链表和数组，哪个实现队列更快](#链表和数组哪个实现队列更快)

## 栈

## 队列

## 链表

### 单向链表

### 双向链表

## 数

### 二叉树

每个节点至多只有两个子树的结构，在父节点中有指向左右子树的指针

二叉树遍历:

- 先序遍历：根 - 左 - 右
- 中序遍历：左 - 根 - 右
- 后序遍历：左 - 右 - 根

查找二叉树：左子树的值小于根节点的值，右子树的值大于根节点的值。

平衡二叉树：左右子树高度差绝对值不超过 1

## 图

## 经典例题

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
