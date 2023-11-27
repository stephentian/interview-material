# Authentication

> 身份验证

- [OAUTH](#oauth)
- [JWT](#jwt)
- [session](#session)
- [总结](#总结)

## OAUTH

第三方登录鉴权方式，需要先去 开放平台注册应用获取 应用 ID 和 APP Secret 密钥。

流程： 比如通过微博登录网站 A

1. 用户点击 A 上的微博登录，跳转微博授权页，跳转链接：`https://api.weibo.com/oauth2/authorize?app_id=123050457758183&redirect_uri=http://abc.com`
   - app_id: 申请授权应用 id
   - redirect_uri: 授权成功跳转地址
2. 跳转微博，授权成功，在跳转返回地址 后面添加 code 参数：`http://abc.com?code=12412412`
3. A 网站，通过 code 请求接口获取 token。
4. 服务端下发 token，客户端保存 token 信息，请求携带 token，登录成功。

## JWT

流程：

1. 用户输入用户名，密码
2. 服务器鉴权，服务器给客户端分配一个加密的 token
3. 客户端保存 token，以后每次请求，在 Authorization 头部使用 Bearer 模式添加JWT，格式 `Authorization: Bearer <token>`
4. 服务端通过 token 判断是否鉴权，是否过期；返回响应数据

特点：简洁，都在 header 里；包含信息丰富，都在 payload 里，减少了需要查询数据库的需要

JWT 结构

JWT 内容用 . 连接成三个部分信息

- Header 头部：Base64Url （token 类型，加密算法）
- Payload 负载：Base64Url（用户信息）
- Signature 签名：算法，密钥
  
## session

基于 cookie 和 sessionId

1、用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session
2、请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器
3、浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名
4、当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

## 总结

Session 是一种认证机制
Token、JWT是认证授权机制
OAuth2 是授权框架
