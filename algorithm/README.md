# Algorithm

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [排序](#%E6%8E%92%E5%BA%8F)
- [动态规划](#%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92)
- [全排列](#%E5%85%A8%E6%8E%92%E5%88%97)
- [经典例题](#%E7%BB%8F%E5%85%B8%E4%BE%8B%E9%A2%98)
  - [N数之和](#n%E6%95%B0%E4%B9%8B%E5%92%8C)
    - [双数之和](#%E5%8F%8C%E6%95%B0%E4%B9%8B%E5%92%8C)
    - [三数之和](#%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C)
    - [四数之和](#%E5%9B%9B%E6%95%B0%E4%B9%8B%E5%92%8C)
    - [n 数之和](#n-%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [字符串解码](#%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%A7%A3%E7%A0%81)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 排序

地址: [Sort](https://github.com/stephentian/daily-js/tree/master/01-Algorithm/05-Sort)

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

DFS

例题：

一、[257. 二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

给定一个二叉树，返回所有从根节点到叶子节点的路径。

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

BFS

解析：维护一个 queue 队列，在读取子节点的时候同时把发现的孙子节点 push 到队列中，但是先不处理，等到这一轮队列中的子节点处理完成以后，下一轮再继续处理的就是孙子节点了，这就实现了层序遍历，也就是一层层的去处理。

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

## 经典例题

### 交换链表节点

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

### 字符串解码

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
