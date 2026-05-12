# API 余额查询工具

一个简洁优雅的多平台 API Key 余额查询工具，支持 OpenAI、硅基流动、智谱AI等多个平台。

## ✨ 功能特性

- 🔑 多平台支持：OpenAI、Claude、Gemini、DeepSeek、硅基流动、智谱AI等
- 📊 图表展示：柱状图、饼图、堆叠图
- 💳 卡片式界面：美观直观的余额展示
- 🌓 明暗主题：可自由切换界面风格
- 📱 响应式设计：支持桌面和移动设备
- 💾 本地存储：自动保存配置和查询结果
- ⚙️ 设置中心：数据导入导出、主题切换
- 🔒 安全确认：自定义删除确认弹窗

## 🚀 快速开始

### 方法一：一键启动

**Windows 用户：**
```bash
start.bat
```

**Linux/Mac 用户：**
```bash
chmod +x start.sh
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

| 平台 | 名称 | API Key 示例 | Base URL | 货币单位 |
|------|------|---------|----------|----------|
| openai | OpenAI (ChatGPT) | sk-xxx | https://api.openai.com | USD |
| claude | Claude (Anthropic) | sk-ant-xxx | https://api.anthropic.com | USD |
| gemini | Google Gemini | AIza-xxx | https://generativelanguage.googleapis.com | USD |
| deepseek | DeepSeek | sk-xxx | https://api.deepseek.com | CNY |
| siliconflow | 硅基流动 (SiliconFlow) | sk-xxx | https://api.siliconflow.cn | CNY |
| zhipuai | 智谱AI (Zhipu) | xxx | https://open.bigmodel.cn | CNY |
| openrouter | OpenRouter | sk-or-xxx | https://openrouter.ai | USD |
| minimax | MiniMax | xxx | https://api.minimax.chat | CNY |
| github | GitHub Copilot | ghp_xxx | https://api.github.com | - |
| kimi | Kimi (月之暗面) | sk-xxx | https://api.moonshot.cn | CNY |
| mimo | Mimo (小米) | xxx | https://api.mimo.com | CNY |
| custom | 自定义/中转站 | sk-xxx | 自定义 | 自定义 |

## 🎯 使用说明

### 1. 添加 API Key

- 点击「添加 Key」按钮
- 选择平台类型（名称可选填，自动生成）
- 填写 API Key
- 自定义平台需要填写 Base URL
- 保存后自动查询余额

### 2. 查询余额

- 每个卡片显示该 API Key 的余额信息
- 圆环图显示使用率百分比
- 进度条直观展示剩余额度
- 点击「刷新」按钮更新余额
- 点击「编辑」按钮修改配置
- 点击「删除」按钮移除配置（需确认）

### 3. 图表分析

- **柱状图**：对比各平台剩余额度
- **饼图**：展示额度占比分布
- **堆叠图**：显示已用和剩余的组合

### 4. 设置功能

点击右上角齿轮图标打开设置：
- 🎨 **外观设置**：切换深色/亮色模式
- 💾 **数据管理**：导出/导入配置、清除所有数据
- ℹ️ **关于信息**：查看应用版本和支持平台

## 🔧 高级配置

### 使用中转站

如果你使用的是 One API、New API 等中转站，请使用「自定义」选项，并填写正确的 Base URL。

### 余额查询规则

1. **官方 API**：优先使用官方余额查询接口
2. **兼容接口**：自动尝试多种常见的余额查询格式
3. **兜底方案**：最后回退到 OneAPI 兼容接口

### 调试技巧

打开浏览器控制台（F12）查看详细日志：
- 每个平台都有独立的日志标签（如 `[OpenAI]`、`[SiliconFlow]`）
- 记录完整的请求状态和响应数据
- 便于排查 API Key 或权限问题

## 📱 移动端适配

工具已完美适配移动设备，包括：
- 响应式网格布局
- 触摸友好的按钮设计
- 自适应字体大小
- 优化的弹窗交互

## 🛠️ 技术栈

- **前端框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **图表库**：Chart.js + vue-chartjs
- **工具库**：@vueuse/core
- **样式系统**：CSS 变量主题系统
- **数据存储**：localStorage 持久化

## 📝 开发说明

### 项目结构

```
src/
├── api/
│   └── providers.js          # 各平台 API 适配器
├── components/
│   ├── AddKeyModal.vue       # 添加/编辑弹窗
│   ├── BalanceCard.vue       # 余额卡片组件
│   ├── BalanceChart.vue      # 图表组件
│   ├── ConfirmModal.vue      # 确认弹窗
│   └── SettingsModal.vue     # 设置弹窗
├── stores/
│   └── keyStore.js           # 全局状态管理
├── App.vue                   # 主应用组件
└── main.js                   # 入口文件
```

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 添加新平台

在 `src/api/providers.js` 中添加新的平台配置：

```javascript
newplatform: {
  name: '新平台名称',
  color: '#颜色代码',
  icon: '图标emoji',
  baseUrl: 'https://api.example.com',
  async queryBalance(apiKey, baseUrl) {
    // 实现余额查询逻辑
    // 返回 { total, used, remaining, currency, ... }
  }
}
```

## 🤝 贡献欢迎

如果你发现任何问题或有改进建议，欢迎提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

---

**提示**：请妥善保管你的 API Key，不要将其分享给他人或在公开场合展示。本工具所有数据仅存储在本地浏览器中。