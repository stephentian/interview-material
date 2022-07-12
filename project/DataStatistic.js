/**
 * @description: 数据统计 DataStatistic
 * @author: stephentian
 * @date: 2022-07-12
 **/

const PV_URL_SET = new Set()

class DataStatistic {
  constructor(project) {
    this.projectId = project

    // 自动发送数据
    this.initPerformance() // DOMContentLoaded 调用
    this.initError()
    this.initHttp()
  }

  send(url, params = {}) {
    // 用 img 发送
    // 1. 可跨域
    // 2. 兼容性好(axios, fetch)

    const paramsArr = []
    for (let key in params) {
      const val = params[key]
      paramsArr.push(`${key}=${val}`)
    }

    const url = `${url}?${params.join('&')}`
    const img = document.createElement('img')
    img.src = url // get
  }

  initPerformance() {
    // window.preformance
    // preformance.timing

    const url = ''
    // 将原始数据给服务端
    this.send(url, performance.timing)
  }
  initError() {
    // window.onerror
    window.addEventListener('error', (event) => {
      const { error } = event
      this.error(error)
    })

    // Promise 未 catch 错误
    window.addEventListener('unhandledrejection', (event) => {
      const { reason } = event
      this.error(new Error(reason), { type: 'unhandledrejection' })
    })
  }
  // 页面浏览
  pv() {
    const href = location.href
    // 不重复发送 PV
    if (PV_URL_SET.get(href)) return
    this.send('pv')
    PV_URL_SET.add(href)
  }
  // 自定义事件
  event(name, val = {}) {
    const url = ''
    this.send(url, { name: val })
  }
  error(err, info = {}) {
    const url = ''

    this.send(url, { ...err, ...info })
  }

  initHttp(url, params = {}) {
    // ajax, axios, fetch 都有由 XMLHttpRequest
    // 重写 XMLHttpRequest
    const xhr = new XMLHttpRequest()

    window.addEventListener('load', function () {
      if (xhr.status === 200) {
      }
    })
  }
}
