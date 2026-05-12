# API Balance Checker

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chart.js)

**一个轻量级、本地运行的多平台 API Key 余额查询与管理工具**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用指南](#-使用指南) • [技术架构](#-技术架构)

</div>

---

## 📖 项目简介

API Balance Checker 是一个简洁优雅的 Web 应用，帮助用户集中管理和监控多个 AI 平台的 API Key 余额使用情况。所有数据存储在本地浏览器中，无需担心隐私泄露。

### 💡 核心价值

- 🔒 **隐私安全**：所有 API Key 仅存储在本地，不上传任何服务器
- ⚡ **轻量快速**：基于 Vue 3 + Vite，启动迅速，性能优异
- 🎨 **美观易用**：现代化的界面设计，支持明暗主题切换
- 🌐 **国际化**：支持中英文双语切换，满足不同用户需求
- 📊 **可视化分析**：多种图表展示，直观了解额度使用情况

---

## ✨ 功能特性

### 🔑 多平台支持
支持主流 AI 平台的余额查询，包括：
- **OpenAI** - GPT 系列模型
- **Claude** - Anthropic Claude 模型
- **Google Gemini** - Google Gemini 系列
- **DeepSeek** - 深度求索大模型
- **硅基流动** - SiliconFlow 平台
- **智谱AI** - ChatGLM 系列
- **自定义平台** - 支持 OneAPI/NewAPI 等中转站

### 🌐 多语言支持
- **中英文切换** - 在导航栏或设置界面快速切换
- **国际化设计** - 所有界面文本均已本地化
- **持久化存储** - 语言偏好自动保存

### 📊 智能图表分析
- **柱状图** - 对比各平台剩余额度
- **饼图** - 展示额度占比分布
- **堆叠图** - 显示已用和剩余的组合情况

### 💳 卡片式管理界面
- 实时显示余额和使用率
- 圆环进度条直观展示剩余额度
- 一键刷新、编辑、删除操作
- 支持批量刷新所有 Key

### 🌓 主题系统
- 明暗模式自由切换
- CSS 变量实现平滑过渡
- 自动保存用户偏好

### 📱 响应式设计
- 完美适配桌面端和移动端
- 触摸友好的交互设计
- 自适应布局和字体

### 💾 数据持久化
- 基于 localStorage 的本地存储
- 支持配置导出/导入（JSON 格式）
- 自动保存查询结果和设置

---

## 🚀 快速开始

### 前置要求

- Node.js >= 16.x
- npm 或 pnpm
- 现代浏览器（Chrome/Firefox/Safari/Edge）

### 方法一：一键启动（推荐）

**Windows 用户：**
```bash
start.bat
```

**Linux/Mac 用户：**
```bash
chmod +x start.sh
./start.sh
```

脚本会自动安装依赖并启动开发服务器。

### 方法二：手动启动

```bash
# 1. 克隆或下载项目
cd api-balance-checker

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 浏览器打开 http://localhost:5173
```

### 方法三：生产环境部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建后的文件位于 `dist/` 目录，可部署到任意静态服务器。

---

## 📋 支持的平台

| 平台 | 名称 | API Key 格式 | Base URL | 货币单位 |
|------|------|-------------|----------|----------|
| OpenAI | OpenAI | `sk-xxx` | `https://api.openai.com` | USD |
| Claude | Anthropic Claude | `sk-ant-xxx` | `https://api.anthropic.com` | USD |
| Gemini | Google Gemini | `AIza-xxx` | `https://generativelanguage.googleapis.com` | USD |
| DeepSeek | 深度求索 | `sk-xxx` | `https://api.deepseek.com` | CNY |
| SiliconFlow | 硅基流动 | `sk-xxx` | `https://api.siliconflow.cn` | CNY |
| ZhipuAI | 智谱AI | `xxx` | `https://open.bigmodel.cn` | CNY |
| Custom | 自定义平台 | `sk-xxx` | 自定义 | 自定义 |

> 💡 **提示**：如果使用 OneAPI、NewAPI 等中转站，请选择「自定义」选项并填写正确的 Base URL。

---

## 🎯 使用指南

### 1️⃣ 添加 API Key

1. 点击顶部导航栏的 **「添加 Key」** 按钮
2. 在弹窗中选择平台类型
3. 填写以下信息：
   - **名称**：便于识别的备注（如"个人账号"、"团队共享"）
   - **API Key**：从对应平台获取的密钥
   - **Base URL**：自定义平台需填写（其他平台自动填充）
4. 点击 **「保存」**，系统会自动查询余额

### 2️⃣ 查看和管理余额

每个 API Key 以卡片形式展示，包含：
- 💰 **余额数值** - 精确到小数点后 4 位
- 📈 **使用率圆环** - 可视化展示已用比例
- 📊 **进度条** - 直观显示剩余额度
- 🔄 **刷新按钮** - 更新最新余额
- ✏️ **编辑按钮** - 修改配置信息
- 🗑️ **删除按钮** - 移除该 Key（需确认）

### 3️⃣ 图表分析

点击顶部统计栏的图表图标，可以切换三种视图：

- **📊 柱状图** - 横向对比各平台的剩余额度
- **🥧 饼图** - 查看各平台在总额度中的占比
- **📈 堆叠图** - 同时显示已用额度和剩余额度

### 4️⃣ 设置与数据管理

点击右上角的 **⚙️ 设置** 图标：

#### 外观设置
- 切换深色/浅色模式
- 实时预览效果

#### 数据管理
- **导出配置** - 将所有配置保存为 JSON 文件（带时间戳）
- **导入配置** - 从 JSON 文件恢复配置（会覆盖现有数据）
- **清除所有数据** - 删除所有 API Key 和设置（需双重确认）

#### 关于信息
- 查看应用版本和技术栈
- 了解支持的平台列表

---

## 🔧 高级配置

### 使用中转站

如果你使用的是 **OneAPI**、**NewAPI** 或其他 API 中转服务：

1. 选择平台类型为 **「自定义」**
2. 填写中转站的 Base URL（如 `https://your-proxy.com/v1`）
3. 填写对应的 API Key
4. 系统会自动尝试多种余额查询接口

### 余额查询机制

系统采用智能查询策略：

1. **官方接口优先** - 首先尝试平台官方的余额查询端点
2. **兼容接口回退** - 自动尝试常见的 OneAPI 格式
3. **多端点尝试** - 依次测试多个可能的 API 路径
4. **详细日志输出** - 在浏览器控制台可查看完整的请求/响应信息

### 处理 403 错误

如果遇到 403 权限错误：

**OpenAI 平台：**
- ✅ 个人 API Key 通常可以正常查询
- ❌ 组织 API Key 需要管理员权限才能访问账单信息
- 💡 建议联系组织管理员获取权限，或使用个人账户的 API Key

**其他平台：**
- 检查 API Key 是否具有余额查询权限
- 在平台控制台确认是否开启了相关功能
- 尝试使用「自定义」平台类型手动配置

---

## 🏗️ 技术架构

### 技术栈

```
前端框架：Vue 3.5 (Composition API)
构建工具：Vite 8.0
图表库：Chart.js 4.5 + vue-chartjs 5.3
状态管理：@vueuse/core 14.3
样式方案：CSS Variables + 原生 CSS
```

### 项目结构

```
api-balance-checker/
├── src/
│   ├── api/
│   │   └── providers.js          # 各平台余额查询逻辑
│   ├── components/
│   │   ├── AddKeyModal.vue       # 添加/编辑 Key 弹窗
│   │   ├── BalanceCard.vue       # 余额卡片组件
│   │   ├── BalanceChart.vue      # 图表组件
│   │   ├── ConfirmModal.vue      # 确认对话框
│   │   └── SettingsModal.vue     # 设置弹窗
│   ├── stores/
│   │   └── keyStore.js           # API Key 状态管理
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 应用入口
│   └── style.css                 # 全局样式
├── public/                       # 静态资源
├── index.html                    # HTML 模板
├── package.json                  # 项目配置
├── vite.config.js               # Vite 配置
└── README.md                    # 项目说明
```

### 核心设计

- **组件化架构** - 功能模块独立封装，易于维护和扩展
- **响应式状态管理** - 使用 Pinia 风格的 store 统一管理数据
- **组合式 API** - Vue 3 Composition API 提高代码复用性
- **主题系统** - CSS 变量实现灵活的明暗主题切换
- **本地优先** - 所有数据存储在浏览器 localStorage 中

---

## 📱 移动端适配

应用已完全适配移动设备：

- ✅ 响应式网格布局，自动调整列数
- ✅ 触摸友好的按钮尺寸（最小 44px）
- ✅ 自适应字体大小和间距
- ✅ 优化的弹窗交互体验
- ✅ 支持横屏和竖屏显示

---

## 🔒 隐私与安全

我们非常重视用户隐私：

- 🛡️ **零数据上传** - 所有 API Key 和查询结果仅存储在本地浏览器
- 🔐 **无后端服务** - 纯前端应用，不存在服务器端数据收集
- 🚫 **无追踪代码** - 不包含任何分析、统计或追踪脚本
- 💾 **用户完全控制** - 可随时导出、导入或清除所有数据

> ⚠️ **重要提示**：请妥善保管你的 API Key，不要分享给他人。定期清理不再使用的 Key。

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 如何贡献

1. **Fork** 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 **Pull Request**

### 开发规范

- 遵循 Vue 3 组合式 API 最佳实践
- 保持代码风格一致
- 添加必要的注释
- 确保功能在不同浏览器中正常工作

### 报告问题

如果遇到问题，请提供：
- 问题描述和复现步骤
- 浏览器版本和操作系统
- 控制台错误信息（如有）
- 截图或录屏（可选但有帮助）

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Chart.js](https://www.chartjs.org/) - 简单灵活的图表库
- [VueUse](https://vueuse.org/) - Vue 组合式工具集

---

## 📞 联系方式

- 📧 Email: [你的邮箱]
- 🐛 Issues: [GitHub Issues](https://github.com/noc228076/api-balance-checker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/noc228076/api-balance-checker/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**

Made with ❤️ by [Your Name]

</div>