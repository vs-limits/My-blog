---
title: Obsidian在PC端与移动端的同步问题解决
description: 介绍如何解决不想订阅Obsidian官方云服务，而是通过第三方插件实现同步
pubDate: 2026-09-30
tags:
  - 写作流
  - 网络
  - 知识管理
cover: /covers/obsidian_sync_cover.png
draft: false
---
作者本人经常使用的笔记软件是Obsidian，中文译名叫黑曜石，听起来很酷炫吧！

# 为什么会有同步问题？

我相信使用过Obsidian的人看到这篇文章的第一反应就是先问一句"为什么会有同步问题？"

确实Obsidian官方订阅中是由提供云同步服务的，而且只要4美元/月，但是作为一名大学生，还是互联网相关专业的我，觉得没有必要每个月抽出这看似很“少”的4美元，所以我探索了一个免费的同步方法

# 那这个方法该怎么实现呢？

这个方法要操作三个部分，我们一个一个来，先做点前置准备

先把Obsidian中的笔记备份，然后为服务器准备一个域名，例如sync.example.com(免费域名获取方法这里不再赘述，说不定下次更新就是~)，把它的DNS A记录指向服务器公网IP，且设置为仅DNS only(cloudflare就是灰云状态)

Obsidian的云同步，其实就是使用了它部署好的云服务器作为中转，我们就是要把这个云服务器替换成我们自己的服务器，所以第一步就是部署好服务器

## 服务器部署

服务器的来源有三个方式
1. 花钱购买服务器(建议海外服务器)
2. 阿里云的学生优惠 -- 提供1年的服务器(本次使用的)
3. 自己组建物理机作为服务器

我的服务器配置是debian - 1核2G（如果是不同系统则需读者自行修改相关命令），入和出方向都放行80和443端口

### 安装服务

安装Docker Engine和Docker Compose插件，建立对应目录

```bash
sudo mkdir -p /opt/fast-note-sync
sudo chown "$USER":"$USER" /opt/fast-note-sync
cd /opt/fast-note-sync
mkdir -p storage config
nano docker-compose.yaml
```

在docker-compose.yaml配置文件中写入

```yaml
services:
  fast-note-sync-service:
    image: haierkeys/fast-note-sync-service:latest
    container_name: fast-note-sync-service
    restart: unless-stopped
    ports:
      - "127.0.0.1:9000:9000"
    volumes:
      - ./storage:/fast-note-sync/storage
      - ./config:/fast-note-sync/config
```

(nano可能不是很好用，这里作者提醒一下，复制粘贴好内容后，Ctrl+X，输入Y，然后回车，再回车即可)

启动服务

```bash
docker compose up -d
docker compose logs -f
```

### HTTPS反向配置

接下来就是配置HTTPS反向代理，这也是把作者绕晕的地方，但是我已经理清了，这次作者使用的是1panel的OpenResty应用进行配置的(这里1panel的部署和配置我也不再赘述，也说不定下次就更新了~)

#### 准备Acme账户

进入1panel页面，我们需要先准备证书，点击网站中的证书，点击Acme账户，点击创建，提供邮箱，选择Let’s Encrypt类型，密钥类型选择EC 256

#### 准备DNS账户

还是证书页面，点击上方的DNS账户，点击创建，填写名称，类型选择你所使用的DNS代理，作者这里选择cloudflare，填写你常用的邮箱

然后到cloudflare页面，点击右上角的用户头像，选择profile，进入个人页面后，打开左侧导航栏，选择API token，进入页面后，点击Create Token，选择Edit zone DNS模板

进入页面后，Permission一栏中添加一份Zone - Zone - Read，Zone Resources一栏中最后一个选择框选择本次使用的根域名，检查无误后，点击下一步，显示图中结构即可

![Cloudflare Token 配置](/images/Token设置.png)

最后创建Token，并复制到1panle页面，填入API Token框中并创建DNS账户

#### 申请证书

在证书页面，点击申请证书，主域名填写本次使用的子域名，填写一个备注，选择Acme账户，密钥算法选择EC 256，验证方式选择DNS账号，勾选自动续签，即可确认申请证书了(过程中如果申请失败，可以点击对应证书的右侧申请按钮，进行重新申请，并且能看到申请日志，具体情况具体分析)

#### HTTPS设置

点击网站中的创建网站，选择反向代理，域名填写你准备好的域名，代理地址填写`127.0.0.1:9000`，创建网站后点击配置进入该站点的HTTPS/SSL配置，HTTP选项选择访问HTTP自动跳转HTTPS，启用HSTS，SSL选项选择已有证书，选择已有的Acme账户，证书选择创建好的证书，SSL协议设置只勾选TLS 1.3/1.2，最后保存设置

这时测试一下是否能正常响应
```bash
curl -I https://sync.limits.cc.cd
```
如果返回200，301说明HTTPS已经接通，此时访问对应域名，就可以看到登录页面了

![Web 登录页面](/images/Sync登录页面.png)

先创建一个账号，再登录进入控制台

#### 关闭注册功能

注册完个人账号后，回到服务器，直接执行下列命令，修改配置文件中的注册功能
```bash
cd /opt/fast-note-sync && \
cp config/config.yaml "config/config.yaml.bak.$(date +%Y%m%d%H%M%S)" && \
if grep -qE '^[[:space:]]*register-is-enable:' config/config.yaml; then
  sed -i -E 's/^([[:space:]]*register-is-enable:).*/\1 false/' config/config.yaml
elif grep -qE '^user:' config/config.yaml; then
  sed -i '/^user:/a\  register-is-enable: false' config/config.yaml
else
  printf '\nuser:\n  register-is-enable: false\n' >> config/config.yaml
fi && \
grep -n -A 3 '^user:' config/config.yaml && \
docker compose restart
```
关闭注册功能后，就是准备同步笔记内容了

## 第三方插件安装

进入Obsidian应用，点击设置，选择第三方插件，点击浏览社区，搜索栏搜索Fast Note Sync，作者是：HaierKeys(如果加载很慢的话，建议使用点魔法)

安装完成后，回到Web页面，选择左侧导航栏中的第二个按钮(笔记库)，点击笔记库管理一行中的加号，添加一个笔记库，填写库名，然后点击授权Obsidian，根据自己的需要选择令牌备注，好区分，点击生成授权令牌，简单的方式就是点击方式一中的一键授权，授权完成就会自动开始同步上传文件到服务器

接下来是移动端的Obsidian插件安装

打开你的手机/平板，下载Obsidian软件，下载完成后打开Obsidian，创建一个仓库文件夹，然后进入笔记库，点击右下角的设置，找到第三方插件，点击浏览社区，搜索栏搜索Fast Note Sync，作者是：HaierKeys(如果加载很慢的话，建议使用点魔法)，安装完成后，进入插件的配置页，点击远端配置

回到Web端，复制方式二的JSON信息，发送到手机/屏蔽上，复制JSON，回到远端配置页，点击粘贴服务端授权配置，配置完成后就会自动同步笔记内容了，每次关闭和打开都会上传与同步

至此，你就白嫖了Obsidian官方4美刀/月的云存储服务了！恭喜！！

![测试图片](/images/test.png)