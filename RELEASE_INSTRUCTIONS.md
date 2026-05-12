# GitHub Release 创建指南

## 📦 Release 准备完成

项目已成功构建，所有发布包已生成在 `releases/` 目录中：

### 🎯 生成的发布包

1. **api-balance-checker-web.zip** (96 KB)
   - 用途：Web 服务器直接部署
   - 包含：完整的构建文件（index.html, CSS, JS）

2. **nginx-deploy.zip** (95 KB)
   - 用途：Nginx 服务器部署
   - 包含：前端文件 + nginx.conf 配置文件

3. **vercel-deploy.zip** (95 KB)
   - 用途：Vercel 平台部署
   - 包含：前端文件 + vercel.json 配置文件

4. **netlify-deploy.zip** (95 KB)
   - 用途：Netlify 平台部署
   - 包含：前端文件 + netlify.toml 配置文件

5. **api-balance-checker-source.zip** (39 KB)
   - 用途：源代码备份
   - 包含：完整源代码（排除 node_modules 和 dist）

## 🚀 手动创建 GitHub Release

### 步骤 1：访问 GitHub 仓库

打开浏览器访问：https://github.com/noc228076/api-balance-checker

### 步骤 2：创建 Release

1. 点击仓库页面右侧的 **"Releases"** 标签
2. 点击 **"Create a new release"** 按钮
3. **Tag version**: 输入 `v1.0.0`
4. **Release title**: 输入 `API Balance Checker v1.0.0`
5. **Description**: 复制以下内容：

```
🎉 API Balance Checker v1.0.0 正式发布！

## 🌟 新版本特性

- 🔑 多平台支持：OpenAI、硅基流动、智谱AI、DeepSeek 等
- 📊 图表展示：柱状图、饼图、堆叠图
- 💳 卡片式界面：美观直观的余额展示
- 🌓 明暗主题：可自由切换界面风格
- 📱 响应式设计：支持桌面和移动设备
- 💾 本地存储：自动保存配置和查询结果

## 📦 下载说明

### Web 部署包
- api-balance-checker-web.zip：适用于任何 Web 服务器
- 解压后直接部署即可

### 平台特定部署包
- nginx-deploy.zip：包含 Nginx 配置
- vercel-deploy.zip：包含 Vercel 配置
- netlify-deploy.zip：包含 Netlify 配置

### 源代码包
- api-balance-checker-source.zip：完整源代码

## 🚀 快速开始

### 本地运行
```bash
# 解压源代码包
unzip api-balance-checker-source.zip
cd api-balance-checker

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 在线部署

**Vercel**
1. 下载 vercel-deploy.zip
2. 上传到 Vercel
3. 自动部署

**Netlify**
1. 下载 netlify-deploy.zip
2. 上传到 Netlify
3. 自动部署

**Nginx 服务器**
1. 下载 nginx-deploy.zip
2. 解压到 /usr/share/nginx/html
3. 配置 nginx.conf
4. 重启 nginx

## 🔗 相关链接

- 项目主页：https://github.com/noc228076/api-balance-checker
- 问题反馈：https://github.com/noc228076/api-balance-checker/issues

感谢使用！🙏
```

6. 点击 **"Publish release"** 按钮

### 步骤 3：上传发布包

创建 Release 后，你需要上传以下文件：

1. `releases/api-balance-checker-web.zip`
2. `releases/nginx-deploy.zip`
3. `releases/vercel-deploy.zip`
4. `releases/netlify-deploy.zip`
5. `releases/api-balance-checker-source.zip`

## 🎯 Release 完成后

Release 创建成功后，用户就可以：

- 在 GitHub Releases 页面下载所有发布包
- 通过 tag `v1.0.0` 获取特定版本的代码
- 查看 Release 说明了解如何部署

## 📝 注意事项

1. 确保 Release 的 tag 格式正确（v1.0.0）
2. 上传所有 ZIP 文件
3. Release 说明要详细清晰
4. 可以添加 Release notes 来记录版本更新内容

---

## 🔄 自动构建脚本

以后需要更新 Release 时，可以运行：

```bash
# 构建 Web 版本
npm run build

# 创建发布包
./build-releases.sh  # Linux/Mac
build-releases.bat   # Windows

# 提交更改
git add releases/ build-releases.*
git commit -m "Update release packages"
git push origin master

# 然后手动创建新的 Release
```