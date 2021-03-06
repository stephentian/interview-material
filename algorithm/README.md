# Algorithm

- [Algorithm](#algorithm)
  - [基础知识](#基础知识)
  - [排序](#排序)
  - [二分查找](#二分查找)
  - [动态规划](#动态规划)
  - [排列组合](#排列组合)
  - [深度优先遍历](#深度优先遍历)
    - [200. 岛屿数量](#200-岛屿数量)
    - [257. 二叉树的所有路径](#257-二叉树的所有路径)
  - [广度优先搜索](#广度优先搜索)
  - [滑动窗口](#滑动窗口)
  - [栈](#栈)
  - [队列](#队列)
  - [链表](#链表)
    - [21.合并两个有序链表](#21合并两个有序链表)
  - [贪心算法](#贪心算法)
  - [回溯](#回溯)
  - [洗牌算法](#洗牌算法)
  - [LRU](#lru)
  - [经典例题](#经典例题)
    - [把一个数组旋转 K 步](#把一个数组旋转-k-步)
    - [24.交换链表节点](#24交换链表节点)
    - [N数之和](#n数之和)
    - [394.字符串解码](#394字符串解码)
    - [51.N皇后](#51n皇后)

## 基础知识

1. 时间复杂度，空间复杂度
2. 执行时间测试 `console.time()` 和 `console.timeEnd()`

## 排序

地址: [Sort](./sort/README.md)

## 二分查找

二分查找 (Binary Search)，也称折半查找。

要求:

- 线性表必须采用顺序存储结构（比如数组）
- 表中元素按关键字有序排列

思路：  

1. 从数组中间元素开始，如果是 目标，则返回该元素
2. 如果不是，利用中间元素分为前后两个子数组，
   1. 目标 小于中间元素，查找前一个数组
   2. 目标 大于中间元素，查找后一个数组
3. 重复以上动作，直到找到满足条件的元素。不满足则返回 -1

算法时间复杂度: O(log n)

```js
// 方法一 while 循环
function binary_search (arr , item){
  if (arr.length === 0) return -1;

  let low = 0
  let height = arr.length - 1
  while(low < height) {
    const mid = parseInt((height + low) / 2)

    if(arr[mid] == item){
      return mid
    }else if(arr[mid] > item){
      height = mid - 1
    }else{
      low = mid + 1
    }
  }
  return -1
}

// 方法二 递归
const binarySearch1 = function(
  arr,
  target,
  startIndex = 0,
  endIndex
) {
  if (arr.length === 0) return -1;
  if (!endIndex) endIndex = arr.length - 1;

  // 递归结束条件
  if (startIndex > endIndex) return -1;

  const midIndex = Math.floor((startIndex + endIndex) / 2);

  if (target < arr[midIndex]) {
    return binarySearch1(arr, target, startIndex, midIndex - 1);
  } else if (target > arr[midIndex]) {
    return binarySearch1(arr, target, midIndex + 1, endIndex);
  } else {
    return midIndex;
  }
};
```

## 动态规划

常见题目: 上楼梯, 斐波那契数列,

重点：**状态** 和 **状态转移方程**

例如：

一、打家劫舍

有一个非负整数数组，相邻的不能那，拿到里面的最大值。

```js
// nums [1, 2, 3, 1]
// 最大 4
// nums [2, 7, 9, 3, 1]
// 最大 12 (2, 9, 1)

// 状态： 
// 1. 去最后一个 nums[i] + dp[i - 2]
// 2. 不取最后一个 dp[i - 1]

// 转移方程:
// dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2])

function(nums) {
  if (nums == null || nums.length == 0) {
    return 0;
  }
  let length = nums.length;
  if (length == 1) {
    return nums[0];
  }
  let dp = []
  dp[0] = nums[0]
  dp[1] = nums[1] > nums[0] ? nums[1] : nums[0]
  
  for (let i = 2; i< length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2])
  }
  return dp[length - 1]
}
```

## 排列组合

排列组合例题，递归回溯法

例题：

一、组合-77

给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。

```js
const combine = function(n, k) {
  let res = []

  function helper(start, pre) {
    let len = pre.length
    if (len == k) {
      res.push(pre)
      return
    }

    // 还有 rest 个位置待填补
    let rest = k - prev.length
    for (let i = start; i < n; i++) {

      if (n - i + 1 < rest) {
        continue
      }
      helper(i+1, pre.concat(i))
    }
  }

  helper(1, [])
  return res
}
```

二、对象排列组合

```js
let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", "256g"]

function combine(...chunks) {
  let res = []

  let helper = function(chunkIndex, pre) {
    let chunk = chunks[chunkIndex]
    let isLast = chunkIndex === chunks.length - 1

    for (let val of chunk) {
      let cur = pre.concat(val)

      if (isLast) {
        res.push(cur)
      } else {
        helper(chunkIndex + 1, cur)
      }
    }
  }

  helper(0, [])
  return res
}

combine(names, colors, storages)
```

## 深度优先遍历

DFS Depth-First Search

- 利用栈特性, 先入后出, push, pop
- 以纵向的维度对 DOM 树进行遍历, 从最顶向左下遍历
- 直到所有子节点遍历完毕, 再返回遍历兄弟节点

比如遍历一个 DOM 结构, 从算法的角度

| 1       | 2   | 3      |
| :------ | --- | ------ |
| -       | div | -      |
| ui      | p   | button |
| li - li |
| a       |

```js
let tree =  {
  id: '1',
  title: 'div',
  children: [
    {
      id: '1-1',
      title: 'ul',
      children: [
        {
          id: '1-1-1',
          title: 'li',
          children: [
            {
              id: '1-1-1-1',
              title: 'a'
            }
          ]
        },
        {
          id: '1-1-2',
          title: 'li'
        }
      ]
    }, 
    {
      id: '1-2',
      title: 'p'
    },
    {
      id: '1-3',
      title: 'button'
    }
  ]
}
```

1. 递归版本

    ```js
    function dfs(node, nodeList = []) {
      if (node) {
        nodeList.push(node)
        if(node.children && node.children.length>0){
          const child = node.children
          for(let i = 0; i<child.length; i++) {
            dfs(child[i], nodeList)
          }
        }
      }
      return nodeList
    }
    // div ul li a li p button
    ```

2. 非递归版

    ```js
    function dfs(node) {
      let nodes = []

      if (node) {
        let stack = []
        stack.push(node)

        while(stack.length) {
          const item = stack.pop()
          const child = item.children
          
          nodes.push(item)
          if (child && child.length > 0) {
            for(let i = child.length - 1; i >= 0; i--) {
              stack.push(child[i])
            }
          }
        }
      }

      return nodes
    }
    ```

例题：

### 200. 岛屿数量

leetcode: [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

思路: 把当前为 1 的点变为 0, 并使用  dfs 查找出来上下左右的点 变为 0

```js
var numIslands = function(grid) {
    let res = 0
    const row = grid.length
    const col = grid[0].length

    function dfs(x, y) {
        grid[x][y] = 0
        if (x > 0 && grid[x - 1][y] === "1") dfs(x - 1, y)
        if (x < row -1 && grid[x + 1][y] === "1") dfs(x + 1, y)
        if (grid[x][y - 1] === "1") dfs(x, y - 1)
        if (grid[x][y + 1] === "1") dfs(x, y + 1)
    }
      
    for (let i = 0; i < row; i ++) {
        for (let j = 0; j < col; j++) {
            if (grid[i][j] === "1") {
                dfs(i, j)
                res ++
            }
        }
    }
    return res
};
```

### 257. 二叉树的所有路径

leetcode: [257. 二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

给定一个二叉树，返回所有从根节点到叶子节点的路径

```js

var binaryTreePaths = function(root) {
  const res = []
  const helper = (root, path) => {
    if (root) {
      path += root.val.toString()
      
      if (root.left === null && root.right === null) {
        res.push(path)
      } else {
        path += "->"
        helper(root.left, path)
        helper(root.right, path)
      }
    }
  }

  helper(root, "")
  return res
};
```

## 广度优先搜索

BFS Breath-First Search

- 维护一个 queue 队列, 先进先出 push, shift
- 在读取子节点的时候同时把发现的孙子节点 push 到队列中，但是先不处理，
- 等到这一轮队列中的子节点处理完成以后
- 下一轮再继续处理的就是孙子节点了，这就实现了层序遍历

1. 递归版本

    ```js
    function bfs(node, nodeList = []) {
      if (node) {
        nodeList.push(node)
        if(node.children && node.children.length>0){
          const child = node.children
          for(let i = 0; i<child.length; i++) {
            bfs(child[i], nodeList)
          }
        }
        while(node) {
          bfs()
          node.children
        }
      }
      return nodeList
    }

    ```

2. 非递归版

    ```js
    function bfs(node) {
      let nodes = []

      if (node) {
        let queue = []
        queue.unshift(node)

        while(queue.length) {
          const item = queue.shift()
          const child = item.children
          
          nodes.push(item)
          if (child && child.length > 0) {
            for(let i = 0; i < child.length; i++) {
              queue.push(child[i])
            }
          }
        }
      }

      return nodes
    }
    ```

例题：

一、[515. 在每个树行中找最大值](https://leetcode-cn.com/problems/find-largest-value-in-each-tree-row/)

```js
var largestValues = function(root) {
  if (!root) return []
  
  const res = []
  const queue = [root]

  while(queue.length) {
    const len = queue.length
    let cur = Number.MIN_SAFE_INTEGER

    for (let i = 0; i < len; i++) {
      // 取出当前 node
      const node = queue.shift()
      cur = Math.max(cur, node.val)

      node.left && queue.push(node.left)
      node.right && queue.push(node.right)
    }
    res.push(cur)
  }
  return res
}
```

## 滑动窗口

其实也是 双指针，left 和 right， 形成一个窗口

例题：

一、[3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

```js
var lengthOfLongestSubstring = function (s) {
  let left = 0
  let res = 0
  let map = new Map()

  for (let r = 0; r < s.length; r ++) {
    if (map.has(s[r]) && map.get(s[r]) >= left) {
      left = map.get(s[r]) + 1
    }
    res = Math.max(res, r - left + 1)
    map.set(s[r], r)
  }
  return res
}
```

## 栈

例题：

一、[20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

```js
var isValid = function(s) {
  const len = s.length
  if (len % 2 === 1) return false

  let map = {
    "}": "{",
    "]": "[",
    ")": "("
  }

  const stack = []

  for (let c of s) {
    if (map[c]) {
      if (!stack.length || stack[stack.length - 1] !== map[c]) {
        return false
      }
      stack.pop()
    } else {
      stack.push(c)
    }
  }

  return !stack.length
}

var isValid = function(s) {
    if(s.length%2 !== 0) return false
    let map =  {
        '(': ')',
        '{': '}',
        '[': ']'
    }
    let stack = [];
    
    for (let i = 0; i < s.length; i++) {
        let el = s[i];
        if (map[el]) {
            stack.push(map[el]);
        } else {
            if (el !== stack.pop()) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
```

## 队列

队列，先进先出的结构

例题：

一、[使用栈实现队列](https://leetcode-cn.com/problems/implement-queue-using-stacks/)

参考 `webpack` 源码 [ArrayQueue.js](https://github.com/webpack/webpack/blob/main/lib/util/ArrayQueue.js)

```js
var MyQueue = function() {
    this._stack1 = [];
    this._stack2 = [];
};

MyQueue.prototype.push = function(x) {
    this._stack1.push(x)
};

MyQueue.prototype.pop = function() {
    // if (this._stack2.length === 0) {
    //     this._stack2 = this._stack1
    //     this._stack2.reverse();
    //     this._stack1 = []
    // }
    // return this._stack2.pop()

    // 或者
    if (this._stack2.length === 0) {
      while(this._stack1.length) {
        this._stack2.push(this._stack1.pop())
      }
    }
    return this._stack2.pop()
};

MyQueue.prototype.peek = function() {
    if (this._stack2.length === 0) {
        return this._stack1[0];
    }
    return this._stack2[this._stack2.length - 1];
};

MyQueue.prototype.empty = function() {
    return !(this._stack1.length + this._stack2.length)
};
```

## 链表

类似数组，不过是无序存储结构

```js
function createLinkList(arr) {
  const len = arr.length
  if (!len) throw new Error('arr is empty')

  let node = {
    value: arr[len-1]
  }

  if (len === 1) return node

  for(let i = len -2; i >=0; i--) {
    node = {
      value: arr[i],
      next: node
    }
  }

  return node
}

// 反转链表
function reverseLinkList(head) {
  let preNode = null
  let curNode = head

  while(curNode) {
      let temp = curNode.next
      curNode.next = preNode
      preNode = curNode
      curNode = temp
  }

    return preNode
}
```

### 21.合并两个有序链表

leetcode: [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

```js
// 递归
var mergeTwoLists = function(list1, list2) {
  if (!list1) return list2
  if (!list2) return list1

  if (list1.val < list2.val) {
    list1.next = mergeTwoLists(list1.next, list2)
    return list1
  } else {
    list2.next = mergeTwoLists(list2.next, list1)
    return list2
  }
};

// 非递归
var mergeTwoLists = function(list1, list2) {
  let head = new ListNode()
  let cur = head // 中间变量
  while(list1 && list2) {
    if(list1.val <= list2.val) {
      cur.next = list1
      list1 = list1.next
    } else {
      cur.next = list2
      list2 = list2.next
    }
    cur = cur.next
  }
  
  cur.next = list1 !== null ? list1: list2
  return head.next
}
```

## 贪心算法

例题：

一、[455. 分发饼干](https://leetcode-cn.com/problems/assign-cookies/)

排序 + 贪心

```js
var findContentChildren = function(g, s) {
  let i = g.length, j = s.length - 1
  g.sort((a, b) => a - b)
  s.sort((a, b) => a - b)

  while(i--) {
    if (s[j] >= g[i]) {
      if (j-- === 0) break
    }
  }
  return s.length - j -1
}
```

## 回溯

- 遍历枚举出所有可能的选择。
- 依次尝试这些选择：作出一种选择，并往下递归。
- 如果这个选择产生不出正确的解，要撤销这个选择，回到之前的状态，并作出下一个可用的选择。

例题：

一、[51. N 皇后](#n%E7%9A%87%E5%90%8E)

## 洗牌算法

链接: [shuffle](./shuffle/README.md)

## LRU

最近最少使用 (least recently used)

LRU 在 Vue 的 keep-alive 中有使用

利用 Map 的 key 的有序性

```js
class LRUCache {
  constructor(n) {
    this.size = n
    this.data = new Map()
  }
  put(domain, info) {
    if(this.map.has(key)) this.map.delete(key)

    if(this.data.size >= this.size) {
      // 删除最不常用数据
      const firstKey= [...this.data.keys()][0]
      this.data.delete(firstKey)
    }
    this.data.set(domain, info)
  }
  get(domain) {
    if(!this.data.has(domain)) return -1

    const info = this.data.get(domain)
    this.data.delete(domain)
    this.data.set(domain, info)
    return info
  }
}
```

## 经典例题

### 把一个数组旋转 K 步

两种思路：

- 数组 `unshift` 数组 `pop` 值
- 数组分为两份，剪切数组尾部 k 个元素，放前面，`concat` 剩余的子数组

```js

```

### 24.交换链表节点

链接：[24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)

递归：

1. 终止条件：链表为空或只剩一个元素
2. 返回值：返回给上一层递归应该是已经交换好的子链表
3. 单次过程：head 和 next，next 接收上一级返回的子链表

```js
var swapPairs = function(head) {
  if (!head || !head.next) return head

  let next = head.next
  head.next = swapPairs(next.next)
  next.next = head

  return next
}
```

### N数之和

诀窍:

- 暴力法
- 排序 + 双指针(左右指针) + 去重

一、 **双数之和**

1. 暴力法

    ```js
    const twoSum = function (nums, target) {
      for (let i = 0; i < nums.length-1; i++) {
        for (let j = i+1; j <nums.length; j++) {
          if (nums[i] + nums[j] === target) {
            return [i, j]
          }
        }
      }
    }
    ```

2. 哈希表

    ```js
    const twoSum = function (nums, target) {
      let map = new Map()
      for(let i = 0, len = nums.lengths; i< len; i++) {
        if (map.has(target - nums[i])) {
          return [ map.get(target - nums[i]), i ]
        } else {
          map.set(nums[i], i)
        }
      }
      return []
    }
    ```

二、**三数之和**

地址: [3sum](https://leetcode-cn.com/problems/3sum/)

1. 暴力法, 3 个 `for` 循环
2. 排序 + 双指针

    ```js
    // 时间复杂度 O(n^2)
    // sort 排序可以做到 nlogn (nlogn < n^2)
    const threeSum = function(nums) {
      if (nums === null || nums.length < 3) return []
      let res = []
      const len = nums.length
      nums.sort((a, b) => a - b)

      for(let i = 0; i < len; i++) {
        if (nums[i] > 0) break; // 和为 0
        if (i>0 && nums[i] == nums[i-1]) continue // 去重

        let L = i + 1
        let R = len - 1
        while(L < R) {
          const sum = nums[i] + num[L] + nums[R]
          if(sum == 0) {
            res.push([nums[i], nums[L], nums[R]])
            while(L < R && nums[L] === nums[L+1]) L++  // 去重
            while(L < R && nums[R] === nums[R-1]) R--  // 去重
            L++;
            R--
          }
          else if (sum < 0) L++;
          else if (sum > 0) R--
        }
      }
      return res
    }
    ```

三、**四数之和**

leetcode: [4sum](https://leetcode-cn.com/problems/4sum/)

排序 + 双指针

```js
const fourSum = function(nums, target) {
  if (nums === null || nums.length < 4) return []
  let res = []
  let len = nums.length
  
  nums.sort((a, b) => a - b)

  for(let i = 0; i < len; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue
    for (let j = i + 1; j < len - 2; j++) {
      if (j > i + 1; nums[j] === nums[j-1]) continue

      let L = j + 1
      let R = len - 1
      while(L < R) {
        let sum = nums[i] + nums[j] + nums[L] + nums[R]
        if (sum === target) {
          res.push([nums[i], nums[j], nums[L], nums[R]])
          while(L < R && nums[L] === nums[L + 1]) L++
          while(L < R && nums[R] === nums[R - 1]) R--
          L++
          R-- 
        }
        else if (sum < target) L++
        else if (sum > target) R--
      }
    }
  }
  return res
}
```

四、**n 数之和**

```js
const nSum = function(nums, target) {
  const recursion = (index, N, temp) => {
    if (index === len || N < 3) return

    for(let i = index; i < len; i ++) {
      if (i > index && nums[i] === nums[i - 1]) continue

      if (N > 3) {
        recursion(i + 1, N - 1, [nums[i], ...temp])
        continue
      }

      // 3 数和
      let L = i + 1
      let R = len - 1
      while(L < R) {
        let sum = nums[i] + nums[L] + nums[R] + temp.reduce((x, y) => x + y)
        if (sum === target) {
          res.push([...temp, nums[i], nums[L], nums[R]])
          while(L < R && nums[L] === nums[L + 1]) L++
          while(L < R && nums[R] === nums[R - 1]) R--
          L++
          R-- 
        }
        else if (sum < target) L++
        else if (sum > target) R--
      }
    }
  }

  let res = []
  let len = nums.length
  nums.sort((a, b) => a - b)
  // 假如为 4 数之和, N = 4
  recursion(0, 4, [])
  return res
}
```

### 394.字符串解码

leetcode: [394. 字符串解码](https://leetcode-cn.com/problems/decode-string/)

```js
var decodeString = function(s) {
    let numStack = [];        // 存倍数的栈
    let strStack = [];        // 存 待拼接的str 的栈
    let num = 0;              // 倍数的“搬运工”
    let result = '';          // 字符串的“搬运工”
    for (const char of s) {   // 逐字符扫描
        if (!isNaN(char)) {   // 遇到数字
            num = num * 10 + Number(char); // 算出倍数
        } else if (char == '[') {  // 遇到 [
            strStack.push(result); // result串入栈
            result = '';           // 入栈后清零
            numStack.push(num);    // 倍数num进入栈等待
            num = 0;               // 入栈后清零
        } else if (char == ']') {  // 遇到 ]，两个栈的栈顶出栈
            let repeatTimes = numStack.pop(); // 获取拷贝次数
            result = strStack.pop() + result.repeat(repeatTimes); // 构建子串
        } else {                   
            result += char;        // 遇到字母，追加给result串
        }
    }
    return result;
};
```

### 51.N皇后

链接: [51. N 皇后](https://leetcode-cn.com/problems/n-queens/)

假设: row 为行数, col 为列数

对角线[左下 -> 右上]: row + col
对角线[左上 -> 右下]: row - col

不能同行，同列，同对角线

```js
var solveNQueens = function(n) {
  let res = [], 
    queens = [] // 皇后每行位置数组

  // 判断位置是否可以放置
  let canPlace = (queens, row, col) => {
    for (let i = 0; i < queens.length; i++) {
      // i 是行, queens[i] 是列
      // 不能同行，同列，同对角线
      if (queens[i] === col) return false
      if (i + queens[i] == row + col || i - queens[i] == row - col) return false
      // if (Math.abs(row - i) === Math.abs(col - queens[i])) return false
    }

    return true
  }

  let dfs = (res, queens, n, row) => {
    if (row === n) {
      return res.push(queens.map(s => '.'.repeat(s) + 'Q' + '.'.repeat(n-s-1)))
    }

    for (let col = 0; col < n; col++) {
      if (!canPlace(queens, row, col)) continue
      queens[row] = col
      dfs(res, queens, n, row + 1)

      // 清空数组
      queens.splice(row, 1)
    }
  }

  dfs(res, queens, n, 0)
  return res
}
```
