# 多因素认证与无密码时代 (MFA / Passwordless)

## 核心作用
在密码已遭泄露的最坏情况下，依然保障账户的绝对安全。在 2026 年，全面迈向抗钓鱼的无密码 (Passkeys) 时代是身份安全的重中之重。

## 实现原理
MFA 结合了知识（密码）、拥有物（手机/硬件 Token）和生物特征。现代 WebAuthn / Passkeys 标准基于公钥密码学：设备（如手机的 Secure Enclave）生成私钥并用生物识别解锁，服务端仅存储公钥。由于每次认证都绑定了具体的域名上下文，这从根本上杜绝了中间人钓鱼攻击。

## 主要防御手段
- 彻底防御凭证撞库 (Credential Stuffing)。
- 免疫针对密码的社工钓鱼与键盘记录木马。

## 漏洞与局限
- **传统 MFA 的脆弱性**：基于短信或 TOTP (Google Authenticator) 的 MFA 依然可以被实时的中间人钓鱼代理 (AitTM, 如 Evilginx2) 轻松绕过。
- **生态壁垒**：Passkeys 在跨平台（如苹果到安卓）同步和恢复机制上仍存在一定的用户体验摩擦。

## 典型工具
- **Authelia**: 开源的单点登录与 MFA 认证门户。
- **Keycloak**: 强大的企业级开源身份和访问管理系统。
- **Authentik**: 灵活性极高的现代身份提供商 (IdP)。

## 实践建议
部署 Authelia 容器，并结合 Nginx 的 Forward Auth 机制，为您本地的静态私有博客强制开启基于 FIDO2/Passkey 的无密码认证。

## 学习资源
- [FIDO Alliance 标准](https://fidoalliance.org/)
- [WebAuthn 开发者实战指南](https://webauthn.guide/)\n