# Code 手写代码

- [可拖拽盒子](#可拖拽盒子)
- [lazyMan](#lazyman)
- [版本号排序](#版本号排序)
- [遍历 dom 节点](#遍历-dom-节点)

## 可拖拽盒子

## lazyMan

[lazyMan.js](./lazyMan.js)

## 版本号排序

版本号如下 `['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']`，或者 `[ '0.5.1', '0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5' ]`

```js
arr.sort((a,b) => {
    let i = 0;
    const arr1 = a.split('.');
    const arr2 = b.split('.');

    while(true) {
        const  s1 = arr1[i];
        const s2 = arr2[i ++];
        if(s1 === undefined || s2 === undefined) {
            return arr1.length - arr2.length;
        }
        if(s1 === s2) continue;
        return s1 - s2;
    }
})

// arr = ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']
// => ['0.1.1', '0.302.1', '2.3.3', '4.2', '4.3.4.5', '4.3.5']
```

## 遍历 dom 节点

```js
// 递归
// function traversal(node) {
//     if (node && node.nodeType === 1) {
//         console.log(node.tagName)
//     }

//     let { childNodes } = node
//     let item
//     for (let i = 0; i<childNodes.length; i++) {
//         item = childNodes[i]
//         if (item.nodeType === 1) {
//             traversal(item)
//         }
//     }
// }

// 广度遍历
function traversal(node) {
    const stack = []
    stack.push(node)

    while (stack.length > 0) {
        const ele = stack.pop()
        if (ele && ele.nodeType === 1) {
            console.log(ele.tagName)

            const { children } = ele
            const len = children.length

            for (let i = 0; i < len; i++) {
                stack.unshift(children[i])
            }
        }
    }
}
```
