# Labs Docs - Makefile
# Fumadocs + Next.js 文档站点

.PHONY: help install dev build start clean lint types check

# 默认目标
help:
	@echo "Labs Docs 开发命令"
	@echo ""
	@echo "使用方法: make [target]"
	@echo ""
	@echo "开发:"
	@echo "  install    安装依赖"
	@echo "  dev        启动开发服务器 (http://localhost:3000)"
	@echo "  build      构建生产版本"
	@echo "  start      启动生产服务器"
	@echo ""
	@echo "质量检查:"
	@echo "  lint       运行 ESLint"
	@echo "  types      类型检查"
	@echo "  check      运行所有检查 (lint + types)"
	@echo ""
	@echo "其他:"
	@echo "  clean      清理构建产物"

# 安装依赖
install:
	npm install

# 启动开发服务器
dev:
	npm run dev

# 构建生产版本
build:
	npm run build

# 启动生产服务器
start:
	npm run start

# ESLint 检查
lint:
	npm run lint

# 类型检查
types:
	npm run types:check

# 运行所有检查
check: lint types

# 清理构建产物
clean:
	rm -rf .next
	rm -rf node_modules/.cache
	@echo "清理完成"
