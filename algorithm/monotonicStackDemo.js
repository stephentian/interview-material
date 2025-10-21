/**
 * 演示单调栈在循环数组中查找下一个更大元素的应用
 * 详细注释说明每一步的执行过程
 */

// 示例数组: [1, 2, 1]
// 我们要找到每个元素的下一个更大元素

function nextGreaterElementsDemo(nums) {
  const len = nums.length;
  const res = new Array(len).fill(-1);
  const stack = []; // 栈中存储的是索引，不是值

  console.log("原始数组:", nums);
  console.log("数组长度:", len);

  // 遍历两遍数组来模拟循环: i < len * 2 - 1
  for (let i = 0; i < len * 2 - 1; i++) {
    const currentIndex = i % len; // 当前实际索引
    const currentValue = nums[currentIndex]; // 当前实际值

    console.log(`\n--- 第 ${i + 1} 次循环 ---`);
    console.log(`i = ${i}, currentIndex = ${currentIndex}, currentValue = ${currentValue}`);
    console.log(`循环前栈状态: [${stack.map(idx => `${idx}(${nums[idx]})`).join(', ')}]`);

    // 关键部分：维护单调递减栈
    // 如果栈不为空且当前值大于栈顶索引对应的值
    while (stack.length && currentValue > nums[stack[stack.length - 1]]) {
      const poppedIndex = stack.pop(); // 弹出栈顶元素的索引
      res[poppedIndex] = currentValue; // 记录结果
      console.log(`  弹出索引 ${poppedIndex}，因为 ${currentValue} > ${nums[poppedIndex]}`);
      console.log(`  设置 res[${poppedIndex}] = ${currentValue}`);
    }

    // 将当前索引入栈
    stack.push(currentIndex);
    console.log(`  将索引 ${currentIndex} 入栈`);
    console.log(`循环后栈状态: [${stack.map(idx => `${idx}(${nums[idx]})`).join(', ')}]`);
    console.log(`当前结果数组: [${res.join(', ')}]`);
  }

  console.log("\n最终结果:", res);
  return res;
}

// 测试示例
console.log("=== 示例 1: [1, 2, 1] ===");
nextGreaterElementsDemo([1, 2, 1]);

console.log("\n\n=== 示例 2: [1, 2, 3, 4, 3] ===");
nextGreaterElementsDemo([1, 2, 3, 4, 3]);

module.exports = nextGreaterElementsDemo;