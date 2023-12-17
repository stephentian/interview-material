/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-20
**/

// 事件代理

// 判断点击的是不是li（假设li里面的结构是不固定的），那么e.target就可能是p，也有可能是div
// 指定到 li 上
let ul = document.querySelector('list')
list.addEventListener('click', e => {
  let el = e.target
  while (e.target.toLowerCase() !== 'li') {
    el = el.parent
    if (el === ul) {
      el = null
      break
    }
  }
  el && console.log('点击了 xxx')
})

function delegate(element, eventType, selector, fn) {
  element.addEventListener(eventType, e => {
    let el = e.target
    while (!el.matches(selector)) {
      el = e.parentNode
      if (element === el) {
        el = null
        break
      }
    }
    el && fn.call(el)
  })
  return element
}
