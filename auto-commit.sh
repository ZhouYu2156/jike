#!/bin/bash

# 自动提交当前代码到 GitHub 仓库的脚本
# 使用方法:
#   ./auto-commit.sh -p "提交信息"  # 使用参数指定提交信息
#   ./auto-commit.sh                # 交互式输入提交信息

# 初始化变量
COMMIT_MESSAGE=""

# 解析命令行参数
while getopts "p:" opt; do
  case $opt in
    p)
      COMMIT_MESSAGE="$OPTARG"
      ;;
    \?)
      echo "无效选项: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "选项 -$OPTARG 需要参数" >&2
      exit 1
      ;;
  esac
done

# 如果没有通过参数提供提交信息，则交互式询问
if [ -z "$COMMIT_MESSAGE" ]; then
  read -p "请输入提交信息：" COMMIT_MESSAGE
fi

# 检查是否输入了提交信息
if [ -z "$COMMIT_MESSAGE" ]; then
  echo "错误：提交信息不能为空"
  exit 1
fi

# 执行 Git 操作
echo "正在添加所有更改..."
git add .

echo "正在提交更改..."
git commit -m "$COMMIT_MESSAGE"

echo "正在推送到远程仓库..."
git push githubware main

echo "✓ 提交完成！"
