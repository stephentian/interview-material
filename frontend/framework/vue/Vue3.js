/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2024-08-25
 **/

class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = document.querySelector(options.el)

    // 数据监听
    observe(this.$data)

    // 初始化编译器，负责解析模板并生成渲染函数
    new Compile(this.$el, this)
  }
}
