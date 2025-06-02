#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
import sys

# 获取脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print(f"🔧 切换到目录: {script_dir}")
print(f"📁 当前工作目录: {os.getcwd()}")
print(f"📄 index.html存在: {os.path.exists('index.html')}")

if not os.path.exists('index.html'):
    print("❌ 错误：找不到index.html文件")
    sys.exit(1)

PORT = 8007
Handler = http.server.SimpleHTTPRequestHandler

print(f"🚀 启动服务器在端口 {PORT}...")
print(f"🌐 访问地址: http://localhost:{PORT}/")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        # 自动打开浏览器
        webbrowser.open(f'http://localhost:{PORT}/')
        print("✅ 服务器启动成功！浏览器已自动打开")
        print("⏹️  按 Ctrl+C 停止服务器")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 服务器已停止")
except OSError as e:
    if "Address already in use" in str(e):
        print(f"❌ 端口 {PORT} 已被占用，请尝试其他端口")
    else:
        print(f"❌ 启动服务器失败: {e}") 