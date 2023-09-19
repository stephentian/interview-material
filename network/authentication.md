# Authentication
> 身份验证

## OAUTH

第三方登录鉴权方式，需要先去 开放平台注册应用获取 应用 ID 和 APP Secret 密钥。

流程
比如通过微博登录网站 A
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
3. 客户端保存 token，以后每次请求，在 Authorization 头部使用 Bearer 模式添加JWT，格式 Authorization: Bearer <token>
4. 服务端通过 token 判断是否鉴权，是否过期；返回响应数据

特点：简洁，都在 header 里；包含信息丰富，都在 payload 里，减少了需要查询数据库的需要

JWT 结构

JWT 内容用 . 连接成三个部分信息
- Header 头部：Base64Url （token 类型，加密算法）
- Payload 负载：Base64Url（用户信息）
- Signature 签名：算法，密钥
  
## session
