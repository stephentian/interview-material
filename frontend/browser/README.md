# 浏览器

- [浏览器内核(渲染引擎)](#浏览器内核渲染引擎)
- [JavaScript 引擎](#javascript-引擎)
  - [v8](#v8)
- [Chromium 浏览器架构](#chromium-浏览器架构)
- [浏览器渲染](#浏览器渲染)
- [缓存](#缓存)
- [事件循环 Event Loop](#事件循环-event-loop)
- [一帧发生的事情](#一帧发生的事情)
- [setTimeout](#settimeout)
- [requestAnimationFrame](#requestanimationframe)
  - [对比 setTimeout](#对比-settimeout)
- [requestIdleCallback](#requestidlecallback)
- [浏览器的多线程](#浏览器的多线程)
- [Web Worker](#web-worker)
- [WebSocket](#websocket)
  - [WebSocket 心跳机制](#websocket-心跳机制)
- [SSE](#sse)
- [从 url 输入到显示网页都发生了什么？](#从-url-输入到显示网页都发生了什么)
  - [DNS 解析](#dns-解析)
  - [TCP 请求](#tcp-请求)
  - [渲染页面](#渲染页面)

## 浏览器内核(渲染引擎)

浏览器内核主要包含两部分：渲染引擎和 JS 引擎，但由于 JS 引擎越来越独立，浏览器内核就倾向于单指渲染引擎（Rendering Engine），所以我们常说的浏览器内核主要指的就是 **渲染引擎**。

浏览器内核（browser kernel）常表示 浏览器的排版引擎(Rendering Engine，layout engine)，也称浏览器引擎，页面渲染引擎，渲染内核等。

![浏览器内核列表](./img/browser-core.png)

- `Trident`： Microsoft，该内核被认为是在早期IE浏览器中占主导地位，但现在也存在于其他一些浏览器中，如 Edge。它对真正的网页标准支持不太好，且存在一些安全漏洞。
- `Gecko`：Mozilla，该内核主要用于 Firefox 火狐浏览器。它的优点是功能强大、丰富，可以支持很多复杂网页效果和浏览器扩展接口，但缺点是消耗较多的资源，如内存。
- `Presto`：（已弃用）该内核被称为公认的浏览网页速度最快的内核，同时也是处理 JS 脚本最兼容的内核，能在 Windows、Mac 及 Linux操作系统下完美运行。
- `Webkit`：Apple，该内核主要用于 Safari 浏览器，它的优点是具有清晰的源码结构、极快的渲染速度，但缺点是对网页代码的兼容性较低，可能导致一些编写不标准的网页无法正确显示。
  - `Chromium`：Google，基于 Webkit 再深度改装的内核，除了 Chrome，目前广泛应用于Sogou、360极速、世界之窗极速、百度、淘宝、猎豹等浏览器
  - `Webkit2`: 苹果公司开发，Webkit 的一个分支，负责渲染 HTML、CSS和JavaScript，并集成了 V8 来执行JavaScript代码。多进程架构。
  - `Blink`: Webkit 的一个分支, google 目前在使用。Blink 是一个更广泛的浏览器排版引擎，负责渲染 HTML、CSS和JavaScript，并集成了 V8 来执行JavaScript代码。

## JavaScript 引擎

JavaScript 是一门高级语言，CPU 只能识别机器语言；JavaScript 引擎将 JavaScript 翻译成 CPU 指令，JavaScript 的翻译速度越快，动态网页的展示也越快。

- `SpiderMonkey`: Brendan Eich(js作者) 开发
- `JSCore`: Webkit 中的 js 引擎，Apple 开发
- `V8`: Google 开发，Blink
- `Chakra`: 微软，IE 浏览器

### v8

V8 是 Google 的开源高性能 JavaScript 和 WebAssembly 引擎，用 `C++` 编写，它实现 ECMAScript 和 WebAssembly，可独立运行或嵌入到任何 C++ 应用程序中，如 Chrome 和 Node.js。

## Chromium 浏览器架构

chrome 架构图：

![chrome 架构图](./img/chromeArchitecture.jpeg)

- `WebCore`：WebKit 加载和渲染网页的基础，是不同浏览器所使用的 WebKit 中共享的部分，包括HTML解析器、CSS解析器、SVG、布局、渲染树等等；
- `JavaScript 引擎`：JavaScript 解析器，WebKit 默认的引擎是 JavaScriptCore，Google 的 Blink 为V8 引擎；
- `WebKit Ports`：WebKit中的移植部分，包括网络栈、音视频解码、硬件加速等模块，这部分对 WebKit 的功能和性能影响比较大。

## 浏览器渲染

- 解析渲染页面
  1. 构建 DOM 树
     - 遇到 script 标签，则 DOM 树的构建会暂停
  2. 构建 CSSOM 树
     - 解析 CSS 规则树时 js 执行将暂停，直至 CSS 规则树就绪
  3. 结合 DOM 树和 CSS 规则树，生成渲染树
  4. Reflow: 回流/重排，元素内容、结构、位置发送变化
  5. Repaint: 重绘，元素外观变化

## 缓存

见 [network - 缓存](../../network/README.md)

## 事件循环 Event Loop

JavaScript 是单线程的, 浏览器防止主线程阻塞，需要协调JS引擎线程和浏览器其他线程（UI渲染，网络请求）的执行顺序，Event Loop 的方案应用而生

Event Loop 包含两类

- Browsing Context
- Worker: 每一个 Web Worker 也有一个独立的 Event Loop

任务队列 `task queue`

- 一个事件循环有一个或多个任务队列
- 任务队列是集合, 不是队列. 因为 Event Loop 第一步是选取队列中第一个可运行的任务, 而不是第一个任务
- 微任务队列不是任务队列

Event loop 每一次循环操作叫 `tick`

1. 执行最先进入队列的任务
2. 检查是否存在 微任务 microtask, 存在则不停执行, 直至清空 微任务 microtask queue
3. render 渲染
   1. requestAnimationFrame
   2. intersectionObserver
4. 检查 宏任务队列，存在则执行
5. requestIdleCallback 取第一个, 执行

宏任务 task: script(整体代码), setTimeout, setInterval, setImmediate

微任务 microtask: Promise.then, MutaionObserver, process.nextTick

async/await:

- chrome 70 版本

```js
async function async1(){
  await async2()
  console.log('async1 end')
}
// 等价于
async function async1() {
  return new Promise(resolve => {
    resolve(async2())
  }).then(() => {
    console.log('async1 end')
  })
}
```

- chrome 70 版本以上, await 将直接使用 Promise.resolve() 相同语义

## 一帧发生的事情

![life of a frame](./img/life-of-a-frame.png)

1. 处理输入事件
2. js 解析
3. 开始帧渲染，窗口，滚动
4. rAF(requestAnimationFrame)
5. 布局
6. 绘制

## setTimeout

`setTimeout`:

- 浏览器一般最少 `4ms`; 经过 `5` 重嵌套定时器之后，时间间隔被强制设定为至少 `4ms` 。
- 同步任务执行过久, 可能 `setTimeout` 时间不准

**setTimeout 为什么浏览器不是 0ms 执行**：

1. 是不是 `0ms` 依赖于浏览器，不同浏览器的最低时延会不一致；浏览器还要有其他任务需要执行，所以不是 0ms。
2. 如果浏览器允许 `0ms`，会导致 JavaScript 引擎循环阻塞，也就是说如果浏览器架构是单进程的，那么可能网站很容易无响应。因为浏览器本身也是建立在 event loop 之上的，如果速度很慢的 `JavaScript engine` 通过 0ms timer 不断安排唤醒系统，那么 `event loop` 就会被阻塞。

## requestAnimationFrame

`window.requestAnimationFrame()`​​​ 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

- 处于浏览器JS主线程，所以回调执行与宏任务微任务无关, 与浏览器是否渲染有关, 它是在浏览器渲染之前, 微任务执行后执行。
- 一般显示器屏幕为 60hz, 大约 `16.7ms` 执行一次
- `requestAnimationFrame​​​` 会返回一个请求 ID，是回调函数列表中的一个唯一值，可以使用 `​​cancelAnimationFrame​​` 通过传入该请求 ID 取消回调函数。

```js
const test = document.querySelector<HTMLDivElement>("#test")!;
let i = 0;
let requestId: number;
function animation() {
  test.style.marginLeft = `${i}px`;
  requestId = requestAnimationFrame(animation);
  i++;
  if (i > 200) {
    cancelAnimationFrame(requestId);
  }
}
animation();
```

[深入requestAnimationFrame 执行机制](https://blog.51cto.com/feng/5289890)

**执行时机**:

`stackoverflow` 一些回答说 RAF 被归为宏任务，但它可能不一定按任务队列执行，会因为不同浏览器而执行结果不同。

谷歌浏览器和火狐官方文档是实现了在 css 渲染之前执行。

### 对比 setTimeout

- 执行时机: requestAnimation 由系统决定执行时间, setTimeout 的执行时间并不是确定的
- requestAnimationFrame 受系统的绘制频率影响，即屏幕分辨率 和 屏幕尺寸，setTimeout 受任务队列和页面渲染有关
- 页面未激活(切换，隐藏, 最小化), requestAnimationFrame 暂停执行, 旧版浏览器 setTimeout 会继续执行，新版浏览器 setTimeout 也会暂停执行（通过监听 visibilitychange 事件恢复动画）； 
- 函数节流: 防止刷新阶段, 防止函数执行多次
- 引擎: setTimeout JS 引擎线程, 存在事件队列. requestAnimationFrame 属于 GUI 引擎线程, 发生在渲染之前

## requestIdleCallback

`requestIdleCallback` 由 `React fiber` 引起关注. 用来判断浏览器渲染之后的空闲时间

`requestAnimationFrame` 每次渲染都执行

`requestIdleCallback` 渲染完空闲时才执行，假如浏览器一直处于非常忙碌的状态，requestIdleCallback 注册的任务有可能永远不会执行。此时可通过设置 timeout 来保证执行。`requestIdleCallback(myNonEssentialWork, { timeout: 2000 });`

## 浏览器的多线程

1. GUI 渲染线程
   - 绘制页面，解析 HTML、CSS，构建 DOM 树，布局和绘制等
   - 页面重绘和回流
   - 与 JS 引擎线程互斥，也就是所谓的 JS 执行阻塞页面更新
2. JS 引擎线程
    - 负责 JS 脚本代码的执行
    - 负责准执行准备好待执行的事件，即定时器计数结束，或异步请求成功并正确返回的事件
    - 与 GUI 渲染线程互斥，执行时间过长将阻塞页面的渲染
3. 事件触发线程
    - 将准备好的事件交给 JS 引擎线程执行
    - 多个事件加入任务队列的时候需要排队等待(JS 的单线程)
4. 定时器触发线程
   - 负责执行异步的定时器类的事件，如 setTimeout、setInterval
   - 定时器到时间之后把注册的回调加到任务队列的队尾
5. HTTP 请求线程
   - 负责执行异步请求
   - 该线程会把回调函数加入到任务队列的队尾等待执行

## Web Worker

- 由于 js 是单线程的，Web Worker 允许主线程外还存在一个线程
- 通过 postMessage 将结果回传到主线程

```js
let worker = new Worker("http://url.js")
worker.onmessage = function(e) {} // 监听返回的信息，e.data
worker.onerror = e => {} // 监听错误
worker.terminate() // 关闭Worker线程
```

关键：

- 分配给 Worker 线程的脚本文件必须和主线程的脚本文件同源
- Worker 不能读取本地文件（file://~），文件必须来自网络
- web worker 处于外部文件，无法访问到 winodow、document等

## WebSocket

以前客户端只能发送 ajax 请求与服务端通信，这样获取不到实时的服务端变化。WebSocket 使得前后端可以双向通讯，提高了通信效率

- WebSocket 是基于 TCP 协议进行全双工通讯的协议（应用层）
- 一次 TCP 握手，即可建立永久连接，并可双向传输数据

```js
let ws = new WebSocket(url)

ws.onopen = e => {
  console.log('连接成功', e)
  ws.send('我发送消息给服务端'); // 客户端与服务器端通信
}

ws.onmessage = e => {
  console.log('服务器端返回：', e.data)
}

Socket.send() // 使用连接发送数据
Socket.close() // 关闭连接
```

WebSocket的当前状态：WebSocket.readyState

- 0：正在连接
- 1：连接成功
- 2：连接正在关闭
- 3：连接已关闭

### WebSocket 心跳机制

WebSocket 有时候不稳定，需要检查心跳，心跳机制的时间可以自己与后端约定

```js
heartCheck() {
  this.pingPong = 'ping'; // ws的心跳机制状态值
  this.pingInterval = setInterval(() => {
    if (this.ws.readyState === 1) {
      this.ws.send('ping'); // 客户端发送ping
    }
  }, 10000)

  this.pongInterval = setInterval(() => {
    if (this.pingPong === 'ping') {
      // 没有返回 pong 重启webSocket
      // connect
    }
    // 重置为ping 
    // 若下一次 ping 发送失败 或 pong 返回失败，将重启
    this.pingPong = 'ping'
  }, 20000)
}
```

## SSE

SSE: Server-Sent Events

基于 HTTP 的服务器向客户端单向推送实时数据的技术，核心是客户端与服务器建立一次 HTTP 长连接，服务器可持续推送事件流数据，无需客户端反复请求。

核心特点：

1. 单向通信：仅服务器主动推送，客户端无法通过 SSE 反向发消息；
2. 基于 HTTP：兼容现有 HTTP 生态，部署 / 运维成本低；
3. 自动重连：客户端内置重连机制，无需手动实现；
4. 轻量级：协议格式简单，实现成本远低于 WebSocket；
5. 事件化：支持自定义事件类型，客户端可按需监听。
相比传统轮询（客户端频繁发请求），SSE 不用反复建立 / 断开连接，资源消耗更低，实时性也更好。

对比 WebSocket、轮询区别：

- 短轮询：客户端每隔固定时间发 HTTP 请求，服务器立即返回（无论有无新数据），拿到数据后断开连接，循环往复；
- 长轮询：客户端发请求后，服务器挂起连接（无新数据时），有数据 / 超时后返回，客户端立即重连；
- SSE：一次 HTTP 长连接，服务器主动推送数据，客户端自动重连；
- WebSocket：基于 TCP 的双向通信协议（非 HTTP），客户端 / 服务器可互相发消息。

选型建议：

- 仅需服务器单向推送（如通知、监控）：优先选 SSE；
- 需双向通信（如聊天、在线协作）：必须选 WebSocket；
- 兼容性要求极高（如 IE）：用长轮询兜底。

## 从 url 输入到显示网页都发生了什么？

动作过程：用户输入url -> DNS解析 -> TCP连接 -> HTTP请求(接收响应) -> 浏览器渲染页面

大致过程是：

1. URL 解析，协议，域名，路径，参数
2. DNS 解析，找到对应 IP 地址
3. TCP 连接，三次握手
4. 发送 HTTP 请求，发送请求报文
5. 服务器处理请求，返回响应报文
6. 浏览器渲染页面，解析HTML，CSS，JS，绘制屏幕
7. TCP 断开连接，四次挥手（若开启 Keep-Alive 则保持连接复用）

细节展开：

### DNS 解析

DNS 解析就是 “翻译域名→IP” 的过程，核心是 **逐级查询缓存 + 分布式服务器协作**。

`用户输入域名 → 浏览器缓存 → 操作系统缓存 → 路由器缓存 → ISP DNS缓存 → 根域名服务器 → 顶级域名服务器 → 目标域名服务器 → 返回IP`

  1. 浏览器 DNS 缓存
  2. 操作系统中的 DNS 缓存
  3. 操作系统中 Hosts 文件
  4. 网络服务器，WIFI路由器 等缓存

知识点：

- 缓存机制：每个环节的缓存都有 TTL（生存时间），到期后会重新查询，避免 IP 变更导致解析失效。
- DNS 负载均衡：权威服务器可能返回多个 IP（对应不同地区的服务器），实现就近访问（如你在上海，返回上海机房的 IP）。
- HTTPS 与 DNS：HTTPS 会先进行 DNS 解析，再建立 TLS 连接（比 HTTP 多一步证书验证）。
- 优化点：使用 CDN（内容分发网络）、开启 DNS 预解析（`<link rel="dns-prefetch" href="xxx">`）可减少解析耗时。

### TCP 请求

核心流程：三次握手（建立连接）→ 数据传输 → 四次挥手（断开连接）

1. 三次握手：
   - 你：“喂，能听到吗？”（发送 SYN 报文，请求建立连接，序号为 x）
   - 朋友：“能听到，你能听到我吗？”（回复 SYN+ACK 报文，确认收到你的请求（ACK=x+1），同时发起自己的连接请求（序号 y））
   - 你：“能听到，开始说话吧！”（回复 ACK 报文，确认收到朋友的请求（ACK=y+1））

    为什么需要三次？互相确认都能发送也能接收有效的消息，避免 “失效的连接请求” 被服务器接收（如客户端发的请求超时后又到达服务器，服务器误以为是新请求，浪费资源）。

2. 数据传输：
   - TCP 将 HTTP 请求 / 响应数据拆分成多个 “数据段”（Segment），每个段都有序号和确认号，确保服务器按顺序重组。
   - 若服务器未收到某个段的确认（ACK），客户端会重传该段（超时重传机制）。
   - 同时通过 “流量控制”（避免服务器接收过快导致缓冲区溢出）和 “拥塞控制”（避免网络拥堵）优化传输效率。

3. 四次挥手：
   - 客户端：“我说完了，准备挂电话了”（发送 FIN 报文，请求断开连接）
   - 服务器：“收到，我再整理一下数据”（回复 ACK 报文，确认收到断开请求，此时服务器仍可发送剩余数据）
   - 服务器：“我也说完了，可以挂了”（发送 FIN 报文，告知客户端已无数据发送）
   - 客户端：“收到，挂了”（回复 ACK 报文，确认断开，等待 2MSL 后释放连接）

    四次挥手的原因：TCP 是 “半关闭” 状态 —— 客户端关闭发送通道后，服务器可能还在发送数据，需要分两步确认 “双方都无数据要发”。

### 渲染页面

浏览器接收服务器返回的响应体（主要是 HTML、CSS、JS、图片等资源）后，需要通过 “内核引擎”（如 Chrome 的 Blink、Firefox 的 Gecko）将其转化为用户看到的页面，核心流程是 **解析→构建→布局→绘制→合成**。

  1. 解析 HTML，构建 DOM 树
     - 浏览器逐行解析 HTML，将每个标签（如<div>）、文本、属性转化为 “DOM 节点”，并按层级关系组织成树状结构
     - 遇到 script 标签，则 DOM 树的构建会暂停
     - HTML 解析是 “增量解析”—— 浏览器边下载 HTML 边解析，无需等待整个 HTML 下载完成，提高渲染速度。
  2. 解析 CSS，构建 CSSOM 树
     - 浏览器解析 CSS 规则（如div { color: red; font-size: 16px; }），将其转化为 “CSSOM 节点”，按优先级（!important > 内联 > ID > 类 > 标签）组织成树状结构。
     - 解析 CSS 规则树时 js 执行将暂停，直至 CSS 规则树就绪
     - CSS 解析与 HTML 解析是 **“并行进行”** 的（不会等 HTML 解析完再解析 CSS），但 CSSOM 树构建完成前，浏览器不会开始渲染（因为渲染需要结合 DOM 和 CSSOM）。
  3. 结合 DOM 树和 CSS 规则树，生成渲染树 render tree
     - 浏览器将 DOM 树和 CSSOM 树进行 “匹配合并”，只保留 “可见节点”（如<head>里的节点、display: none的节点会被忽略），每个节点包含 “结构 + 样式” 信息。
     - 渲染树≠DOM 树 + CSSOM 树，而是 “筛选后的融合体”（只包含用户能看到的内容）。
  4. 布局 Layout/Reflow: 回流/重排，计算节点的位置和大小
     - 浏览器遍历渲染树，计算每个节点在屏幕上的 “坐标位置”（如左上角 x=10px，y=20px）和 “宽高”（如 width=200px，height=100px），这个过程也叫 “回流”。
     - 布局是 **“自上而下”** 的（从根节点开始，逐级计算子节点的位置），若节点位置变化，会触发 “回流”（重新计算），回流耗时较高，开发中需避免频繁修改宽高、位置等属性。
  5. 绘制 Repaint: 重绘，元素外观变化(颜色)
     - 浏览器根据渲染树的样式信息，将每个节点 “绘制” 到屏幕的像素缓冲区（如将文字绘制成红色、背景绘制成白色、图片绘制成对应像素），这个过程也叫 “重绘”。
     - 绘制是 “按层进行” 的（如文字层、背景层、图片层），重绘不影响节点位置，耗时比回流低，但频繁重绘也会影响性能。
  6. 合成 Composite: 合成，将绘制的像素缓冲区合并到屏幕上
     - 浏览器的 “合成线程” 将多个图层（如文字层、图片层）合并成一个 “最终图层”，并发送给 GPU（图形处理器），GPU 将最终图层显示在屏幕上。
     - 合成是性能优化的核心 —— 若能将动态内容（如动画）放在独立图层，可避免回流和重绘，只触发合成（性能最高），比如使用transform和opacity实现动画。

注意点：

- JS 的影响：JS 会阻塞 DOM 解析（因为 JS 可能修改 DOM/CSS，浏览器需暂停解析 HTML，先执行 JS），可通过defer（延迟执行）、async（异步执行）优化。
- 资源加载顺序：HTML→CSS→JS→图片（图片加载不阻塞 DOM 解析，但会阻塞渲染）。
- 性能优化方向：减少回流重绘（如使用class批量修改样式、避免table布局）、拆分 CSS（关键 CSS 内联）、懒加载图片、使用 CDN 加速资源加载。
