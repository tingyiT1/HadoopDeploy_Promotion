#!/bin/bash

# HadoopDeploy_tool 宣传网站部署脚本
# 作者: violet27-chf
# 版本: 1.0.0

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    if [ -f "package.json" ]; then
        npm install
        log_success "依赖安装完成"
    else
        log_warning "未找到 package.json，跳过依赖安装"
    fi
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 创建dist目录
    mkdir -p dist
    
    # 复制HTML文件
    cp index.html dist/
    
    # 复制CSS文件
    mkdir -p dist/css
    cp css/*.css dist/css/
    
    # 复制JS文件
    mkdir -p dist/js
    cp js/*.js dist/js/
    
    # 如果有图片目录，复制图片
    if [ -d "images" ]; then
        cp -r images dist/
    fi
    
    # 如果有其他静态资源，复制它们
    if [ -d "assets" ]; then
        cp -r assets dist/
    fi
    
    log_success "项目构建完成"
}

# 优化构建
optimize_build() {
    log_info "优化构建文件..."
    
    # 检查是否有优化工具
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        # 尝试运行优化脚本
        if npm run optimize &> /dev/null; then
            log_success "构建优化完成"
        else
            log_warning "构建优化失败，使用原始文件"
        fi
    else
        log_warning "跳过构建优化"
    fi
}

# 部署到本地服务器
deploy_local() {
    log_info "启动本地服务器..."
    
    PORT=${1:-8000}
    
    if command -v python3 &> /dev/null; then
        log_info "使用 Python 3 启动服务器 (端口: $PORT)"
        cd dist && python3 -m http.server $PORT
    elif command -v python &> /dev/null; then
        log_info "使用 Python 启动服务器 (端口: $PORT)"
        cd dist && python -m http.server $PORT
    elif command -v npx &> /dev/null; then
        log_info "使用 npx serve 启动服务器 (端口: $PORT)"
        cd dist && npx serve -p $PORT
    else
        log_error "未找到可用的服务器，请手动启动"
        log_info "构建文件位于 dist/ 目录"
    fi
}

# 部署到远程服务器
deploy_remote() {
    local REMOTE_HOST=$1
    local REMOTE_PATH=$2
    local REMOTE_USER=${3:-root}
    
    if [ -z "$REMOTE_HOST" ] || [ -z "$REMOTE_PATH" ]; then
        log_error "请提供远程主机和路径"
        echo "用法: $0 remote <host> <path> [user]"
        exit 1
    fi
    
    log_info "部署到远程服务器: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
    
    # 使用rsync同步文件
    if command -v rsync &> /dev/null; then
        rsync -avz --delete dist/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/
        log_success "远程部署完成"
    else
        log_error "rsync 未安装，无法进行远程部署"
        exit 1
    fi
}

# 部署到GitHub Pages
deploy_github_pages() {
    log_info "部署到 GitHub Pages..."
    
    if [ ! -d ".git" ]; then
        log_error "当前目录不是Git仓库"
        exit 1
    fi
    
    # 创建gh-pages分支
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # 复制构建文件到根目录
    cp -r dist/* .
    
    # 提交更改
    git add .
    git commit -m "Deploy to GitHub Pages" || true
    
    # 推送到远程仓库
    git push origin gh-pages
    
    # 切换回主分支
    git checkout main 2>/dev/null || git checkout master
    
    log_success "GitHub Pages 部署完成"
}

# 显示帮助信息
show_help() {
    echo "HadoopDeploy_tool 宣传网站部署脚本"
    echo ""
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  build     构建项目"
    echo "  local     启动本地服务器"
    echo "  remote    部署到远程服务器"
    echo "  github    部署到GitHub Pages"
    echo "  full      完整构建和本地部署"
    echo "  help      显示此帮助信息"
    echo ""
    echo "选项:"
    echo "  --port <端口>    指定本地服务器端口 (默认: 8000)"
    echo "  --host <主机>    远程服务器主机地址"
    echo "  --path <路径>    远程服务器部署路径"
    echo "  --user <用户>    远程服务器用户名 (默认: root)"
    echo ""
    echo "示例:"
    echo "  $0 build                    # 构建项目"
    echo "  $0 local --port 3000        # 在端口3000启动本地服务器"
    echo "  $0 remote --host example.com --path /var/www/html"
    echo "  $0 github                   # 部署到GitHub Pages"
    echo "  $0 full                     # 完整构建和本地部署"
}

# 主函数
main() {
    local COMMAND=$1
    shift
    
    case $COMMAND in
        "build")
            check_dependencies
            install_dependencies
            build_project
            optimize_build
            log_success "构建完成！文件位于 dist/ 目录"
            ;;
        "local")
            local PORT=8000
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --port)
                        PORT=$2
                        shift 2
                        ;;
                    *)
                        shift
                        ;;
                esac
            done
            deploy_local $PORT
            ;;
        "remote")
            local HOST=""
            local PATH=""
            local USER="root"
            
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --host)
                        HOST=$2
                        shift 2
                        ;;
                    --path)
                        PATH=$2
                        shift 2
                        ;;
                    --user)
                        USER=$2
                        shift 2
                        ;;
                    *)
                        shift
                        ;;
                esac
            done
            
            deploy_remote "$HOST" "$PATH" "$USER"
            ;;
        "github")
            deploy_github_pages
            ;;
        "full")
            check_dependencies
            install_dependencies
            build_project
            optimize_build
            log_success "构建完成！启动本地服务器..."
            deploy_local 8000
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            log_error "未知命令: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口
main "$@" 