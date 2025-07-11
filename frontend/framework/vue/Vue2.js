/**
 *
 * @description: vue MVVM 框架的简化实现
 * @author: stephen
 * @date: 2022-07-02
 **/

// es6
class Vue {
  constructor(options) {
    this.$options = options
    this._data = options.data
    this._methods = options.methods

    //数据监听
    observe(this._data)

    // 初始化编译器，负责解析模板并生成渲染函数
    new Compile(options.el, this)
  }

  /**
   * 创建一个 Observer 实例，用于观测数据对象
   * @param {any} value - 需要被观测的数据对象
   * @returns {Observer} 返回一个 Observer 实例
   */
  observe(value) {
    return new Observer(value)
  }

  /**
   * 为数据对象的属性创建 getter 和 setter，实现数据绑定
   * @param {Object} vm - Vue 实例
   * @param {string} key - 数据对象的属性名
   */
  _proxy(vm, key) {
    Object.keys(this._data).foreach((key) => {
      Object.defineProperty(this._data, key, {
        enumerable: false,
        configurable: true,
        get() {
          return this._data[key]
        },
        set(newValue) {
          this._data[key] = newValue
        },
      })
    })
  }
}

class Observer {
  constructor(value) {
    this.data = data
    this.walk(data)
  }

  /**
   * 遍历数据对象的属性，为每个属性创建响应式对象
   * @param {Object} data - 需要被处理的数据对象
   */
  walk(data) {
    const self = this
    Object.keys(data).forEach(function (key) {
      self.defineReactive(data, key, data[key])
    })
  }

  /**
   * 为指定属性创建响应式对象
   * @param {Object} data - 数据对象
   * @param {string} key - 属性名
   * @param {any} value - 属性值
   */
  defineReactive() {
    const dep = new Dep()

    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      get() {
        if (Dep.target) {
          // 添加订阅者
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newValue) {
        dep.notify()
      },
    })
  }
}

/**
 * Dep 类，用于管理订阅者
 */
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }

  /**
   * 通知所有订阅者更新视图
   */
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

/**
 * Watcher 类，用于订阅数据变化并更新视图
 */
class Watcher {
  /**
   * Watcher 类的构造函数
   * @param {Vue} vm - Vue 实例
   * @param {Function} cb - 更新视图的回调函数
   */
  constructor(vm, cb) {
    this.cb = cb

    Dep.target = this
  }

  update() {
    this.cb.call(this.vm)
  }
}

// 用于存储当前正在处理的订阅者的全局变量
Dep.target = null

/**
 * Compile 类，用于编译模板并且生成渲染函数
 **/
class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) {
      this.compileElement(this.$el)
    }
  }

  compileElement(el) {
    const childNodes = el.childNodes

    childNodes.forEach((child) => {
      if (this.isTextNode(child)) {
        // 编译文本节点 {{ }}
        this.compileText(child)
      } else if (this.isElementNode(child)) {
        // 处理节点指令 v-bind, v-on
        const attrs = child.attributes
        Array.from(attrs).forEach((attr) => {
          const attrName = attr.name
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2)
            this[dir] && this[dir](child, attr.value)
          }
        })
      }

      // 递归编译子节点
      this.compileElement(child)
    })
  }

  /**
   * 判断是否味文本节点
   **/
  isTextNode(node) {
    return node.nodeType === 3
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isDirective(attr) {
    return attr.startsWith('v-')
  }

  compileText(node) {
    const content = node.textContent
    const reg = /\{\{(.*)\}\}/

    if (reg.test(content)) {
      const expr = RegExp.$1.trim()

      // 更新内容
      node.textContent = this.$vm[expr]
    }
  }

  // v-bind
  bind(node, exp) {}
}
