---
title: 解决 Kali Linux 虚拟机鼠标不显示与高分屏图标太小问题
description: 本篇blog介绍如何在VMware中简单解决kali虚拟机中的两个显示问题
tags:
  - Linux
  - 排查
pubDate: 2026-09-10
cover: /covers/kali_problem_cover.png
draft: false
---
作者在更新kali虚拟机版本后，发现我的kali虚拟机无法显示鼠标，还以为是安装过程出错了，来来回回折腾了很久，最后才发现是一个很简单的问题 TAT，以及高分辨率屏幕下会导致图标和字体极小，其实解决方法很简单
# 鼠标不显示问题

## 原因

1. 如果虚拟机没有正确安装增强工具，光标指针往往无法正常同步与渲染
2. 也有可能宿主机的显卡驱动与虚拟机的3D加速冲突了，导致硬件光标渲染隐形了

## 解决方法

### 1.检查安装增强工具 

当前看不到鼠标，使用快捷键Ctrl + Alt + T打开终端，然后输入下列命令，安装虚拟机增强工具
```bash
sudo apt update
sudo apt install -y open-vm-tools open-vm-tools-desktop
sudo reboot
```

### 2. 关闭虚拟机软件的3D图形加速

将虚拟机关机，右键kali虚拟机，选择菜单栏中最底下的设置，找到显示，取消勾选“加速 3D 图形”，如图所示，然后重新开机
![](/images/3D图形加速关闭.png)
完成后，就可以看到鼠标了，但光标大小不太够，怎么调节呢？

### 3.切换鼠标主题和光标大小

打开终端输入 `xfce4-mouse-settings` 并执行
切换到主题(Theme)标签页
选择一个你认为明显的主题，并将光标大小调大即可

# 虚拟机中的缩放过小

Kali Linux 默认采用 Xfce 桌面环境，在 2K/4K 等高分辨率屏幕上未开启缩放时会导致所有图标和字体极小

## 解决方法

### 1.切换至kali官方HiDPI模式

kali有专门的适配高分辨率的工具，可以将图标，字体等放大两倍

打开终端，直接执行
```bash
kali-hidpi-mode
```
系统会提示切换到HiDPI模式，重启后即可生效，如果想复原标准比例，就重新执行上述命令即可

原本的比例大小：
![](/images/initial_kali_desltop.png)
执行命令后就会放大比例：
![](/images/new_kali_desktop.png)

### 2.通过Xfce外观设置进行"2x 窗口缩放"

如果习惯了图型界面修改，就打开终端，输入`xfce4-appearance-settings`，会弹出下图窗口
![](/images/Pasted%20image%2020261006233635.png)
然后选择setting，选择window Scaling，选择缩放倍数2x，即可
![](/images/Pasted%20image%2020261006233724.png)

现在鼠标光标显示问题和缩放比例问题都解决啦！恭喜！！