let _Vue = null

class VueRouter {
  static install(vue) {
    if (VueRouter.install.installed) return
    VueRouter.install.installed = true

    _Vue = vue

    _Vue.mixin({
      beforeCreate() {
        // 将根组件上的 router 实例挂载到 Vue 原型，那么所有的组件实例上都会有 $router
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      },
    })
  }

  constructor(options) {
    this.options = options
    this.routeMap = {}

    // 将当前路径变成响应式
    this.data = _Vue.observable({
      current: '/',
    })
    this.init()
  }
  init() {
    thi.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }
  initComponent(Vue) {
    Vue.component('route-link', {
      props: {
        to: String,
      },
      render(h) {
        return h(
          'a',
          {
            attr: {
              href: this.to,
            },
            on: {
              click: this.clickhand,
            },
          },
          [this.$slotes.default]
        )
      },
      methods: {
        clickH,
      },
    })

    // 保留 this 指向
    const self = this
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      },
    })
  }

  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })

    // 监听 hash变化
    window.addEventListener('hashchange', () => {
      //http://localhost/#/home
      this.data.current = window.location.hash.slice(1) || '/';
    })
  }
}
