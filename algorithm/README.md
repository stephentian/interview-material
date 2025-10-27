# Algorithm

- [基础知识](#基础知识)
- [排序](#排序)
- [二分查找](#二分查找)
  - [35.搜索插入位置](#35搜索插入位置)
  - [69.x 的平方根](#69x-的平方根)
- [动态规划](#动态规划)
- [排列组合](#排列组合)
  - [77.组合](#77组合)
  - [SKU 对象排列组合](#sku-对象排列组合)
- [双指针](#双指针)
  - [415.字符串相加](#415字符串相加)
  - [75. 颜色分类](#75-颜色分类)
- [滑动窗口](#滑动窗口)
  - [3.无重复字符的最长子串](#3无重复字符的最长子串)
- [栈](#栈)
  - [20.有效的括号](#20有效的括号)
  - [单调栈](#单调栈)
    - [503. 下一个更大元素 II](#503-下一个更大元素-ii)
- [树](#树)
  - [DFS 深度优先遍历](#dfs-深度优先遍历)
    - [200.岛屿数量](#200岛屿数量)
    - [257.二叉树的所有路径](#257二叉树的所有路径)
    - [104.二叉树的最大深度](#104二叉树的最大深度)
  - [BFS 广度优先遍历](#bfs-广度优先遍历)
    - [515. 在每个树行中找最大值](#515-在每个树行中找最大值)
    - [94.二叉树的中序遍历](#94二叉树的中序遍历)
  - [226.翻转二叉树](#226翻转二叉树)
- [队列](#队列)
- [链表](#链表)
  - [206.反转链表](#206反转链表)
  - [21.合并两个有序链表](#21合并两个有序链表)
  - [141.环形链表](#141环形链表)
  - [160.相交链表](#160相交链表)
  - [234.回文链表](#234回文链表)
- [贪心算法](#贪心算法)
  - [121.买卖股票的最佳时机](#121买卖股票的最佳时机)
  - [455.分发饼干](#455分发饼干)
- [回溯](#回溯)
- [洗牌算法](#洗牌算法)
- [LRU](#lru)
- [位运算](#位运算)
  - [位运算应用](#位运算应用)
  - [169.多数元素](#169多数元素)
  - [136.只出现一次的数字](#136只出现一次的数字)
- [经典例题](#经典例题)
  - [把一个数组旋转 K 步](#把一个数组旋转-k-步)
  - [24.交换链表节点](#24交换链表节点)
  - [N 数之和](#n-数之和)
    - [15.三数之和](#15三数之和)
  - [394.字符串解码](#394字符串解码)
  - [51.N 皇后](#51n-皇后)
  - [165.比较版本号](#165比较版本号)
  - [403.青蛙过河](#403青蛙过河)
  - [剑指 Offer 22.链表中倒数第k个节点](#剑指-offer-22链表中倒数第k个节点)
  - [122.买卖股票的最佳时机 II](#122买卖股票的最佳时机-ii)
  - [67.二进制求和](#67二进制求和)
  - [300. 最长递增子序列](#300-最长递增子序列)

## 基础知识

1. 时间复杂度，空间复杂度
2. 执行时间测试 `console.time()` 和 `console.timeEnd()`

![时间复杂度图](./algorithm-time.png)

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

### 35.搜索插入位置

[35.搜索插入位置](https://leetcode.cn/problems/search-insert-position/)

题目：给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 `O(log n)` 的算法。

示例 1:

输入: nums = [1,3,5,6], target = 5
输出: 2

输入: nums = [1,3,5,6], target = 2
输出: 1

输入: nums = [1,3,5,6], target = 7
输出: 4

```js
var searchInsert = function(nums, target) {
    let len = nums.length
    let left = 0, right = len - 1, ans = len

    while(left <= right) {
        let mid = left + Math.ceil((right - left)/2)

        if (target <= nums[mid]) {
          ans = mid
          right = mid - 1
        } else {
          left = mid + 1
        }
    }
    return ans
};
```

### 69.x 的平方根

[69. x 的平方根](https://leetcode.cn/problems/sqrtx/description/)

给你一个非负整数 x ，计算并返回 `x` 的 算术平方根。
由于返回类型是整数，结果只保留整数部分 ，小数部分将被舍去。
示例 1：
输入：x = 4
输出：2

示例 2：
输入：`x = 8`
输出：2
解释：8 的算术平方根是 `2.82842...`, 由于返回类型是整数，小数部分将被舍去。

```js
// 一
var mySqrt = function(x) {
    if (x < 2) return x

    let l = 1, r = x

    while (l <= r) {
        let mid = Math.floor(l + r)/2)

        if (mid * mid === x) return mid

        if (mid * mid < x) {
            l = mid + 1
            if (l * l > x) return mid
        } else {
            r = mid - 1
        }
    }
};

// 二
// var mySqrt = function(x) {
//   if (x < 2) return x
//   let left = 2, mid, right = Math.floor(x / 2);
//   while (left <= right) {
//     mid = Math.floor(left + (right - left) / 2)
//     if (mid * mid === x) return mid
//     if (mid * mid < x) {
//         left = mid + 1
//     }else {
//         right = mid - 1
//     }
//   }
//   return right
// };
```

## 动态规划

[dynamic program](./dp/README.md)

## 排列组合

排列组合例题，递归回溯法

### 77.组合

[77. 组合](https://leetcode.cn/problems/combinations/)

给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。

示例：

输入：n = 4, k = 2
输出：
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]

输入：n = 1, k = 1
输出：[[1]]

思想：

1. 直接方法是 for 循环，k 层循环。
2. 第二个方法是 回溯
   1. 将问题抽象为 树形结构（N叉树）
   2. n 为树的宽度，k 为树的深度
   3. 把到达 子叶点的结果收集起来，求得 组合集合

code: [combination.js](./combinations.js)

```js
const combine = function(n, k) {
  let res = []

  // 递归方法
  function helper(start, path) { // start 是当前选择的数字起点 path 是当前构建的组合
    if (path.length === k) {
      res.push(path.slice()) // 拷贝一份 path，避免后续操作影响已保存的结果
      return
    }

    // 从 start 到 n 枚举每个数字
    for (let i = start; i <= n; i++) {
      path.push(i) // 将当前数字 i 加入 path
      helper(i + 1, path) // 递归调用 helper，传入 i+1 作为新的起点（确保不重复选择同一个数字） 
      path.pop() // 撤销选择
    }
  }

  helper(1, [])
  return res
}
```

1. 调用 helper(1, [])

2. i=1: path=[1]
   - 调用 helper(2, [1])
   - i=2: path=[1,2]
     - 调用 helper(3, [1,2])
     - i=3: path=[1,2,3]，长度达到k，保存结果[[1,2,3]]，返回
     - 执行 path.pop()，path变为[1,2]
     - i=4: path=[1,2,4]，长度达到k，保存结果[[1,2,3], [1,2,4]]，返回
     - 执行 path.pop()，path变为[1,2]
     - i=5: path=[1,2,5]，长度达到k，保存结果[[1,2,3], [1,2,4], [1,2,5]]，返回
     - 执行 path.pop()，path变为[1]
     - helper(2, [1])执行完毕，返回到第一层
   - 执行 path.pop()，path变为[]
   - 关键点在这里：现在 i=1 的循环结束，开始 i=2 的循环

3. i=2: path=[2]
   - 调用 helper(3, [2])
   - i=3: path=[2,3]
     - 调用 helper(4, [2,3])
     - i=4: path=[2,3,4]，长度达到k，保存结果，返回
     - 执行 path.pop()，path变为[2,3]
     - i=5: path=[2,3,5]，长度达到k，保存结果，返回
     - 执行 path.pop()，path变为[2]
     - helper(3, [2])执行完毕，返回到第一层
   - 执行 path.pop()，path变为[]

所以，每当 helper(i + 1, path) 执行完成后，都会执行 path.pop() 来撤销选择，然后继续循环尝试下一个数字。这就是回溯算法的核心机制——在递归调用之后撤销之前的选择，使得我们可以探索其他的可能性。

因此，在获取了 [1,2,3]、[1,2,4]、[1,2,5] 之后，会通过两次 path.pop() 操作回到 path=[1]，然后再执行 path.pop() 回到 path=[]，接着外层循环继续 i=2，从而能够得到包含 [2,x,y] 的组合。

方法二

```js
var combine = function(n, k) {
  let result = []
  let path = []

  const combineHelper  = (n, k, startIndex) => {
    if (path.length === k) {
      result.push([...path])
      return
    }

    for (let i = startIndex; i<= n - (k-path.length) + 1; i++) {
      path.push(i)
      combineHelper(n, k, i+1)
      path.pop()
    }
  }

  combineHelper(n, k, 1)
  return result
}
```

### SKU 对象排列组合

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
      // push 的返回值是数组长度
      // concat 的返回值是合并后的数组，所以用 concat
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

## 双指针

### 415.字符串相加

[415.字符串相加](https://leetcode.cn/problems/add-strings/)

给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。

你不能使用任何內建的用于处理大整数的库（比如 BigInteger）， 也不能直接将输入的字符串转换为整数形式。

示例：
输入：num1 = "11", num2 = "123"
输出："134"

输入：num1 = "456", num2 = "77"
输出："533"

输入：num1 = "0", num2 = "0"
输出："0"

```js
// 模拟加法
// 从两个数最低位开始： i, j 指向 num1, num2 尾部
// 相加计算是否进位： add 为上一步超出 10 的部分， add = res%10
// 添加当前位：对位数较短的数字进行 补零操作
var addStrings = function(num1, num2) {
    let i = num1.length - 1
    let j = num2.length - 1
    let add = 0
    const ans = []
    
    while (i >= 0 || j >= 0 || add != 0) {
        const x = i >= 0 ? num1.charAt(i) - '0' : 0;
        const y = j >= 0 ? num2.charAt(j) - '0' : 0;

        const result = x + y + add;
        ans.push(result % 10);

        // add = Math.floor(result / 10);
        add = result >= 10 ? 1 : 0;

        i--;
        j--;
    }

    return ans.reverse().join(''); // 前面把最后位 push ，所以需要 reverse
};
```

### 75. 颜色分类

[75.颜色分类](https://leetcode.cn/problems/sort-colors/description/)

给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

必须在不使用库内置的 sort 函数的情况下解决这个问题。

示例；

输入：nums = [2,0,2,1,1,0]
输出：[0,0,1,1,2,2]

示例 2：

输入：nums = [2,0,1]
输出：[0,1,2]

思路：

1. 创建三个指针，l, r, cur
2. l 指向下一个0应该放置的位置，初始为0；cur 当前遍历位置，初始为0； r 指向下一个2应该放置的位置，初始为数组末尾
3. 循环判断当前元素，如果为0，则交换到左边，如果为2，则交换到右边，如果为1，则继续循环

- [0, l) 区间内都是0
- [l, cur) 区间内都是1
- (r, nums.length - 1] 区间内都是2

```js
// 时间复杂度：O(n)
// 空间复杂度: O(1)
var sortColors = function(nums) {
  let l = 0, cur = 0, r = nums.length - 1
  while (cur <= r) {
    if (nums[cur] === 0) {
      const temp = nums[l]
      nums[l] = nums[cur]
      nums[cur] = temp
      l++
      cur++
    } else if (nums[cur] === 2) {
      const temp = nums[r]
      nums[r] = nums[cur]
      nums[cur] = temp
      r-- // 减 r，因为 r 指向的元素已经交换到左边了
      // cur 保持不变，因为从 r 位置交换过来的元素可能是0、1或2，需要进一步判断
    } else {
      cur++
    }
  }
  return nums
}
```

## 滑动窗口

其实也是 双指针，left 和 right， 形成一个窗口

### 3.无重复字符的最长子串

地址：[3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串的长度。

示例：

输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串

```js
var lengthOfLongestSubstring = function (s) {
  let left = 0
  let res = 0
  let map = new Map()

  for (let r = 0; r < s.length; r++) {
    // map.has(s[r]) 检查字符是否出现过
    // map.get(s[r]) >= left 确保重复字符在当前窗口内（而不是历史窗口中）
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

### 20.有效的括号

地址：[20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。

示例：

输入：s = "()"
输出：true

输入：s = "()[]{}"
输出：true

输入：s = "(]"
输出：false

输入：s = "([])"
输出：true

```js
// shift unshift
var isValid = function(s) {
    if (s && s.length%2 === 1) return false

    const valMap = {
        '(': ')',
        '[': ']',
        '{': '}'
    }

    const stack = []

    for (let i = 0; i<s.length; i++) {
        if (stack[0] && stack[0] === s[i]) {
            stack.shift()
        } else {
            stack.unshift(valMap[s[i]])
        }
    }

    return (stack.length === 0)
};

var isValid = function(s) {
    if (!s || s.length < 2) return false
    
    let stack = []
    const map = {
        "}": "{",
        "]": "[",
        ")": "("
    }

    for (let i of s) {
        let len = stack.length
        if (map[i]) {
            if (!len || stack[len - 1] !== map[i]) return false

            stack.pop()
        } else {
            stack.push(i)
        }
    }

    return !stack.length
};

// pop push
var isValid = function(s) {
    if(s.length%2 !== 0) return false
    const map =  {
        '(': ')',
        '{': '}',
        '[': ']'
    }
    const stack = [];
    
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

const isValid = (s) => {
  if (s && s.length % 2 !== 0) return false

  const stack = []
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  }

  for (let i of s) {
    if (map[i]) {
      stack.push(map[i])
    } else {
      if (stack.length === 0 || stack.pop() !== i) return false
    }
  }

  return stack.length === 0
}
```

### 单调栈

单调栈是一种特殊的栈结构，其中的元素保持单调性（递增或递减）。

单调栈的核心思想是：

- 维护一个单调序列（在这里是递减的）
- 当遇到一个"破坏"单调性的元素时，我们就找到了之前某些元素的"下一个更大元素"
- 通过这种方式，每个元素只会入栈和出栈一次，所以时间复杂度是O(n)

**生活中的单调栈例子：观光塔排队**

想象一下，你和朋友们去参观一个城市，这个城市有很多不同高度的观光塔，排列成一行。你们从左到右依次经过这些塔，想要知道每座塔右侧第一座比它高的塔是哪座。

场景设定：

- 有5座观光塔，高度分别为：[3, 7, 1, 5, 4]
- 你们从左往右走，经过每一座塔
- 每个人都想知道："我右侧第一座比我高的塔是哪座？"

使用单调栈的思维过程：

1. **小明**先看到第一座塔（高度3）：
   - 他不知道右边有没有更高的塔，所以先记下这座塔
   - 目前记录：[3号塔]

2. **小红**看到第二座塔（高度7）：
   - 她发现7比之前记录的3高，这意味着3号塔找到了答案（右侧第一座更高的塔是7号塔）
   - 小红记下7号塔，同时擦掉3号塔的记录（因为3号塔已经有答案了）
   - 目前记录：[7号塔]

3. **小刚**看到第三座塔（高度1）：
   - 1比7小，所以不能给7号塔提供答案
   - 小刚把1号塔也记下来
   - 目前记录：[7号塔, 1号塔]

4. **小李**看到第四座塔（高度5）：
   - 5比1大，所以1号塔找到了答案（右侧第一座更高的塔是5号塔）
   - 小李擦掉1号塔的记录
   - 但5比7小，所以7号塔还没找到答案
   - 小李把5号塔也记下来
   - 目前记录：[7号塔, 5号塔]

5. **小王**看到第五座塔（高度4）：
   - 4比5小，不能给5号塔提供答案
   - 小王把4号塔也记下来
   - 目前记录：[7号塔, 5号塔, 4号塔]

6. 游览结束：
   - 7号塔：始终没人能给它提供答案，说明它右侧没有更高的塔
   - 5号塔和4号塔：也始终没人能给它们提供答案，说明它们右侧也没有更高的塔

为什么是"单调递减"？

注意我们记录的塔的高度：[7, 5, 4]，从左到右是递减的。这就是"单调递减"的含义：

- 栈底是目前遇到的最高的塔（7）
- 往栈顶方向，塔的高度越来越低（5, 4）
- 这样排列的好处是：当遇到新塔时，我们只需要和栈顶比较，就能快速判断是否能为栈中元素提供答案

为什么要用单调栈？

如果用暴力法，每座塔都要向右遍历查找第一座更高的塔：

- 3号塔要和[7,1,5,4]比较
- 7号塔要和[1,5,4]比较
- 1号塔要和[5,4]比较
- 5号塔要和[4]比较
- 4号塔要和[]比较

这样时间复杂度是O(n²)。

而使用单调栈，每个塔最多只会入栈一次、出栈一次，所以时间复杂度是O(n)。

**如何判断使用单调栈？**

当你遇到这类问题时可以考虑使用单调栈：

1. 需要为数组中的每个元素找到"下一个更大/更小元素"
2. 问题具有某种"传递性"：如果A比B大，B比C大，那么A也比C大
3. 有明显的"淘汰"关系：一旦找到了答案，就不需要再考虑了

单调栈的核心思想就是"延迟处理"和"批量处理"：先把问题记录下来，等遇到能解决它们的元素时再一并处理。

参考: [单调栈](./monotonicStackDemo.js)

#### 503. 下一个更大元素 II

地址：[503. 下一个更大元素 II](https://leetcode-cn.com/problems/next-greater-element-ii/)

给定一个循环数组 nums（`nums[nums.length - 1]` 的下一个元素是 `nums[0]` ），返回 nums 中每个元素的 下一个更大元素 。

数字 x 的 下一个更大的元素 是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1 。

示例 1：
输入：nums = [1,2,1]
输出：[2,-1,2]
解释: 第一个 1 的下一个更大的数是 2；
数字 2 找不到下一个更大的数；
第二个 1 的下一个最大的数需要循环搜索，结果也是 2。

示例 2：
输入：nums = [1,2,3,4,3]
输出：[2,3,4,-1,4]

```js
// 暴力法
// 时间复杂度：O(n^2)
// 空间复杂度: O(1)

// 从 i+1 开始，找到第一个大于 nums[i] 的数
// 因为是循环数组，所以找到结尾没找到的话，再从 0 到 i-1 找一遍
var nextGreaterElements = function(nums) {
  const len = nums.length
  const res = new Array(len).fill(-1)

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len + i; j++) {
      if (nums[j % len] > nums[i]) {
        res[i] = nums[j % len]
        break
      }
    }
  }
  return res
};

// 单调栈
// 时间复杂度：O(n)
// 空间复杂度: O(n)
// 思路：
// 将数组"拉直"，即遍历两遍数组，通过 i % len 来获取实际的元素索引。
// 对于每个元素，检查它是否比栈顶索引对应的元素大
// 如果是，则将栈顶索引对应的元素出栈，并更新结果数组。
// 栈中存储的是索引，不是值
// 重复这个过程直到栈为空或当前元素不大于栈顶元素
// 循环结束后，结果数组中每个元素都对应了它下一个更大元素的索引。
var nextGreaterElements = function(nums) {
  const len = nums.length
  const res = new Array(len).fill(-1)
  const stack = []

  // 每个位置i都需要从i+1遍历到i-1的位置，在这个区间内找到下一个更大的值
  for (let i = 0; i < len * 2- 1; i++) {
    let num = nums[i % len]
    // 将所有大于nums[i]的数都弹出
    while (stack.length) {
      if(num > nums[stack[stack.length - 1] % len]) {
        res[stack.pop() % len] = num
      }      
    }
    stack.push(i)
  }
  return res
}

var nextGreaterElements = function(nums) {
  const len = nums.length
  const res = new Array(len).fill(-1)
  // 栈中存储的是索引，不是值
  const stack = []

  for (let i = 0; i < len*2 - 1; i++) {
    // 将所有大于 nums[i] 的数弹出
    // 弹出的下标对应的是下一个更大的数 nums[i]
    while (stack.length > 0 && nums[i % len] > nums[stack[stack.length - 1] % len]) {
      res[(stack.pop() % len)] = nums[i % len]
    }
    stack.push(i)
  }

  return res
}
```

代码：[nextBiggerNum.js](./nextBiggerNum.js)

## 树

二叉树，非线性数据结构；根节点，表示最顶层节点；叶节点，表示没有子节点的节点；

深度：从根节点开始，沿着树的路径，逐层向下递增，直到到达叶节点；

前序、中序、后序都属于 深度优先遍历；先走到叶子节点，再回溯；

二叉树的遍历：

- 前序遍历：根左右；根节点、左子树、右子树
- 中序遍历：左根右；左子树、根节点、右子树
- 后序遍历：左右根；左子树、右子树、根节点

```js
class TreeNode {
  constructor(val) {
    this.val = val || 0
    this.left = null
    this.right = null
  }
}

// 插入和删除节点
let node = new TreeNode(1)
let n1 = new TreeNode(2)
let n2 = new TreeNode(3)
// n1 和 n2 中间插入 node
n1.left = node
node.left = n2;
n1.left = n2;

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  // 插入节点
  insert(val) {
    let node = new TreeNode(val)

    if (!this.root) {
      this.root = node
      return
    }

    let cur = this.root
    while (cur) {
      if (val < cur.val) {
        if (!cur.left) {  
          cur.left = node
          return
        }
        cur = cur.left
      } else {
        if (!cur.right) {
          cur.right = node
          return
        }
        cur = cur.right
      }
    }
  }

  find(val) {
    if (!this.root) return null

    let cur = this.root

    while (cur) {
      if (val === cur.val) return cur

      if (val < cur.val) {
        cur = cur.left
      } else {
        cur = cur.right
      }
    }

    return null
  }
}

```

### DFS 深度优先遍历

`DFS Depth-First Search`

- 利用栈特性, 先入后出, push, pop
- 以纵向的维度对 DOM 树进行遍历, 从最顶向左下遍历
- 直到所有子节点遍历完毕, 再返回遍历兄弟节点

比如遍历一个 DOM 结构, 从算法的角度

| 1       | 2   | 3      |
| :------ | --- | ------ |
| -       | div | -      |
| ui      | p   | button |
| li - li | - | - |
| a       | - | - |

```js
// DOM 树
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
      if (!node) throw new Error('Invalid node object')

      nodeList.push(node)

      if (node.children && node.children.length > 0) {
        const child = node.children
        for(let i = 0; i<child.length; i++) {
          dfs(child[i], nodeList)
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

        // 当栈不为空时，继续搜索
        while(stack.length) {
          const item = stack.pop()
          nodes.push(item)
          
          const child = item.children
          // 提前检查子节点是否存在，避免不必要的操作
          if (child && child.length > 0) {
            // 倒序遍历，保证先遍历子节点
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

#### 200.岛屿数量

leetcode: [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

示例:

```bash
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1

输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
```

图遍历问题，使用深度优先搜索（DFS）或者广度优先搜索（BFS）解决

思路：

1. 遍历整个网络
2. 消灭岛屿
   - 发现陆地（1），就从这个点开始 DFS 或 BFS 搜索
   - 把与这个陆地相连的陆地标记为已访问（把 1 变为 0, 并使用 dfs 搜索出来上下左右的点变为 0）
3. 计数
   1. 每次发现新岛屿，计数+1
4. 继续便利剩余的点

具体实现：

1. 初始化计数器为0, 行 row, 列 col
2. 遍历网格的每个位置(i,j)
3. 如果`grid[i][j]` 是'1'：
   1. 计数器加1
   2. 从(i,j)开始进行DFS，将所有相连的'1'都改为'0'(上下左右)
4. 返回计数器的值

时间复杂度：O(M*N)

```js
var numIslands = function(grid) {
    let res = 0
    const row = grid.length // 行
    const col = grid[0].length // 列

    function dfs(x, y) {
        grid[x][y] = 0
        if (x > 0 && grid[x - 1][y] === "1") dfs(x - 1, y) // 上
        if (x < row -1 && grid[x + 1][y] === "1") dfs(x + 1, y) // 下
        if (y > 0 && grid[x][y - 1] === "1") dfs(x, y - 1) // 左
        if (y < col - 1 && grid[x][y + 1] === "1") dfs(x, y + 1) // 右
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

#### 257.二叉树的所有路径

leetcode: [257. 二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

给你一个二叉树的根节点 root，按 任意顺序 ，返回所有从根节点到叶子节点的路径。

叶子节点 是指没有子节点的节点。

示例：

输入：root = [1,2,3,null,5]
输出：["1->2->5","1->3"]

输入：root = [1]
输出：["1"]

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

#### 104.二叉树的最大深度

[104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

给定一个二叉树 root ，返回其最大深度。

二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。

示例:

输入：root = [3,9,20,null,null,15,7]
输出：3

输入：root = [1,null,2]
输出：2

```js
// DFS
// 深度遍历
var maxDepth = function(root) {
  if (!root) return 0

  const left = maxDepth(root.left)
  const right = maxDepth(root.right)

  return Math.max(left, right) + 1
};
```

### BFS 广度优先遍历

广度优先遍历 `breadth-first search`，一行一行遍历，借助 “队列”实现，队列 “先进先出”，遍历则 “逐层推进”

BFS Breath-First Search

- 维护一个 queue 队列, 先进先出 push, shift
- 在读取子节点的时候同时把发现的孙子节点 push 到队列中，但是先不处理，
- 等到这一轮队列中的子节点处理完成以后
- 下一轮再继续处理的就是孙子节点了，这就实现了层序遍历

1. 非递归版

    ```js
    function bfs(root) {
      const queue = [root]
      const result = [];

      while (queue.length > 0) {  
        const node = queue.shift(); // 取出队首元素并移除  
        result.push(node.value);
        console.log(node.value); // 访问当前节点

        // 将子节点加入队尾
        if (node.children) {
          for (let child of node.children) {
            queue.push(child);
          }
        }
      }  

      return result
    }
    ```

BFS不适合用递归实现

- BFS的本质特性
  - BFS是层序遍历，需要按层级顺序访问节点
  - 使用队列(先进先出)来实现
  - 目标是先访问完当前层的所有节点，再访问下一层
- 递归的本质特性
  - 递归使用栈(后进先出)来实现
  - 递归会沿着一条路径深入到底，再回溯

1. 递归版本

    ```js
    function bfsRecursive(queue, result = []) {
      // 递归终止条件
      if (queue.length === 0) {
        return result;
      }
      
      // 处理当前层的所有节点
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        result.push(node.value);
        
        // 将下一层节点加入队列
        if (node.children) {
          for (let child of node.children) {
            queue.push(child);
          }
        }
      }
      
      // 递归处理下一层
      return bfsRecursive(queue, result);
    }

    // 调用方式
    // bfsRecursive([root]);

    ```

#### 515. 在每个树行中找最大值

一、[515. 在每个树行中找最大值](https://leetcode-cn.com/problems/find-largest-value-in-each-tree-row/)

给定一棵二叉树的根节点 root ，请找出该二叉树中每一层的最大值。

示例：

输入: root = [1,3,2,5,3,null,9]
输出: [1,3,9]

输入: root = [1,2,3]
输出: [1,3]

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

#### 94.二叉树的中序遍历

[94.二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

题目：给定一个二叉树的根节点 root ，返回 它的 中序遍历 。

示例：

输入：root = [1,null,2,3]
输出：[1,3,2]

输入：root = []
输出：[]

输入：root = [1]
输出：[1]

```js
// 迭代
var inorderTraversal = function(root) {
    const res = []
    const stack = []

    while(root || stack.length) {
        while(root) {
            stack.push(root)
            root = root.left
        }
        root = stack.pop()
        res.push(root.val)
        root = root.right
    }
    return res
}
```

### 226.翻转二叉树

[226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。

```js
// 递归
// DFS
var invertTree = function(root) {
  if (!root) return root

  const temp = root.left
  root.left = root.right
  root.right = temp

  invertTree(root.left)
  invertTree(root.right)

  return root
};

// BFS
// 层序遍历
// 根节点入列，然后出列，出列就交接左右子节点
// 然后左右子节点入列
// 直到队列为空
var invertTree = function(root) {
  if (!root) return root

  const queue = [root]

  while(queue.length) {
    const cur = queue.shift();
    // [cur.left, cur.right] = [cur.right, cur.left]
    const temp = cur.left
    cur.left = cur.right
    cur.right = temp

    if (cur.left) queue.push(cur.left)
    if (cur.right) queue.push(cur.right) 
  }

  return root
};
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

// 获取队首元素
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

类似数组，不过是无序存储结构。含义见 [链表](../dataStruct/README.md)

```js
// 单链表
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
```

### 206.反转链表

[206.反转链表](https://leetcode.cn/problems/reverse-linked-list/)

```js
// 迭代
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

// 递归
// head(n) 的下一个节点(head(n+1))指向 head(n)
// head.next.next = head
// 并把下一个节点置空 head.next = null

var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    }

    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
};
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

### 141.环形链表

[141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

题目：给你一个链表的头节点 head ，判断链表中是否有环。存在环 ，则返回 true 。 否则，返回 false 。

```js
var hasCycle = function(head) {
    // 标记法
    while (head) {
        if (head.tag) {
        return true;
        }
        head.tag = true;
        head = head.next;
    }
    return false;

    // 快慢指针
    // if (head == null) return false
    // let slow = head
    // let fast = head.next
    // while(slow != fast) {
    //     if (fast == null || fast.next == null) return false

    //     slow = slow.next
    //     fast = fast.next.next // 只走一步，会陷入循环；快指针要多一步，才能追到慢指针
    // }
    // return true
};
```

### 160.相交链表

[160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

图示两个链表在节点 8 开始相交：

输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：Intersected at '8'

方法：1. hashMap；2.双指针；3.暴力法

```js
// 双指针
/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  if (!headA || !headB) return null

  let a=headA
  let b=headB

  while(a !== b) {
      a = a === null ? headB : a.next
      b = b === null ? headA : b.next
  }

  return a
}
```

### 234.回文链表

[234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

题目：给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。

```js
var isPalindrome = function(head) {
    // 双指针
    const reverseList = (head) => {
        let prev = null;
        let curr = head;
        while (curr !== null) {
            let nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }

    const endOfFirstHalf = (head) => {
        let fast = head;
        let slow = head;
        while (fast.next !== null && fast.next.next !== null) {
            fast = fast.next.next;
            slow = slow.next;
        }
        return slow;
    }


    // 找到前半部分链表的尾节点并反转后半部分链表
    const firstHalfEnd = endOfFirstHalf(head);
    const secondHalfStart = reverseList(firstHalfEnd.next);

    // 判断是否回文
    let p1 = head;
    let p2 = secondHalfStart;
    let result = true;
    while (result && p2 != null) {
        if (p1.val != p2.val) result = false;
        p1 = p1.next;
        p2 = p2.next;
    }

    return result
}
```

## 贪心算法

贪心算法（Greedy Algorithm）是一种在每一步选择中都采取在当前状态下最好或最优（即最有利）的选择，从而希望导致结果是全局最好或最优的算法。贪心算法通常有**自顶向下**的搜索方式，以迭代的方式做出相继的选择，每做一次选择就将所求问题简化为一个规模更小的子问题。

贪心算法的主要特点是：

贪心选择性质：所求问题的整体最优解可以通过一系列局部最优的选择来达到。
最优子结构性质：当一个问题的最优解包含其子问题的最优解时，称此问题具有最优子结构性质。

### 121.买卖股票的最佳时机

[121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

示例：

输入：[7,1,5,3,6,4]
输出：5
解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。

输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 没有交易完成, 所以最大利润为 0。

```js
// 遍历
// 贪心的想法就是取最左最小值，取最右最大值，那么得到的差值就是最大利润。
var maxProfit = function(prices) {
  if (prices.length <= 1) return 0
  let inV = 0
  let res = 0

  for (let i = 1; i<prices.length; i++) {

    if (prices[i] - prices[inV] > res) {
      res = prices[i] - prices[inV]
    }

    if (prices[i] < prices[inV]) {
      inV = i
    }
  }
  return res
};

```

### 455.分发饼干

一、[455. 分发饼干](https://leetcode-cn.com/problems/assign-cookies/)

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是满足尽可能多的孩子，并输出这个最大数值。

示例：

输入: g = [1,2,3], s = [1,1]
输出: 1
解释:
你有三个孩子和两块小饼干，3 个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是 1，你只能让胃口值是 1 的孩子满足。
所以你应该输出 1。

输入: g = [1,2], s = [1,2,3]
输出: 2
解释:
你有两个孩子和三块小饼干，2 个孩子的胃口值分别是 1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出 2。

排序 + 贪心

```js
var findContentChildren = function(g, s) {
  g.sort((a, b) => a - b)
  s.sort((a, b) => a - b)

  let i = g.length - 1, j = s.length - 1;
  let count = 0;

  while(i >= 0 && j >= 0) {
    if (s[j] >= g[i]) {
      count++
      j--
    }
    i--
  }

  return count
}

var findContentChildren = function(g, s) {
  // 贪心策略：用尽量小的饼干满足孩子的胃口，这样大的饼干可以留给胃口大的孩子
  // 1. 对孩子胃口和饼干尺寸进行排序
  g.sort((a, b) => a - b);  // 孩子胃口从小到大排序
  s.sort((a, b) => a - b);  // 饼干尺寸从小到大排序
  
  let childIndex = 0;   // 孩子指针
  let cookieIndex = 0;  // 饼干指针
  let satisfiedCount = 0; // 满足的孩子数
  
  // 2. 用双指针遍历
  while (childIndex < g.length && cookieIndex < s.length) {
    // 3. 如果当前饼干能满足当前孩子
    if (s[cookieIndex] >= g[childIndex]) {
      satisfiedCount++;    // 满足孩子数+1
      childIndex++;        // 移动到下一个孩子
    }
    // 4. 无论是否满足，都要看下一个饼干（因为当前饼干要么被用了，要么太小了）
    cookieIndex++;
  }
  
  return satisfiedCount;
};
```

## 回溯

如果解决一个问题有多个步骤，每一个步骤有多种方法，题目又要我们找出所有的方法，可以使用回溯算法；回溯是在一颗树上 深度优先遍历（要找出所有的解）；

- 遍历枚举出所有可能的选择。（根据起点，画出二叉树）
- 依次尝试这些选择：作出一种选择，并往下递归。（剪枝）
- 如果这个选择产生不出正确的解，要撤销这个选择，回到之前的状态，并作出下一个可用的选择。

例题：

一、51. N 皇后

见下面: [51.N 皇后](#51n-皇后)

## 洗牌算法

链接: [shuffle](./shuffle/README.md)

## LRU

最久未使用 (`least recently used`)，LRU 算法又叫淘汰算法,根据数据历史访问记录进行淘汰数据；

核心思想： “如果数据最近被访问过, 那么将来被访问的几率也更高”。

LRU 在 Vue 的 `keep-alive` 中有使用

利用 Map 的 key 的有序性，Map 会记住键值对的插入顺序：

1. 插入顺序保持：当你按顺序插入键值对时，Map 会记住这个顺序
2. 遍历时按插入顺序：使用 for...of 或 forEach 遍历时，会按照插入的顺序访问键值对
3. keys() 方法返回有序键列表：Map.keys() 返回的迭代器会按照插入顺序提供键

```js
class LRUCache {
  constructor(n) {
    this.size = n
    this.data = new Map()
  }
  put(domain, info) {
    if(this.data.has(key)) this.data.delete(key)

    if(this.data.size >= this.size) {
      // 删除最久没有用到的数据
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

## 位运算

计算机的数字在内存中都是以二进制存储的（0 和 1 组成），位运算就是对二进制进行计算。

`&`: 与，两者都为 1，才为 1  
`|`: 或，两者都为 0， 才为 0  
`^`: 异或，两者相同为 0，相异为 1  
`~`: 按位非，0 变 1，1 变 0，运算时 `~x = -(x+1)`  
`<<`: 左移，左移 n 位，左边超出丢弃，右边补 0；相当于 N*(2^n) ，如 5 << 2 = 5*(2**2) = 20。(2的n次方，在js 使用 `Math.pow(2,n)` 或者 `2**n`)
`>>`: 右移，右移 n 位；无符号，左边补 0，有符号，编译器处理方式不一样；相当于 N/(2^n)，如 5 >> 2 = 5/(2**2) = 1。
`>>>`: 无符号右移，无符号右移 n 位，左边补 0，右边丢弃；相当于 N/(2^n)，如 5 >>> 2 = 5/(2^2) = 1.25。

异或运算性质：

1. 任何数和 0 做异或运算，结果仍然是原来的数，即 `a^0=a`
2. 任何数和其自身做异或运算，结果是 0，即 `a^a=0`
3. 异或运算满足交换律和结合律，即 `a^b^a = b^a^a = b^(a^a) = b^0=b`。

异或是机器码运算，相同为 0 不同为 1，不管数字先后，只要两个数字相同对应的二进制都会被异或为 00000000，最后剩下的就是所要找的值。

负数的位运算：

负数的位运算建立在它的补码上，正数的补码是它本身，负数的补码是，符号位（左边最高位，1为负数，0为正数）不变，其余按位取反。最后再 +1.

```js
// 15，原码:00001111   补码:00001111

// −15,原码:10001111   补码:11110001

```

### 位运算应用

1. 实现乘除法

   ```js
   a << 1 = a*2
   a >> 1 = a/2
   ```

2. 判断奇偶数  
  二进制中，最低位（最后一位）决定了是奇数还是偶数。与 1 相与即可实现目的，为 0 则是偶数，为 1 则是奇数。
  
    ```js
    // 常用的奇偶判断
    // num % 2 == 0

    // 位运算
    // nunm & 1 
    ```

    注意：由于 `==` 的优先级比 `&` 大，所以判断的时候，记得加括号，即 `(num&1) === 1` 为 `true`

3. 求负数绝对值(整数)

   ```js
    getAbs(a) {
      return a > 0 ? a : (~a+1)
    }
   ```

4. 交换两数，不需要临时变量

    ```js
    function swap(a, b) {
      // 普通操作
      let temp = a
      a = b
      b = temp

      // 或者
      a = a+b
      b = a-b
      a = a-b

      // 位运算
      a ^= b // a 变成了 a^b，a 和 b 的异或结果
      b ^= a // b 变成了 a^b^b = a^0 = a , 即 b 变成了原来的 a
      a ^= b // a 变成了 a^b^a = b^0 = b
    }
    ```

5. 数组中其余出现两次，有一个数出现一次，找出这个数

    ```js
    // 利用 a ^ b ^ b =a
    // 讲数组的数 做 ^ 运算

    [1,1,2,2,3,4,4,5,5].reduce((a,b) => a^b, null)
    // 3

    ```

### 169.多数元素

给定一个大小为 n 的数组 nums ，返回其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

```js
var majorityElement = function(nums) {
  // 栈降维
  // 相同 + 1，不同 -1
  // 因为相同的数大于一半, 所以剩下大于一半的那个
  let x = 0
  let m = 0

  for (let n of nums) {
    if (m === 0) x = n

    m += x === n ? 1 : -1
  }

  return x
};
```

### 136.只出现一次的数字

[136.只出现一次的数字](https://leetcode.cn/problems/single-number/)

题目：给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

异或运算满足交换律, a^b^a=a^a^b=b, 因此 ans 相当于 nums[0]^nums[1]^nums[2]^nums[3]^nums[4]

0^任意值 = 任意值

```js
// hashMap

// 暴力法

// 排序 nlog(n)

// 异或
var singleNumber = function(nums) {
  if (!nums.length) return null

  let a = nums[0]

  for (let i = 1; i<nums.length; i++) {
      a = a ^ nums[i]
  }

    return a
}
```

## 经典例题

### 把一个数组旋转 K 步

leetcode: 189.[旋转数组](https://leetcode.cn/problems/rotate-array/description/)

题目：

1. 输入一个数组 `[1,2,3,4,5,6,7]`
2. `K=3`,  即向后旋转 3 步（即最后面，旋转到最前面）
3. 输出 `[5,6,7,1,2,3,4]`

两种思路：

- `pop`  队尾弹出，`unshift` 插入队首；时间复杂度 `O(n^2)`，unshift 时间复杂度 `O(n)`; 空间复杂度 `O(1)`
- 数组分为两份，剪切数组尾部 k 个元素，放前面，`concat` 剩余的子数组；时间复杂度 `O(1)`；空间复杂度 `O(n)`

```js
// pop unshift
// 超时
function rotateArr(arr, k) {
  const len = arr.length || 0
  if (len === k) return

  //1、abs表示取绝对值，如果传入的值是一个负数，那么会按照正数来进行处理，
  // 2、如果key和arr.length相等，那么则原数组不变，从而这里进行一步取余处理;
  // 3、如果key不是整数，那么在下方循环那么step就是NaN,NaN于任何值做比较都会返回false，下方循环就不会进入
  const step = Math.abs(k%len)
  for (let i = 0; i<step; i++) {
    const p = arr.pop()
    if (p != null) arr.unshift(p)
  }

  return arr
}

// slice 和 concat
function rotateArr1(arr, k) {
  const length = arr.length

  if(!k || length === 0) return arr
  const step = Math.abs(k % length)  //abs 取绝对值
  const part1 = arr.slice(-step)
  const part2 = arr.slice(0, length - step)
  const part3 = part1.concat(part2)
  return part3
}

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

### N 数之和

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
      for(let i = 0, len = nums.length; i< len; i++) {
        if (map.has(target - nums[i])) {
          return [ map.get(target - nums[i]), i ]
        } else {
          map.set(nums[i], i)
        }
      }
      return []
    }
    ```

#### 15.三数之和

地址: [3sum](https://leetcode-cn.com/problems/3sum/)

1. 暴力法, 3 个 `for` 循环
2. 排序 + 双指针

    ```js
    // 时间复杂度 O(n^2)
    // sort 排序可以做到 nlogn (nlogn < n^2)
    const threeSum = function(nums) {
      let res = []
      const len = nums.length
      if (nums === null || nums.length < 3) return res

      nums.sort((a, b) => a - b)

      for (let i =0; i<len; i++) {
        // 排序后 i 从左边遍历，作为第一个数
        // 当前数字大于 0，则三数之和大于0
        if (nums[i] > 0) break
        if (i>0 && nums[i] === nums[i-1]) continue; // 跳过，去重

        let l = i + 1
        let r = len - 1

        while(l<r) {
          const sum = nums[i] + nums[l] + nums[r]
          if (sum === 0) {
            res.push([nums[i], nums[l], nums[r]])
            while (l < r && nums[l] === nums[l+1]) l++
            while (l < r && nums[r] === nums[r-1]) r--

            l++
            r--
          }
          if (sum < 0) {
            l++
          }
          if (sum > 0) {
            r--
          }
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

### 51.N 皇后

链接: [51. N 皇后](https://leetcode-cn.com/problems/n-queens/)

按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。

n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。

每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。

示例：

输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。

输入：n = 1
输出：[["Q"]]

假设: row 为行数, col 为列数

对角线[左下 -> 右上]: row + col
对角线[左上 -> 右下]: row - col

不能同行，同列，同对角线

```js
var solveNQueens = function(n) {
  let res = [], 
    queens = [] // 每行皇后在的列位置, queens[i] = j 表示第 i 行的皇后在第 j 列

  // 判断位置是否可以放置
  let canPlace = (queens, row, col) => {
    console.log("判断行 row = " + row + ";" + "列 col = " + col + ";" + "是否可以放置")

    for (let i = 0; i < queens.length; i++) {
      // i 是行, queens[i] 是列
      // 不能同行，同列，同对角线
      if (queens[i] === col) return false // 同列检查
      if (i + queens[i] == row + col || i - queens[i] == row - col) return false  // 对角线检查
      // if (Math.abs(row - i) === Math.abs(col - queens[i])) return false
    }

    console.log("位置 row = " + row + ";" + "列 col = " + col + "可以放置")
    return true
  }

  let dfs = (res, queens, n, row) => {
    console.log("row = " + row + ";" + "尝试在第 " + row + " 行放置皇后")

    if (row === n) {
      console.log("第 " + row + " 行已放置完所有行")
      console.log("queens = " + JSON.stringify(queens))
      return res.push(queens.map(s => '.'.repeat(s) + 'Q' + '.'.repeat(n-s-1)))
    }

    for (let col = 0; col < n; col++) {
      if (!canPlace(queens, row, col)) continue // 不能放置，跳过
      queens[row] = col
      console.log("queens 第" + row + "行放置了col：" + col)
      console.log("queens = " + JSON.stringify(queens))
      console.log("深度遍历下一行")
      dfs(res, queens, n, row + 1)

      console.log("dfs 出来了, row: " + row)
      queens.splice(row, 1)
      console.log("回溯后的 queens = " + JSON.stringify(queens))
    }
  }

  dfs(res, queens, n, 0)
  return res
}

solveNQueens(4)

// 执行过程：
// row=0: 尝试在第0行放置皇后
//  判断行 row = 0;列 col = 0;是否可以放置
//  位置 row = 0;列 col = 0可以放置
//  queens 第0行放置了col：0
//  深度遍历下一行
// row=1: 尝试在第1行放置皇后
//  col=0,1,2都不行，col=3可以: queens=[0,3]
//         row=2: 尝试在第2行放置皇后
//           col=0,1,2,3都不行，回溯
//         回溯到row=1，继续尝试其他列...
```

### 165.比较版本号

[165. 比较版本号](https://leetcode.cn/problems/compare-version-numbers/)

```js
var compareVersion = function(version1, version2) {
  // 字符串分割
  // const v1 = version1.split('.');
  // const v2 = version2.split('.');
  // for (let i = 0; i < v1.length || i < v2.length; ++i) {
  //     let x = 0, y = 0;
  //     if (i < v1.length) {
  //         x = parseInt(v1[i]);
  //     }
  //     if (i < v2.length) {
  //         y = parseInt(v2[i]);
  //     }
  //     if (x > y) {
  //         return 1;
  //     }
  //     if (x < y) {
  //         return -1;
  //     }
  // }
  // return 0;
  
  // 双指针
  const n = version1.length, m = version2.length;
  let i = 0, j = 0;
  while (i < n || j < m) {
      let x = 0;
      for (; i < n && version1[i] !== '.'; ++i) {
          x = x * 10 + version1[i].charCodeAt() - '0'.charCodeAt();
      }
      ++i; // 跳过点号
      let y = 0;
      for (; j < m && version2.charAt(j) !== '.'; ++j) {
          y = y * 10 + version2[j].charCodeAt() - '0'.charCodeAt();
      }
      ++j; // 跳过点号
      if (x !== y) {
          return x > y ? 1 : -1;
      }
  }
  return 0;
};
```

### 403.青蛙过河

链接: [403.青蛙过河](https://leetcode.cn/problems/frog-jump/)

一只青蛙想要过河。 假定河流被等分为若干个单元格，并且在每一个单元格内都有可能放有一块石子（也有可能没有）。 青蛙可以跳上石子，但是不可以跳入水中。

给你石子的位置列表 stones（用单元格序号 升序 表示）， 请判定青蛙能否成功过河（即能否在最后一步跳至最后一块石子上）。开始时， 青蛙默认已站在第一块石子上，并可以假定它第一步只能跳跃 1 个单位（即只能从单元格 1 跳至单元格 2 ）。

如果青蛙上一步跳跃了 k 个单位，那么它接下来的跳跃距离只能选择为 k - 1、k 或 k + 1 个单位。 另请注意，青蛙只能向前方（终点的方向）跳跃。

示例：

输入：stones = [0,1,3,5,6,8,12,17]
输出：true
解释：青蛙可以成功过河，按照如下方案跳跃：跳 1 个单位到第 2 块石子, 然后跳 2 个单位到第 3 块石子, 接着 跳 2 个单位到第 4 块石子, 然后跳 3 个单位到第 6 块石子, 跳 4 个单位到第 7 块石子, 最后，跳 5 个单位到第 8 个石子（即最后一块石子）。

输入：stones = [0,1,2,3,4,8,9,11]
输出：false
解释：这是因为第 5 和第 6 个石子之间的间距太大，没有可选的方案供青蛙跳跃过去。

```js
var canCross = function (stones) {
   const set = new Set()
   return helper(stones, 0, 0, set)
};
var helper = function (stones, index, k, set) {
    const key = index * 1000 + k
    if (set.has(key)) {
        return false
    } else {
        set.add(key)
    }
    for (let i = index + 1; i < stones.length; i++) {
        const gap = stones[i] - stones[index]
        if (gap >= k-1 && gap <= k+1) {
            if (helper(stones, i, gap, set)) {
                return true
            }
        } else if (gap > k+1) {
            break
        }
    }
    return index == stones.length - 1
}
```

### 剑指 Offer 22.链表中倒数第k个节点

输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var getKthFromEnd = function(head, k) {
  // 方式一：利用 map
  // const arr = new Map()
  // let i = 0

  // while (head) {
  //   arr.set(i, head)
  //   head = head.next
  //   i++
  // }

  // return arr.get(i - k)

  // 方式二：双指针
  let node = head, n = 0;
  while (node) {
      node = node.next;
      n++;
  }
  node = head;
  for (let i = 0; i < n - k; i++) {
      node = node.next;
  }
  return node;
};
```

### 122.买卖股票的最佳时机 II

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。

返回 你能获得的 最大 利润 。

输入：`prices = [7,1,5,3,6,4]`
输出：7
解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3 。
     总利润为 4 + 3 = 7 。

```js
// 动态规划
// dp[i][0] 表示第 i 天交易完后手里没有股票的最大利润，dp[i][1] 表示第 i 天交易完后手里持有一支股票的最大利润（i 从 0 开始）。
// dp[i][0] = max{dp[i-1][0], dp[i-1][1] + prices[i]}
// dp[i][1] = max{dp[i-1][1], dp[i-1][0] - prices[i]}
var maxProfit = function(prices) {
  const n = prices.length;
  // const dp = new Array(n).fill(0).map(v => new Array(2).fill(0));
  // dp[0][0] = 0, dp[0][1] = -prices[0];
  // for (let i = 1; i < n; ++i) {
  //     dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
  //     dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
  // }
  // return dp[n - 1][0];

  let dp0 = 0, dp1 = -prices[0]

  for (let i = 1; i<n; i++) {
    let newDp0 = Math.max(dp0, dp1 + prices[i])
    let newDp1 = Math.max(dp1, dp0 - prices[i])

    dp0 = newDp0
    dp1 = newDp1
  }

  return dp0
};

// 贪心
// 求最大利润，而不求操作
// 所以 能赚钱，就头天买
// 第一天，盈利为 0
// 第二天，
// 如果 减前一天为 负，昨天不买入；今天不卖出，盈利为 0
// 为正数，昨天买入，今日卖出，盈利为正数
var maxProfit = function(prices) {
  let ans = 0
  for (let i =1, len = prices.length; i<len; i++) {
    ans = ans + Math.max(0, prices[i] - prices[i-1])
  }
  return ans
};
```

### 67.二进制求和

[67. 二进制求和](https://leetcode.cn/problems/add-binary/)

```js
var addBinary = function(a, b) {
  let ans = ''
  let num = 0 // 进位

  let i = a.length - 1
  let j = b.length - 1
  for (; i >= 0 || j >= 0; i--, j--) {

    let m = i >= 0 ? parseInt(a[i]) : 0
    let n = j >= 0 ? parseInt(b[j]) : 0
    // 补 0

    let sum = num
    sum = sum + m
    sum = sum + n


    ans = ans + sum%2 // 拼接 1
    num = Math.floor(sum/2)
  }

  ans = ans + (num == 1 ? num : '') // 判断最后是否进位
  return ans.split('').reverse().join('');
};
```

### 300. 最长递增子序列

[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

<!-- 动态规划思路 + 二分 -->

测试用例：

```js
nums1 = [10,9,2,5,3,7,101,18]
// 输出：4
// 解释：最长递增子序列是 [2,3,7,101], 长度是 4。

nums2 = [0,1,0,3,2,3]
// 输出：4

nums3 = [7,7,7,7,7,7,7]
// 输出：1
```

题解：

```js
/**
 * @param {number[]} nums
 * @return {number}
**/

var lengthOfLIS = function(nums) {
  let f = [nums[0]]
  const binarySearch = (num) => {
    let left = 0, right = f.length;
    while (left < right) {
      // let mid = left + ((right - left) >> 1);
      let mid = left + ((right - left)/2);
      if (f[mid] < num) left = mid + 1;
      else right = mid;
    }
    return left
  }

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > f[f.length - 1]) {
      f.push(nums[i])
    } else {
      f[binarySearch(nums[i])] = nums[i]
    }
  }

  return f.length
}

```
