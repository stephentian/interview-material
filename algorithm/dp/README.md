# 动态规划

DP（dynamic program）

给定一个问题，我们把它拆成一个个子问题，直到子问题可以直接解决。然后呢，把子问题答案保存起来，以减少重复计算。再根据子问题答案反推，得出原问题解的一种方法。

重点：**状态** 和 **状态转移方程**

常见题目: 爬楼梯, 斐波那契数列 等

- [斐波那契数列](#斐波那契数列)
- [70.爬楼梯](#70爬楼梯)
- [198.打家劫舍](#198打家劫舍)

## 斐波那契数列

[斐波那契数列](https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/)

写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

`F(0) = 0,   F(1) = 1`
`F(N) = F(N - 1) + F(N - 2), 其中 N > 1.`

```js
// 动态规划
// f(n+1) = f(n) + f(n-1)
var fib = function(n) {
  if (n <= 1) return n

  const MOD = 1000000007
  const dp = []
  dp[0] = 0
  dp[1] = 1
  for (let i=2; i<=n; i++) {
    dp[i] = (dp[i-1] + dp[i-2])%MOD
  }
  return dp[n]
};

// 优化
var fib = function(n) {
  if (n <= 1) return n

  const MOD = 1000000007
  let dp0 = 0,
  dp1 = 0,
  res = 1

  for (let i=2; i<=n; i++) {
    dp0 = dp1
    dp1 = res
    res = (dp0 + dp1)%MOD
  }
  return res
};
```

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

## 198.打家劫舍

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
