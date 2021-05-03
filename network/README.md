<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

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

# 网络通信

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

#### JSONP

在出现 CORS 之前，一直使用 JSONP 跨域通信；
利用的是 `script` 的异步加载，读取文件，
在本地创建一个 `script` 标签，然后加载。

#### Hash

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

#### postMessage

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

#### WebSocket

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

#### CORS

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
