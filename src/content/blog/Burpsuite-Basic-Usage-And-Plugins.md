---
title: Buepsuite的基本功能使用和插件推荐
description: 本篇博客将为你介绍burpsuite的各个模块的基本使用和几个推荐插件
tags:
  - 软件
  - 网安
draft: false
cover: /covers/Burpsuite_pro_cover.png
pubDate: 2026-09-20
---
# 工作原理

```
浏览器/客户端 --> 本地监听(127.0.0.1) --> Burp Suite代理 --> 转发/篡改请求 --> 目标Web服务器
```

# 基础配置方式

## 方式一：内置浏览器

打开Burp Suite，切换到Proxy -> Intercept，点击Open Browser按钮

内置chorme浏览器已经装好了CA证书并自动配置了代理，无需任何系统代理与证书设置
![](/images/inside_chrome.png)

## 方式二：外部浏览器配置

设置代理将浏览器代理指向127.0.0.1:8080，作者使用的是FoxyProxy
![270](/images/FoxyProxy.png)

![](/images/FoxyProxy_setting.png)
之后就是安装CA根证书

# Proxy 代理拦截与分析

主要作用是抓取流量，请求与响应的拦截和实时篡改，Intercept是拦截控制开关，HTTP history是请求/响应历史记录

该部分可以做一些前端JS校验，观察业务使用的接口，传参和cookie，抓取请求包后可以对包内信息进行修改，再重新发包

使用：打开拦截开关，页面触发请求后，burpsuite就会拦截流量并停在窗口中，此时就可以查看流量包，并篡改，再重发

Forward是放行，Drop是丢弃包，Ctrl+R是发送到Repeater，Ctrl+I发送到Intruder

# Target 目标资产界定

主要作用是展示目标站点的目录拓扑结构，界定测试资产范围

一般是为了防止测试过程中误测了其他外链和梳理URL结构和功能业务图

打开site map，打开内置浏览器，在浏览器中访问你的测试目标，然后返回burpsuite就能看到访问的URL信息
![](/images/Target_part.png)
在左边目录中找到目标主域名，右击该域名，将其添加进范围

另一种方法：进入范围配置(Scope)选项卡
![](/images/Scope_part.png)
然后点击第一个框左边的添加按钮，添加目标域名

# Repeater 重放器

主要作用是对单请求的反复修改，发送和分析，一般用于手测漏洞

可以针对SQL注入，XSS，逻辑越权、SSRF、文件上传等核心漏洞，调试不同测试参数值返回的HTTP码和回显
![](/images/Reapeater_part.png)
使用：在Proxy中选中一个流量包，将其发送到重放器中，在request区域修改参数，点击send，在response区域能看到美化/Raw/Hex/页面渲染，页面渲染能直接看到页面回显

# Intruder 自动化爆破

主要作用是自动化高并发发送参数变化的请求包

例如在登录账号/密码爆破、手机验证码，敏感路径/后台接口扫描、ID遍历(越权批量发现)，参数模糊测试探测WAF规则，特殊字符过滤情况等
![](/images/Inturder_part.png)
1. Sniper狙击手：单字典，如果有多个标记变量，依次替换第一个，第二个等
2. Battering ram攻城锤：单字典，所有标记位置同时填入同一个payload
3. Pitchfork音叉：多字典，各个标记位置同步按行取值
4. Cluster Bomb集束炸弹：多字典，笛卡尔积交叉穷举

使用：选中请求发送到Intruder，由鼠标圈选要变动的参数位置，点击添加payload位置，在payload选项卡中，选择payload类型，设置处理规则(例如自动base64编码，URL编码)，点击右上角Start attack，最终分析结果，点击响应长度或者状态码进行排序，快速定位成功的payload

# Scanner 漏洞扫描器

主要作用是用爬虫获取信息和安全漏洞扫描

1. 被动审计：仅分析走过代理的流量，不额外发攻击包，识别敏感信息泄露，缺失安全头，已知CVE组件
2. 主动审计：针对特定请求主动注入大量攻击payload，自动扫描SQLi、XSS、OS命令注入等高危漏洞
![](/images/Scanner_part.png)
在HTTP history或是重放器中右键选中流量，选择最顶上的三个扫描选项

# Decoder 编解码工具箱

主要作用就是对信息加解密，编解码，散列值计算

一般用在需要URL 解码/编码、Base64 还原、HTML 实体解析、Hex 查看、MD5/SHA256 哈希计算的地方
![](/images/Decoder_part.png)

# Comparer 差异对比器

主要作用：文本级或字节级的双向对比

需要对比一些只有微小变动的响应包时使用，例如布尔盲注测试：对比 `and 1=1` 与 `and 1=2` 时响应包的极其微小的字符变动和权限测试：对比普通用户和管理员访问同一接口的返回体差异
![](/images/Comparer_part.png)

# Burp Collaborator 外带通道测试

作用是解决无回显漏洞的探测问题

当目标系统不返回任何执行结果，但是有外带通道，例如DNS解析和HTTP外联等，就能证明漏洞存在
![](/images/Collaborator_part.png)
点击Collaborator，点击Copy to clipboard获得一个独一无二的专属子域名，将该域名注入到测试参数中，例如SSRF，XSS，CMDi等，点击 Poll now，如果面板收到了目标的 DNS 查询或 HTTP 请求，即确凿证实漏洞

# Logger & Sequencer 记录和统计

Logger：完整记录 Burp 内部发出的**所有** HTTP 流量，是排查插件工作异常和流量复现的最佳位置

Sequencer：通过统计学模型测试 Token、SessionID 等关键随机数的熵值，用于验证随机数发生器是否存在被预测的安全隐患

# 插件推荐
插件可通过 Burp 的 **Extensions -> BApp Store** 直接一键安装，或从 GitHub 下载 `.jar` 包后通过 **Extensions -> Installed -> Add** 手工加载

## 越权测试：Autorize
水平/垂直越权神器。配置低权限或未登录账号的 Cookie/Header，浏览器使用高权限账号点击业务，插件自动重放并高亮标出存在越权的接口
![](/images/Autorize_plugin.png)

## 敏感信息提取：HaE(Highlight and Extractor)
基于自定义正则，在 HTTP 历史中高亮标记并提取敏感信息，例如身份证号，API-Key等敏感信息
![](/images/HaE_plugin.png)

## 身份验证测试 JWT Editor
针对 JSON Web Token 的自动化识别、签名伪造、None 算法绕过、空密钥爆破与 Claims 篡改
![](/images/JWT_Editor_plugin.png)

## 反序列化/中间件攻击 J2EEScan
针对 Java Web 环境的主动审计扩展，覆盖 Struts2、Spring Boot、Fastjson、Shiro、WebLogic 等历史已知高危漏洞探测
![](/images/J2EEscan_plugin.png)
