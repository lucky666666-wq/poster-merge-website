# 🎨 海报Logo合并工具

一个完全免费的在线海报Logo合并工具，支持上传海报和Logo图片，自定义位置、大小和透明度，实时预览合并效果。

## ✨ 主要特性

- 🖼️ **多格式支持** - 支持 JPG、PNG、GIF 等常见图片格式
- 🎯 **精确控制** - 像素级位置控制，百分比大小调节
- 🔧 **透明度调节** - 30%-100% 透明度精细调节
- 📱 **响应式设计** - 完美适配手机、平板、电脑等设备
- 💾 **高质量输出** - 95% JPEG 质量，保证图片清晰度
- 🔒 **隐私保护** - 所有图片处理均在浏览器本地完成
- ⚡ **实时预览** - 拖拽调整参数即时查看效果
- 🎨 **装饰元素** - 支持添加额外的装饰元素

## 🚀 在线使用

访问 GitHub Pages 地址即可直接使用：
**[https://your-username.github.io/poster-merge-website](https://your-username.github.io/poster-merge-website)**

## 🎯 使用方法

### 基本操作
1. **上传海报** - 点击或拖拽上传海报图片（必需）
2. **添加Logo** - 可选择上传Logo图片
3. **添加装饰** - 可选择上传装饰元素
4. **调整参数** - 拖拽滑块调整大小、位置和透明度
5. **实时预览** - 右侧查看合并效果
6. **下载结果** - 点击下载按钮保存图片

### 参数说明
- **大小比例**: 8%-50%，相对于海报宽度的百分比
- **透明度**: 30%-100%，控制Logo/元素的透明程度
- **位置**: 像素级精确控制，左上角为原点 (0,0)

### 快捷键
- `Ctrl/Cmd + Enter` - 合并图片
- `Ctrl/Cmd + S` - 下载结果

## 🛠️ 技术特点

- **纯前端技术** - HTML5 + CSS3 + Vanilla JavaScript
- **Canvas 渲染** - 使用 HTML5 Canvas 进行图像合成
- **无服务器依赖** - 完全静态网站，可部署在任何静态服务器
- **移动端优化** - 响应式设计，触控友好
- **现代浏览器支持** - 支持所有现代浏览器

## 📱 设备兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ iOS Safari 11+
- ✅ Android Chrome 60+

## 🔧 本地开发

### 克隆项目
```bash
git clone https://github.com/your-username/poster-merge-website.git
cd poster-merge-website
```

### 本地预览
```bash
# 使用 Python 启动简单服务器
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 然后访问 http://localhost:8000
```

### 部署到 GitHub Pages
1. Fork 或下载本项目
2. 在 GitHub 仓库设置中启用 Pages
3. 选择 `main` 分支作为源
4. 访问 `https://your-username.github.io/poster-merge-website`

## 📁 项目结构

```
poster-merge-website/
├── index.html          # 主页面
├── script.js           # 核心JavaScript功能
├── README.md          # 项目说明
└── LICENSE            # 开源协议
```

## 🔒 隐私说明

本工具非常注重用户隐私：
- ✅ 所有图片处理都在您的浏览器本地完成
- ✅ 不会上传任何图片到服务器
- ✅ 不收集任何个人信息或图片数据
- ✅ 完全离线可用（页面加载后）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发建议
1. 保持代码简洁易读
2. 确保移动端兼容性
3. 遵循现有的代码风格
4. 添加适当的注释

### 提交格式
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式化
refactor: 重构代码
```

## 📜 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 📊 更新日志

### v1.0.0 (2024-01-xx)
- 🎉 首次发布
- ✨ 支持海报Logo合并
- ✨ 支持装饰元素添加
- ✨ 实时预览功能
- ✨ 移动端适配
- ✨ 拖拽上传功能

## 💡 功能建议

如果您有任何功能建议或问题反馈，欢迎：
- 提交 [GitHub Issue](https://github.com/your-username/poster-merge-website/issues)
- 发送邮件到：your-email@example.com

## 🙏 致谢

感谢所有为这个项目提供建议和反馈的用户！

---

**⭐ 如果这个工具对您有帮助，请给我们一个 Star！** 