
# 部署指南

## 前提条件

1. 确保您有服务器的SSH访问权限
2. 确保服务器已安装Node.js和npm
3. 确保服务器已安装PM2（进程管理器）

## 服务器配置

在部署之前，请确保您已经：

1. 在服务器上安装Node.js和npm：
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. 在服务器上安装PM2：
   ```bash
   sudo npm install -g pm2
   ```

3. 在服务器上放行必要的端口（例如3000端口）：
   - 登录您的云服务器控制台
   - 在安全组设置中添加规则，放行3000端口

## 部署步骤

1. 确保您已经配置好SSH密钥，以便无需密码登录服务器

2. 给部署脚本添加执行权限：
   ```bash
   chmod +x deploy.sh
   ```

3. 运行部署脚本：
   ```bash
   ./deploy.sh
   ```

## 部署脚本说明

部署脚本会执行以下操作：

1. 检查SSH连接
2. 在服务器上创建目录（如果不存在）
3. 同步文件到服务器（排除node_modules、.git等目录）
4. 在服务器上安装依赖
5. 使用PM2重启应用

## 自定义部署

如果您需要自定义部署配置，可以编辑`deploy.sh`文件，修改以下变量：

- `SERVER_USER`: 服务器用户名
- `SERVER_HOST`: 服务器IP地址
- `SERVER_PORT`: SSH端口
- `SERVER_PATH`: 服务器上的部署路径

## 常见问题

### 1. SSH连接失败

- 检查服务器IP地址和端口是否正确
- 确保SSH密钥已正确配置
- 检查服务器防火墙设置

### 2. 部署后应用无法访问

- 检查服务器防火墙设置，确保已放行应用端口
- 使用`pm2 logs jm-elec`查看应用日志
- 使用`pm2 status`检查应用状态

### 3. 数据库问题

- 确保数据库文件有正确的权限
- 如果需要，可以手动创建数据库文件
