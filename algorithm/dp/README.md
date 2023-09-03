# 动态规划

DP（dynamic program）

重点：**状态** 和 **状态转移方程**

常见题目: 爬楼梯, 斐波那契数列 等

- [70.爬楼梯](#70爬楼梯)
- [打家劫舍](#打家劫舍)

## 70.爬楼梯

地址：[70.爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

分析：

最后一步上楼顶可能有两种方式，走一个台阶或者两个台阶。所以 最后一步的方法 等于前一步 加上 前两步的方法。

```js
var climbStairs = function(n) {
// 1 = 1
// 2 =
// 1 + 1
// 2
// 3 = 
// 1 + 1 + 1
// 1 + 2
// 2 + 1
// 4 = 
// 1 + 1 + 1 + 1
// 1 + 1 + 2
// 1 + 2 + 1 + 1
// 2 + 1 + 1 + 1
// 2 + 2

  if (n<=2) return n

  const dp = []
  dp[1] = 1
  dp[2] = 2
  for (let i =3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
};
```

## 打家劫舍

[198. 打家劫舍](https://leetcode.cn/problems/house-robber/)

有一个非负整数数组，相邻的不能拿，拿到里面的值求和，输出和的最大值。

示例 1：

输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4.
示例 2：

输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12.

```js
// nums [1, 2, 3, 1]
// 最大 4
// nums [2, 7, 9, 3, 1]
// 最大 12 (2, 9, 1)

// 状态： 
// 1. 取最后一个 nums[i] + dp[i - 2]
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
