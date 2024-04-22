/**
* @description: 把一个数组旋转 k 步
* @author: stephentian
* @date: 2022-4-18
*
*/

/**
* @param: arr: number[]
* @param: k: number
* @return: number[]
**/

// 时间复杂度 O(n^2)
// 因为 arr.unshift 时间复杂度为 O(n)
// 空间复杂度 O(1)

function reverseK(arr, k) {
    const len = arr.length
    if (!k || len === 0) return arr
    const step = Math.abs(k % len) // 取绝对值，且大于 len 时 取余数

    for(let i = 0; i < step; i++) {
        const n = arr.pop()
        if (n) {
            arr.unshift(n)
        }
    }
    return arr
}

// 时间复杂度 O(1)
// 空间复杂度 O(n)

function reverseK1(arr, k) {
    const len = arr.length
    if (!k || len === 0) return arr
    
    const step = Math.abs(k % len)
    const subArr1 = arr.slice(-step)
    const subArr2 = arr.slice(0, len - step)
    return subArr1.concat(subArr2)
}

// 时间复杂度 O(n)

function reverseK2(arr, k) {
    const len = arr.length
    if (!k || len === 0) return arr

    const step = Math.abs(k % len)
    for(let i = 0; i < step; i++) {
        const temp = arr[i]
        arr[i] = arr[len - step]
        arr[len - step] = temp
    }
    return res
}