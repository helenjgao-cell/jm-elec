#!/bin/bash
# jm-elec 代码推送脚本
# 用法: ./push.sh "你的提交说明"

# Git 路径（使用 Xcode 内置的 git，绕过 Xcode license 限制）
GIT="/Applications/Xcode.app/Contents/Developer/usr/bin/git"

# 检查提交说明
if [ -z "$1" ]; then
    echo "❌ 请提供提交说明"
    echo "用法: ./push.sh \"你的修改说明\""
    exit 1
fi

# 启动 SSH agent 并加载 key
eval "$(ssh-agent -s)" > /dev/null 2>&1
ssh-add ~/.ssh/id_ed25519 > /dev/null 2>&1

# 检查是否有变更
if $GIT diff --quiet && $GIT diff --cached --quiet; then
    echo "⚠️  没有需要提交的变更"
    exit 0
fi

# 添加所有变更
echo "📦 添加变更..."
$GIT add -A

# 提交
echo "💾 提交: $1"
$GIT commit -m "$1"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
$GIT push origin main

if [ $? -eq 0 ]; then
    echo "✅ 推送成功！https://github.com/helenjgao-cell/jm-elec"
else
    echo "❌ 推送失败"
    exit 1
fi
