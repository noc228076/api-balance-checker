# API 余额查询工具

一个简洁优雅的多平台 API Key 余额查询工具，支持 OpenAI、硅基流动、智谱AI等多个平台。

## ✨ 功能特性

- 🔑 多平台支持：OpenAI、硅基流动、智谱AI、DeepSeek 等
- 📊 图表展示：柱状图、饼图、堆叠图
- 💳 卡片式界面：美观直观的余额展示
- 🌓 明暗主题：可自由切换界面风格
- 📱 响应式设计：支持桌面和移动设备
- 💾 本地存储：自动保存配置和查询结果

## 🚀 快速开始

### 方法一：一键启动

**Windows 用户：**
```bash
start.bat
```

**Linux/Mac 用户：**
```bash
./start.sh
```

### 方法二：手动启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

## 📋 支持的平台

| 平台 | 名称 | API Key | Base URL | 货币单位 |
|------|------|---------|----------|----------|
| openai | OpenAI | sk-xxx | https://api.openai.com | USD |
| claude | Claude | sk-ant-xxx | https://api.anthropic.com | USD |
| gemini | Google Gemini | AIza-xxx | https://generativelanguage.googleapis.com | USD |
| deepseek | DeepSeek | sk-xxx | https://api.deepseek.com | CNY |
| siliconflow | 硅基流动 | sk-xxx | https://api.siliconflow.cn | CNY |
| zhipuai | 智谱AI | xxx | https://open.bigmodel.cn | CNY |
| custom | 自定义 | sk-xxx | https://api.example.com | USD |

## 🎯 使用说明

### 1. 添加 API Key

- 点击「添加 Key」按钮
- 选择平台类型
- 填写名称、API Key
- 自定义平台需要填写 Base URL
- 保存后自动查询余额

### 2. 查询余额

- 每个卡片显示该 API Key 的余额信息
- 圆环图显示使用率百分比
- 进度条直观展示剩余额度
- 点击「刷新」按钮更新余额
- 点击「删除」按钮移除配置

### 3. 图表分析

- **柱状图**：对比各平台剩余额度
- **饼图**：展示额度占比分布
- **堆叠图**：显示已用和剩余的组合

## 🔧 高级配置

### 使用中转站

如果你使用的是 One API、New API 等中转站，请使用「自定义」选项，并填写正确的 Base URL。

### 余额查询规则

1. **官方 API**：使用官方余额查询接口（如适用）
2. **兼容接口**：自动尝试常见的余额查询格式
3. **兜底方案**：支持 One API 格式的余额查询

## 📱 移动端适配

工具已适配移动设备，包括：
- 响应式网格布局
- 触摸友好的按钮设计
- 自适应字体大小

## 🤝 贡献欢迎

如果你发现任何问题或有改进建议，欢迎提交 Issue 或 Pull Request。

## 📝 开发说明

项目基于 Vue 3 + Vite 构建：
- Vue 3 Composition API
- Chart.js 图表库
- 自定义 CSS 变量主题系统
- 本地存储数据持久化

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 如果你尚未安装 ESLint（首次使用），可运行：
# npm install -D eslint eslint-plugin-vue
```