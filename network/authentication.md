# Authentication
> 身份验证

## AUTH



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
