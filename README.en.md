# API Balance Checker

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?logo=chart.js)

**A Lightweight, Local Multi-platform API Key Balance Query and Management Tool**

[Features](#-features) • [Quick Start](#-quick-start) • [User Guide](#-user-guide) • [Architecture](#-architecture)

</div>

---

## 📖 Introduction

API Balance Checker is a clean and elegant web application that helps users centrally manage and monitor API Key balance usage across multiple AI platforms. All data is stored locally in your browser, with no privacy concerns.

### 💡 Core Values

- 🔒 **Privacy & Security**: All API Keys are stored locally only, nothing is uploaded to any server
- ⚡ **Lightweight & Fast**: Built with Vue 3 + Vite, fast startup and excellent performance
- 🎨 **Beautiful & User-friendly**: Modern UI design with light/dark theme switching
- 🌐 **Internationalization**: Supports Chinese and English bilingual switching
- 📊 **Visual Analytics**: Multiple chart types to intuitively understand quota usage

---

## ✨ Features

### 🔑 Multi-platform Support
Supports balance queries for mainstream AI platforms:
- **OpenAI** - GPT series models
- **Claude** - Anthropic Claude models
- **Google Gemini** - Google Gemini series
- **DeepSeek** - DeepSeek large language models
- **SiliconFlow** - SiliconFlow platform
- **ZhipuAI** - ChatGLM series
- **Custom Platform** - Supports OneAPI/NewAPI and other proxy stations

### 🌐 Multi-language Support
- **Chinese/English Switching** - Quick switch in navigation bar or settings
- **i18n Design** - All interface text is localized
- **Persistent Storage** - Language preference is automatically saved

### 📊 Smart Chart Analysis
- **Bar Chart** - Compare remaining balances across platforms
- **Pie Chart** - Show quota distribution percentages
- **Stacked Chart** - Display used and remaining combinations

### 💳 Card-based Management Interface
- Real-time balance and usage rate display
- Circular progress bar for intuitive remaining quota visualization
- One-click refresh, edit, and delete operations
- Support for batch refreshing all Keys

### 🌓 Theme System
- Free switching between light and dark modes
- Smooth transitions with CSS variables
- Automatic saving of user preferences

### 📱 Responsive Design
- Perfect adaptation for desktop and mobile
- Touch-friendly interaction design
- Adaptive layout and fonts

### 💾 Data Persistence
- Local storage based on localStorage
- Support for configuration export/import (JSON format)
- Automatic saving of query results and settings

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.x
- npm or pnpm
- Modern browser (Chrome/Firefox/Safari/Edge)

### Method 1: One-click Start (Recommended)

**Windows Users:**
```bash
start.bat
```

**Linux/Mac Users:**
```bash
chmod +x start.sh
./start.sh
```

The script will automatically install dependencies and start the development server.

### Method 2: Manual Start

```bash
# 1. Clone or download the project
cd api-balance-checker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Access the application
# Open http://localhost:5173 in your browser
```

### Method 3: Production Deployment

```bash
# Build production version
npm run build

# Preview build result
npm run preview
```

Built files are located in the `dist/` directory and can be deployed to any static server.

---

## 📋 Supported Platforms

| Platform | Name | API Key Format | Base URL | Currency |
|----------|------|----------------|----------|----------|
| OpenAI | OpenAI | `sk-xxx` | `https://api.openai.com` | USD |
| Claude | Anthropic Claude | `sk-ant-xxx` | `https://api.anthropic.com` | USD |
| Gemini | Google Gemini | `AIza-xxx` | `https://generativelanguage.googleapis.com` | USD |
| DeepSeek | DeepSeek | `sk-xxx` | `https://api.deepseek.com` | CNY |
| SiliconFlow | SiliconFlow | `sk-xxx` | `https://api.siliconflow.cn` | CNY |
| ZhipuAI | ZhipuAI | `xxx` | `https://open.bigmodel.cn` | CNY |
| Custom | Custom Platform | `sk-xxx` | Custom | Custom |

> 💡 **Tip**: If you're using OneAPI, NewAPI, or other proxy stations, select "Custom" option and fill in the correct Base URL.

---

## 🎯 User Guide

### 1️⃣ Add API Key

1. Click the **"Add Key"** button in the top navigation bar
2. Select the platform type in the modal
3. Fill in the following information:
   - **Name**: A recognizable note (e.g., "Personal Account", "Team Shared")
   - **API Key**: The key obtained from the corresponding platform
   - **Base URL**: Required for custom platforms (auto-filled for others)
4. Click **"Save"**, the system will automatically query the balance

### 2️⃣ View and Manage Balances

Each API Key is displayed as a card containing:
- 💰 **Balance Value** - Precise to 4 decimal places
- 📈 **Usage Rate Ring** - Visual display of used proportion
- 📊 **Progress Bar** - Intuitive display of remaining quota
- 🔄 **Refresh Button** - Update latest balance
- ✏️ **Edit Button** - Modify configuration
- 🗑️ **Delete Button** - Remove the Key (requires confirmation)

### 3️⃣ Chart Analysis

Click the chart icon in the top stats bar to switch between three views:

- **📊 Bar Chart** - Horizontally compare remaining balances across platforms
- **🥧 Pie Chart** - View each platform's percentage of total quota
- **📈 Stacked Chart** - Simultaneously display used and remaining quotas

### 4️⃣ Settings and Data Management

Click the **⚙️ Settings** icon in the top right:

#### Appearance Settings
- Toggle dark/light mode
- Real-time preview

#### Data Management
- **Export Config** - Save all configurations to a JSON file (with timestamp)
- **Import Config** - Restore configurations from JSON file (will overwrite existing data)
- **Clear All Data** - Delete all API Keys and settings (requires double confirmation)

#### About Information
- View app version and tech stack
- See list of supported platforms

---

## 🔧 Advanced Configuration

### Using Proxy Stations

If you're using **OneAPI**, **NewAPI**, or other API proxy services:

1. Select platform type as **"Custom"**
2. Fill in the proxy station's Base URL (e.g., `https://your-proxy.com/v1`)
3. Fill in the corresponding API Key
4. The system will automatically try multiple balance query endpoints

### Balance Query Mechanism

The system uses an intelligent query strategy:

1. **Official API First** - First tries the platform's official balance query endpoint
2. **Compatible API Fallback** - Automatically tries common OneAPI formats
3. **Multi-endpoint Attempts** - Tests multiple possible API paths sequentially
4. **Detailed Logging** - Complete request/response information available in browser console

### Handling 403 Errors

If you encounter a 403 permission error:

**OpenAI Platform:**
- ✅ Personal API Keys can usually query normally
- ❌ Organization API Keys require admin permission to access billing information
- 💡 Contact your organization admin for permission, or use a personal account API Key

**Other Platforms:**
- Check if the API Key has balance query permissions
- Confirm in the platform console if the feature is enabled
- Try using "Custom" platform type for manual configuration

---

## 🏗️ Architecture

### Tech Stack

```
Frontend Framework: Vue 3.5 (Composition API)
Build Tool: Vite 8.0
Chart Library: Chart.js 4.5 + vue-chartjs 5.3
State Management: @vueuse/core 14.3
Styling: CSS Variables + Native CSS
```

### Project Structure

```
api-balance-checker/
├── src/
│   ├── api/
│   │   └── providers.js          # Balance query logic for each platform
│   ├── components/
│   │   ├── AddKeyModal.vue       # Add/Edit Key modal
│   │   ├── BalanceCard.vue       # Balance card component
│   │   ├── BalanceChart.vue      # Chart component
│   │   ├── ConfirmModal.vue      # Confirmation dialog
│   │   └── SettingsModal.vue     # Settings modal
│   ├── locales/
│   │   ├── index.js              # i18n core module
│   │   ├── zh-CN.js              # Chinese language pack
│   │   └── en-US.js              # English language pack
│   ├── stores/
│   │   └── keyStore.js           # API Key state management
│   ├── App.vue                   # Root component
│   ├── main.js                   # Application entry
│   └── style.css                 # Global styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Project configuration
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation (Chinese)
```

### Core Design

- **Component Architecture** - Functional modules independently encapsulated for easy maintenance and expansion
- **Reactive State Management** - Pinia-style store for unified data management
- **Composition API** - Vue 3 Composition API for improved code reusability
- **Theme System** - CSS variables for flexible light/dark theme switching
- **Local-first** - All data stored in browser localStorage

---

## 📱 Mobile Adaptation

The application is fully adapted for mobile devices:

- ✅ Responsive grid layout, automatically adjusts columns
- ✅ Touch-friendly button sizes (minimum 44px)
- ✅ Adaptive font sizes and spacing
- ✅ Optimized modal interaction experience
- ✅ Supports both landscape and portrait orientations

---

## 🔒 Privacy & Security

We take user privacy very seriously:

- 🛡️ **Zero Data Upload** - All API Keys and query results are stored only in local browser
- 🔐 **No Backend Service** - Pure frontend application, no server-side data collection
- 🚫 **No Tracking Code** - No analytics, statistics, or tracking scripts
- 💾 **Full User Control** - Export, import, or clear all data at any time

> ⚠️ **Important**: Please keep your API Keys secure and do not share them with others. Regularly clean up Keys you no longer use.

---

## 🤝 Contributing

Welcome to contribute code, report issues, or suggest improvements!

### How to Contribute

1. **Fork** this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Development Guidelines

- Follow Vue 3 Composition API best practices
- Maintain consistent code style
- Add necessary comments
- Ensure functionality works across different browsers

### Reporting Issues

If you encounter problems, please provide:
- Problem description and reproduction steps
- Browser version and operating system
- Console error messages (if any)
- Screenshots or screen recordings (optional but helpful)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Thanks to the following open source projects:

- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Build Tool
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible chart library
- [VueUse](https://vueuse.org/) - Vue Composition Utility Collection

---

## 📞 Contact

- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues](https://github.com/noc228076/api-balance-checker/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/noc228076/api-balance-checker/discussions)

---

<div align="center">

**⭐ If this project helps you, please give it a Star!**

Made with ❤️ by [Your Name]

</div>
