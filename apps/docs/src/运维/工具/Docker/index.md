# Docker 容器

## 一、环境搭建

1. 下载 `RHEL8.9` 系统

::: tip 拓展

> [去红帽官网](https://access.redhat.com/)：红帽官网注册、登陆之后, 因为不方便找下载界面，所以直接点击下面的链接跳转到下载界面。（一定需要先登录，才能跳转下载页面！！！）

> 推荐：[登陆之后跳往下载网址](https://access.redhat.com/downloads/content/rhel)

:::

> 进入下载界面后，下载离线安装的系统版本，选择 `Offline Install Images` 下面的 `红帽系统版本`.

2. 安装

> 安装过程中的关键设置参考如下：

> 只勾选四项：
>
> - 安装目的地：默认
> - 时区：亚洲/上海
> - 软件选择：最小化安装
> - root 密码：123456

![系统安装配置界面](/pictures/linux云计算/系统安装配置界面.png)

> 篇幅太长，网上也有教程，如果不会请参考网上教程。此处略...

3. 配置

> 离线安装的 `Red Hat Enterprise Linux 8.9 Binary DVD` 的镜像，安装的是 `无界面` 的 `linux` 系统，如果进入系统是黑色的界面也不要感到奇怪，系统启动后会提示你输入`登录名`和`密码`，`用户名`是安装过程中系统默认内置的`root`用户名，`密码`是安装过程中你自己设置的`xxx`密码。(密码提示不对的话，建议按`功能区`下面的`数字键盘`，省得不知道数字键盘锁是否因为被锁上了没输入密码而一直登录不了系统！！！)

> `进入了系统，那么开始正式配置`：

- `系统-网络配置`

::: code-group

```bash [网卡的命令行配置方式]
# 一键配置 静态IP地址 并 启用
$ nmcli c delete ens160     # 删除默认的系统网络配置文件
$ nmcli c show              # 如果不知道系统网络配置对象的名称，可以查看一下
# /etc/sysconfig/network-scripts/网卡文件
$ nmcli c add type ethernet con-name "static" ifname ens160 ipv4.addresses 10.0.0.2/24 gw4 10.0.0.254 ipv4.dns "8.8.8.8 114.114.114.114" ipv4.method manual autoconnect yes && nmcli c up static
$ systemctl restart NetworkManager      # 上面执行完看是否生效，如果没有生效的话，重启网络服务
```

```bash [网卡的文件配置方式]
$ vi /etc/sysconfig/network-scripts/ifcfg-网卡名
# 编辑如下内容
TYPE=Ethernet
BOOTPROTO=static
DEFROUTE=yes
NAME=网卡名称
DEVICE=网卡名称
ONBOOT=yes
IPADDR=10.0.0.2
NETMASK=255.255.255.0
GATEWAY=10.0.0.254

$ systemctl restart NetworkManager  # 重启网络管理服务
```

:::

- `系统 DNS 配置`

::: code-group

```bash [逐行写入]
$ cat > /etc/resolv.conf << EOF
> nameserver 223.5.5.5
> nameserver 114.114.114.114
> EOF
$ ping www.baidu.com        # 看是否 ping 通
```

```bash [通过 vi 写入]
# vi /etc/resolv.conf
nameserver 223.5.5.5
nameserver 114.114.114.114
```

:::

- 使用 `xshell` 或 `WindTerm` 工具远程连接系统

::: info 远程工具推荐：

> `XShell`：[去官网下载](https://www.xshell.com/zh/xshell/)

> `Tabby`：[去官网](https://tabby.sh/)

> `WindTerm`(推荐 ⭐)：[去官网下载](https://kingtoolbox.github.io/)

> `Github`(备用 🍭)：[去 github](https://github.com/KingToolBox/WindTerm)

:::

4. `系统-基本配置`

- 系统语言

```bash
$ localectl set-locale LANG="en_US.UTF-8"
$ echo 'export LANG=en_US.UTF-8' >> /etc/profile
# 检查确认是否配置完成
$ echo $LANG
```

- 修改主机名

```bash
$ hostnamectl set-hostname docker-学号
```

- `关闭系统防火墙`

```bash
$ systemctl disable firewalld --now     # 禁用防火墙（立即生效）
$ systemctl status firewalld            # 检查防火墙状态
```

- `关闭SELinux安全策略`

::: code-group

```bash [临时关闭]
$ setenforce 0
# 检查是否关闭
$ getenforce
```

```bash [永久禁用]
# 关闭SELinux
$ sed -i.bak 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
# 验证
$ grep SELINUX=disabled /etc/selinux/config
```

:::

- 本地 yum 源仓库配置

::: code-group

```bash [逐行写入]
$ rm -f /etc/yum.repos.d/*
$ cat >> /etc/yum.repos.d/local.repo << EOF
> [BaseOS]
> name=BaseOS
> baseurl=file:///mnt/BaseOS
> gpgcheck=0
> enabled=1
> [AppStream]
> name=AppStream
> baseurl=file:///mnt/AppStream
> gpgcheck=0
> enabled=1
> EOF

```

```bash [通过 vi 写入]
# vi /etc/yum.repos.d/local.repo
[BaseOS]
name=BaseOS
baseurl=file:///mnt/BaseOS
gpgcheck=0
enabled=1
[AppStream]
name=AppStream
baseurl=file:///mnt/AppStream
gpgcheck=0
enabled=1
```

:::

> 此时 `右击当前虚拟机的选项卡` > `虚拟机设置` > `CD/DVD` > `设备状态` 勾选为 `已连接` 状态

```bash
# 接着再执行下面的命令，然后重启一下设备
$ mount /dev/cdrom /mnt
$ yum clean all && yum makecache
$ echo '/dev/cdrom  /mnt    iso9660     loop    0   0' >>  /etc/fstab
```

- 安装常用软件

```bash
$ yum install vim lrzsz tree nc telnet wget lsof chrony bash-completion tcpdump psmisc sysstat net-tools unzip -y
```

- 配置与阿里时钟服务器同步

::: code-group

```bash [逐行写入]
$ cat > /etc/chrony.conf << EOF
> server ntp.aliyun.com iburst
> stratumweight 0
> driftfile /var/lib/chrony/drift
> rtcsync
> makestep 10 3
> bindcmdaddress 127.0.0.1
> bindcmdaddress ::1
> keyfile /etc/chrony.keys
> commandkey 1
> generatecommandkey
> logchange 0.5
> logdir /var/log/chrony
> EOF

# 启动chronyd服务
$ systemctl enable chronyd --now

# 验证是否生效
$ chronyc sources
```

```bash [通过 vi 写入]
# vi /etc/chrony.conf	将下面内容添加到该文件的最后
server ntp.aliyun.com iburst
stratumweight 0
driftfile /var/lib/chrony/drift
rtcsync
makestep 10 3
bindcmdaddress 127.0.0.1
bindcmdaddress ::1
keyfile /etc/chrony.keys
commandkey 1
generatecommandkey
logchange 0.5
logdir /var/log/chrony
```

:::

5. 额外添加 `一块 10G 数据盘`

::: warning 注意

> linux 开机新添加的硬盘名称很可能是 `sdb`，如果关着机再去添加硬盘，此时很可能是叫 `nvme0n1` 的设备名称（在 `/dev` 设备目录下），所以在添加完磁盘设备后可以用命令 `lsblk` 查看一下硬盘设备的名称是什么，再接着下面对 `sdb` 的操作。

:::

> 第一步：`右击当前虚拟机的选项卡` > `设置`中添加硬盘

```bash
# 重启虚拟机
$ reboot
# 重启之后
$ lsblk     # 查看新添加的硬盘
# 此时发现多了一块 10G 的硬盘
```

> 系统里格式化并挂载至 /app

```bash
$ mkfs.xfs /dev/sdb     # 格式化
$ mkdir /app            # 创建挂在目录
# 开机自动加载该驱动，写入文件
$ echo '/dev/sdb /app xfs defaults 0 0' >> /etc/fstab
$ mount -a
$ systemctl daemon-reload

# 检查是否挂载
$  df -h
# /dev/sdb 10G 104M 9.9G 2% /app
```

- 完整克隆对这台虚拟机进行备份

## 二、安装 Docker

::: tip 推荐

> 去看看：[阿里云镜像源](https://developer.aliyun.com/mirror/)

> yum 源下载链接：`https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo`

:::

- 关闭 `swap`

```bash
$ swapoff -a
# 关闭开机自启
# 注释/etc/fstab中的swap行
$ vim /etc/fstab
# /dev/mapper/rhel-swap none swap defaults 0 0

```

- 卸载原来自带的`Docker`

```bash
$ yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

- 安装必要的一些系统工具

```bash
$ yum install -y yum-utils device-mapper-persistent-data lvm2
```

- 添加阿里软件源仓库

```bash
$ yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
$ sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
$ yum makecache        # 更新仓库源
```

- 安装 `Docker-CE`

```bash
$ yum -y install docker-ce
# 开启 Docker 服务，并设置自启
$ systemctl enable docker --now
```

- `Docker` 安装检查

```bash
$ docker version
# 验证运行helloworld镜像
$  docker run hello-world
# 验证运行一个Ubuntu容器，并打印出当前系统时间
$ docker run -it ubuntu bash
$ # date
```

## 三、完整安装

::: tip 更多详情
[docker 安装教程](/pdf/docker安装.pdf)

[docker 快速入门](/pdf/docker快速入门.pdf)
:::

![DK详细安装](/pictures/linux云计算/DK详细安装.png)

## 自定义网络模式

```bash
$ docker network --help
$ docker network create mynet
$ docker network ls
$ docker pull wordpress
$ docker pull mysql
$ docker run -d --name wp -p 80:80 --network mynet wordpress
$ docker run -d --name wp_mysql -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=wordpress --network mynet mysql		# 要先初始化
$ brctl show	# 查看网桥
```
