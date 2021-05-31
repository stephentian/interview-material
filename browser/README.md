# 浏览器相关

- [浏览器相关](#浏览器相关)
  - [浏览器缓存](#浏览器缓存)
    - [http 缓存](#http-缓存)
    - [本地缓存](#本地缓存)
  - [浏览器内核](#浏览器内核)
  - [web worker](#web-worker)



## 浏览器缓存

### http 缓存

- 强缓存
  - expires
    - 过期时间(http1.0)
    - 绝对时间，修改本地客户端就没用了
  - cache-control
    - http1.1
    - max-age 相对时间
- 协商缓存
  - etag & if-none-match
    - 标志资源是否变化
  - last-modified & if-modified-since

缓存机制：  
- 强缓存生效则使用强缓存，失效则进行协商缓存
- cache-control 优先级高于 expires; etag 优先级高于 last-modified
- 协商缓存有服务器决定。生效则返回 304。

### 本地缓存

- localStorage
  - 前端设置，长期存储，要手动清除。存储格式是字符串，注意存对象取出来要格式化。
- sessionStorage
  - 前端设置，会话关闭则消失
- cookie
  - 后端设置，保存则客户端本地

## 浏览器内核

火狐浏览器: Gecko
Safari: webkit

## web worker