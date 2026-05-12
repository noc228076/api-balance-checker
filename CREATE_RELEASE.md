# 创建 GitHub Release 的简单步骤

## 📦 已生成的发布包

在 `releases/` 目录中已经有了：
- `api-balance-checker-web.zip` - Web 部署包 (95KB)
- `api-balance-checker-source.zip` - 源代码包 (46KB)
- `nginx.conf` - Nginx 配置文件

## 🚀 创建 Release 步骤

### 1. 访问 GitHub 仓库
打开：https://github.com/noc228076/api-balance-checker

### 2. 创建 Release
1. 点击 "Releases" 标签
2. 点击 "Create a new release"
3. **Tag version**: 输入 `v1.0.0`
4. **Release title**: 输入 `API Balance Checker v1.0.0`
5. **Description**: 填写说明（可以使用下面的模板）

### 3. 上传文件
从 `releases/` 目录上传这两个文件：
- `api-balance-checker-web.zip`
- `api-balance-checker-source.zip`

### 4. 发布
点击 "Publish release" 按钮

## 📝 Release 说明模板

```
🎉 API Balance Checker v1.0.0 正式发布！

## 🌟 功能特性
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

### Web 服务器部署
1. 下载 api-balance-checker-web.zip
2. 解压到 Web 服务器根目录
3. 配置服务器支持 SPA 路由

## 🔗 项目地址
https://github.com/noc228076/api-balance-checker
```

## 🔄 更新版本

如果需要更新版本，修改代码后：
1. 提交更改：`git commit -m "更新内容"`
2. 推送到 GitHub：`git push origin master`
3. 重复上面的创建 Release 步骤，但使用新的 tag（如 v1.0.1）