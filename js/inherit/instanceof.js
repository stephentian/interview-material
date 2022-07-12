/**
 * @description: instanceof
 * @author: stephentian
 * @date: 2022-07-12
 **/

function myInstanceof(target, origin) {
  if (obj === null) return

  while (target) {
    if (target.__proto__ === origin.prototype) {
      return true
    }
    target = target.__proto__
  }
  return false
}
