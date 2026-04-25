#!/bin/bash
# jm-elec 部署脚本

# 服务器配置
SERVER_USER="root"
SERVER_HOST="121.196.163.196"
SERVER_PORT="22"
SERVER_PATH="/www/wwwroot/jm-elec"
SERVER_PASSWORD="802815Jie"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署到云服务器...${NC}"

# 检查SSH连接
echo -e "${YELLOW}检查SSH连接...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_HOST} "echo 'SSH连接成功'" || {
    echo -e "${RED}SSH连接失败，请检查服务器地址和端口${NC}"
    exit 1
}

# 在服务器上创建目录（如果不存在）
echo -e "${YELLOW}在服务器上创建目录...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"

# 同步文件到服务器
echo -e "${YELLOW}同步文件到服务器...${NC}"
rsync -avz --progress     --exclude 'node_modules'     --exclude '.git'     --exclude 'database.sqlite'     --exclude 'test-reports'     --exclude 'backup'     --exclude '*.log'     -e "sshpass -p '${SERVER_PASSWORD}' ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no"     ./ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# 在服务器上安装依赖
echo -e "${YELLOW}在服务器上安装依赖...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_PATH} && npm install --production"

# 在服务器上重启应用
echo -e "${YELLOW}在服务器上重启应用...${NC}"
sshpass -p "${SERVER_PASSWORD}" ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "cd ${SERVER_PATH} && pm2 restart jm-elec || pm2 start server.js --name jm-elec"

echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}应用地址: http://${SERVER_HOST}${NC}"
