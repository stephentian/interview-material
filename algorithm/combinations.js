/**
 * 使用暴力法和for循环解决组合问题
 * 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
 */

/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
function combine(n, k) {
    const result = [];
    
    // 暴力法使用多个嵌套for循环
    if (k === 1) {
        // 当k=1时，直接返回1到n的单元素数组
        for (let i = 1; i <= n; i++) {
            result.push([i]);
        }
    } else if (k === 2) {
        // 当k=2时，使用两层for循环
        for (let i = 1; i <= n - 1; i++) {
            for (let j = i + 1; j <= n; j++) {
                result.push([i, j]);
            }
        }
    } else if (k === 3) {
        // 当k=3时，使用三层for循环
        for (let i = 1; i <= n - 2; i++) {
            for (let j = i + 1; j <= n - 1; j++) {
                for (let l = j + 1; l <= n; l++) {
                    result.push([i, j, l]);
                }
            }
        }
    } else if (k === 4) {
        // 当k=4时，使用四层for循环
        for (let i = 1; i <= n - 3; i++) {
            for (let j = i + 1; j <= n - 2; j++) {
                for (let l = j + 1; l <= n - 1; l++) {
                    for (let m = l + 1; m <= n; m++) {
                        result.push([i, j, l, m]);
                    }
                }
            }
        }
    } else {
        // 对于更大的k值，使用递归回溯方法作为通用解法
        const backtrack = (start, currentCombination) => {
            // 如果当前组合长度等于k，则加入结果集
            if (currentCombination.length === k) {
                result.push([...currentCombination]);
                return;
            }
            
            // 从start开始遍历，避免重复组合
            for (let i = start; i <= n; i++) {
                currentCombination.push(i);
                backtrack(i + 1, currentCombination);
                currentCombination.pop();
            }
        };
        
        backtrack(1, []);
    }
    
    return result;
}

// 测试用例
console.log("测试 n=4, k=2:");
console.log(combine(4, 2));

console.log("\n测试 n=1, k=1:");
console.log(combine(1, 1));

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { combine };
}