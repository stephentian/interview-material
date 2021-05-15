# 网络通信

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [网络通信](#%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1)
  - [什么是同源策略及限制](#%E4%BB%80%E4%B9%88%E6%98%AF%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5%E5%8F%8A%E9%99%90%E5%88%B6)
  - [前后端如何通信](#%E5%89%8D%E5%90%8E%E7%AB%AF%E5%A6%82%E4%BD%95%E9%80%9A%E4%BF%A1)
  - [如何创建 Ajax](#%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA-ajax)
  - [什么是跨域](#%E4%BB%80%E4%B9%88%E6%98%AF%E8%B7%A8%E5%9F%9F)
  - [跨域通信的几种方式](#%E8%B7%A8%E5%9F%9F%E9%80%9A%E4%BF%A1%E7%9A%84%E5%87%A0%E7%A7%8D%E6%96%B9%E5%BC%8F)
    - [JSONP](#jsonp)
    - [Hash](#hash)
    - [postMessage](#postmessage)
    - [WebSocket](#websocket)
    - [CORS](#cors)
  - [为什么 CORS 可以跨域(原理)？](#%E4%B8%BA%E4%BB%80%E4%B9%88-cors-%E5%8F%AF%E4%BB%A5%E8%B7%A8%E5%9F%9F%E5%8E%9F%E7%90%86)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 什么是同源策略及限制

同源策略限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。
这是一个用于隔离潜在恶意文件的关键的安全机制。

源：协议、域名、端口。
默认端口：80

不同源之间的限制，比如：
Cookie、LocalStorage 和 IndexDB 无法读取
DOM 无法获取
AJAX 无法发送

## 前后端如何通信

1. Ajax
  同源下的通信

2. WebSocket
  不限制

3. CORS
  支持不同源通信

## 如何创建 Ajax

```js
let request = new XMLHttpRequest
// IE 
// new ActiveXObject('Microsoft.XMLHTTP')
request.open('GET', url, true)
request.onreadystatechange = function() {
  if(request.readyState === 4 && request.status === 200) {
    // ...
  }
}
request.send()

```

## 什么是跨域

两个不同源的页面进行通信，浏览器就会显示跨域

## 跨域通信的几种方式

1. JSONP

2. Hash

3. postMessage

4. WebSocket

5. CORS

一、 JSONP

在出现 CORS 之前，一直使用 JSONP 跨域通信；
利用的是 `script` 的异步加载，读取文件，
在本地创建一个 `script` 标签，然后加载。

二、 Hash

页面 A 通过iframe或frame嵌入了跨域的页面 B

```
// 在A中伪代码如下：
var B = document.getElementsByTagName('iframe');
B.src = B.src + '#' + 'data';

// 在B中的伪代码如下
window.onhashchange = function () {
  var data = window.location.hash;
};
```

三、 postMessage

窗口A(http:A.com)向跨域的窗口B(http:B.com)发送信息

```
A
window.postMessage('data', 'http://B.com');
```

// 在窗口 B 中监听

```
B
window.addEventListener('message', function (event) {
    console.log(event.origin);
    console.log(event.source);
    console.log(event.data);
}, false);
```

四、 WebSocket

```
var ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = function (evt) {
    console.log('Connection open ...');
    ws.send('Hello WebSockets!');
};

ws.onmessage = function (evt) {
    console.log('Received Message: ', evt.data);
    ws.close();
};

ws.onclose = function (evt) {
    console.log('Connection closed.');
};
```

五、CORS

全称是"跨域资源共享"(Cross-origin resource sharing)
可以理解为支持 跨域 的 ajax

```
fetch('/some/url/', {
    method: 'get',
}).then(function (response) {

}).catch(function (err) {
  // 出错了，等价于 then 的第二个参数，但这样更好用更直观
});
```

比如 vue 和 react 中的 axios

## 为什么 CORS 可以跨域(原理)？

浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。
因此，实现 CORS 通信的关键是服务器。
只要服务器实现了CORS接口，就可以跨源通信。

## REST

表现层状态转移(Resource Representational State Transfer)

描述的是在网络中client和server的一种交互形式，帮助设计 RESTful API。

“古代”网页是前后端不分离的，比如 PHP、JSP 等，后面前后端分离，加上出现了 IOS 和 Android，就需要一套统一的提供服务的接口，RESTful 就是更好的选择。

比如：

- URI 使用名词而不是动词，看 URL 就知道要什么
- 用 HTTP 方法描述操作；GET 获取，POST 创建，PUT 更新，DELETE 删除等
- 保证 HEAD 和 GET 安全，不会改变资源状态（污染）
- 用 HTTP Status Code 传递 Server 的状态信息；
  - 200 Success
  - 500 Server Error
- 请求体使用 json 格式

## TCP/IP

## HTTP

HTTP：HyperText Transfer Protocol 超文本传输链接

HTTP 请求报文分为三部分：请求行、请求头、请求体

请求行：请求方法(method) 请求地址(path) 协议格式

请求头：

- Accept: value
- Authorization: value2
- Cache-Control: no-cache

请求体

e.g.

```text
　　POST/GET http://download.microtool.de:80/somedata.exe 
　　Host: download.microtool.de 
　　Accept:*/* 
　　Pragma: no-cache 
　　Cache-Control: no-cache 
　　Referer: http://download.microtool.de/ 
　　User-Agent:Mozilla/4.04[en](Win95;I;Nav) 
　　Range:bytes=554554- 
```

请求方法:

- GET
- POST
- PUT
- DELETE
- PATCH
- HEAD
- OPTIONS
- CONNECT
- TRACE

### HTTP 状态码

响应分为五类：

- 100-199：信息响应
- 200-299：成功响应
- 300-399：重定向
- 400-499：客户端错误
- 500-599：服务端错误

| 状态码 | 含义                                                        |
| ------ | ----------------------------------------------------------- |
| 100    | Continue                                                    |
| 101    | 切换协议                                                    |
| 200    | OK 请求成功                                                 |
| 206    | 返回一部分资源                                              |
| 301    | 永久重定向                                                  |
| 302    | Found  临时重定向                                           |
| 304    | Not Modified 内容未变化，客户端访问缓存资源，和协商缓存有关 |
| 400    | Bad Request 参数有错                                        |
| 401    | Unauthorized 未验证                                         |
| 403    | Forbidden 禁止访问                                          |
| 404    | Not Found 未找到资源                                        |
| 500    | Internal Server Error 服务器错误                            |
| 502    | Bad Gateway                                                 |
| 504    | Gateway Time-out 请求超时                                   |

### HTTP 优化

主要两个因素：带宽和延迟

- 带宽
- 延迟
  - **浏览器阻塞**：浏览器对同一个域名，同时只能有 4 个连接(根据浏览器内核不同有所差异)，超出最大连接限制，后续请求就会阻断
  - **DNS 查询**: 利用 DNS 缓存
  - **建立连接**: HTTP 是基于 TCP 的，最快也要在第三次握手是携带 HTTP 请求报文。

## HTTP2.0

## HTTP 中 GET 和 POST 有什么区别？

GET 和 POST 是 HTTP 协议中的两个方法，在 HTTP 协议中的语义不同：

- GET: 获取资源
- POST: 创建/更新资源

一、**浏览器端**

- GET
  - 因为是读取资源，所以资源可以缓存，URL 可保存书签
  - 发送请求没有 Body (但是在 RESTful API, 参数可以放 Body 里，要看后端怎么处理)
  - 参数在 URL，因为 URL 变化才能触发浏览器主动发送 GET
  - 可以回退
  - URL 长度限制，浏览器做的
  - 发一个请求
- POST
  - 不能保存书签，不然一打开书签就发送 POST 创建/修改资源请求。比如页面有表单，  
    刷新浏览器会出现一个提示弹窗，询问 “确认重新提交表单”
  - 参数也能放 URL
  - 不可以回退
  - 有些浏览器发两个请求，先发 header，响应 100-continue 再发 body 数据(Firefox 火狐浏览器就发送一次请求)

二、**接口**

由于 HTTP 协议并没有限制 GET 一定没有 Body, POST 一定不能把参数放 URL 的 queryString 上。

这样太自由了，而且后端接口需要对接前端，IOS，Android 端等，所以需要一些特定的接口风格和规范。

最火的就是 REST，REST 约定了GET 是获取，POST 是创建。

三、**安全性**

GET

- URL 传输，更容易看到

POST

- 用 Body 传输，相对更安全

但是 HTTP 是明文协议，每个 HTTP 请求都会在网络上明文传播，不管是 URL 还是 Body。

如果要避免数据被窃取，就要使用 HTTPS，从客户端到服务器端对端加密。

## 从 url 输入 到显示网页都发生了什么？
