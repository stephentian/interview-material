// 单调栈演示：寻找右侧第一个更大元素
function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  const stack = []; // 单调递减栈，存储索引
  
  console.log('塔的高度:', heights);
  console.log('\n处理过程:');
  
  for (let i = 0; i < heights.length; i++) {
    console.log(`\n当前处理第${i}座塔，高度为${heights[i]}`);
    console.log(`处理前栈状态: [${stack.map(idx => heights[idx]).join(', ')}]`);
    
    // 当栈不为空且当前元素大于栈顶元素时
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const topIndex = stack.pop();
      result[topIndex] = heights[i];
      console.log(`  塔${topIndex}(高度${heights[topIndex]})找到了右侧第一个更高塔: ${heights[i]}`);
    }
    
    stack.push(i);
    console.log(`  将当前塔${i}入栈`);
    console.log(`  处理后栈状态: [${stack.map(idx => heights[idx]).join(', ')}]`);
  }
  
  console.log('\n最终结果:');
  heights.forEach((height, index) => {
    const nextGreater = result[index] === -1 ? '无更高塔' : result[index];
    console.log(`塔${index}(高度${height})右侧第一个更高塔: ${nextGreater}`);
  });
  
  return result;
}

// 测试用例
const towerHeights = [3, 7, 1, 5, 4];
nextGreaterElement(towerHeights);

console.log('\n' + '='.repeat(50));
console.log('为什么栈底是最大的元素？');
console.log('='.repeat(50));
console.log(`
1. 栈的维护规则：
   - 当遇到一个较大的元素时，我们会不断弹出栈中比它小的元素
   - 这意味着，只有当一个元素足够大，能够"击败"栈顶元素时，它才有可能成为新的栈底

2. 栈底元素的特点：
   - 它是到目前为止遇到的最大元素
   - 它不会被后续任何元素弹出（除非有更大的元素出现）
   - 它是所有元素中，最难被弹出的

3. 举个例子：
   - 当我们处理高度为7的塔时，它弹出了栈中的3
   - 此时7成为新的栈底
   - 后续的1、5、4都无法弹出7，所以7一直保持在栈中

4. 栈的单调性：
   - 从栈底到栈顶，元素大小递减
   - 这种结构保证了我们可以高效地找到每个元素的"下一个更大元素"
`);