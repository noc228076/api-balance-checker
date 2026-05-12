# GitHub Release 创建指南

## 📦 正确的项目结构

```
api-balance-checker/
├── src/              # 源代码
├── public/           # 静态资源
├── package.json      # 项目配置
├── vite.config.js    # Vite 配置
├── .gitignore        # Git 忽略文件
├── prepare-release.sh # Release 准备脚本 (Linux/Mac)
├── prepare-release.bat # Release 准备脚本 (Windows)
└── README.md        # 项目说明
```

**注意**：`releases/` 文件夹不应该提交到 git，它只用于本地生成发布包。

## 🚀 创建 Release 的步骤

### 方法一：使用自动化脚本（推荐）

1. **在本地生成发布包**：
   ```bash
   # Linux/Mac
   ./prepare-release.sh
   
   # Windows
   prepare-release.bat
   ```

2. **这会生成两个文件**：
   - `api-balance-checker-web.zip` - Web 服务器部署包
   - `api-balance-checker-source.zip` - 源代码包（不含 node_modules 和 dist）

### 方法二：手动生成

1. **构建项目**：
   ```bash
   npm install
   npm run build
   ```

2. **创建发布包**：
   ```bash
   # 创建 Web 部署包
   zip -r api-balance-checker-web.zip dist/*
   
   # 创建源代码包（排除不必要的文件）
   zip -r api-balance-checker-source.zip . -x "node_modules/*" "dist/*" ".git/*"
   ```

## 📤 上传到 GitHub Release

1. **访问 GitHub 仓库**：
   https://github.com/noc228076/api-balance-checker

2. **创建 Release**：
   - 点击 "Releases" → "Create a new release"
   - **Tag version**: `v1.0.0`
   - **Release title**: `API Balance Checker v1.0.0`
   - **Description**: 填写版本说明

3. **上传文件**：
   - 上传 `api-balance-checker-web.zip`
   - 上传 `api-balance-checker-source.zip`

4. **发布**

## 📋 Release 说明模板

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

### Web 部署包 (api-balance-checker-web.zip)
- 适用于任何 Web 服务器
- 解压后直接部署即可

### 源代码包 (api-balance-checker-source.zip)
- 完整源代码
- 需要运行 `npm install` 和 `npm run build`

## 🚀 快速开始

### Web 服务器部署
1. 下载 api-balance-checker-web.zip
2. 解压到 Web 服务器根目录
3. 配置服务器支持 SPA 路由

### 本地开发
```bash
# 解压源代码包
unzip api-balance-checker-source.zip
cd api-balance-checker

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🔗 项目地址
https://github.com/noc228076/api-balance-checker
```

## 🎯 最佳实践

1. **不要在代码仓库中包含构建产物**
   - .zip 文件应该通过脚本生成
   - 构建产物应该被 .gitignore 忽略

2. **使用语义化版本**
   - v1.0.0（第一个正式版本）
   - v1.0.1（修复 bug）
   - v1.1.0（新功能）
   - v2.0.0（重大更新）

3. **定期创建 Release**
   - 每次新版本发布时创建
   - 保持 Release 说明的更新

## 🔄 更新流程

1. 修改代码
2. 提交更改：`git commit -m "描述更改"`
3. 推送到 GitHub：`git push origin master`
4. 运行 prepare 脚本生成发布包
5. 创建新的 Release 并上传包
6. 标记版本：`git tag v1.0.1 && git push origin v1.0.1`