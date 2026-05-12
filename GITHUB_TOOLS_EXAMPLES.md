# GitHub MCP 工具使用示例

本文档展示了如何使用可用的 GitHub MCP 工具来完成各种常见任务。

## 📋 目录

- [搜索仓库](#1-搜索仓库)
- [获取文件内容](#2-获取文件内容)
- [管理 Issues](#3-管理-issues)
- [管理 Pull Requests](#4-管理-pull-requests)
- [分支操作](#5-分支操作)
- [实际应用场景](#6-实际应用场景)

---

## 1. 搜索仓库

### 示例 1: 搜索流行的 Vue.js 项目

```javascript
// 搜索星星数大于 10000 的 Vue.js 相关仓库
mcp_github_search_repositories({
  query: "vue stars:>10000",
  page: 1,
  perPage: 10
})
```

### 示例 2: 搜索特定主题的 JavaScript 项目

```javascript
// 搜索与 AI 相关的 JavaScript 项目
mcp_github_search_repositories({
  query: "language:JavaScript topic:ai stars:>1000",
  page: 1,
  perPage: 5
})
```

---

## 2. 获取文件内容

### 示例 1: 获取 README 文件

```javascript
// 获取 Vue.js core 仓库的 README
mcp_github_get_file_contents({
  owner: "vuejs",
  repo: "core",
  path: "README.md",
  branch: "main"
})
```

### 示例 2: 获取 package.json

```javascript
// 获取项目的 package.json 配置
mcp_github_get_file_contents({
  owner: "your-username",
  repo: "your-repo",
  path: "package.json"
})
```

---

## 3. 管理 Issues

### 示例 1: 创建新 Issue

```javascript
// 创建一个 Bug 报告
mcp_github_create_issue({
  owner: "your-username",
  repo: "your-repo",
  title: "Bug: 登录页面无法加载",
  body: `## 问题描述
用户在访问登录页面时遇到白屏问题。

## 复现步骤
1. 访问 /login 页面
2. 页面显示空白

## 期望行为
应该正常显示登录表单

## 环境信息
- 浏览器: Chrome 120
- 操作系统: Windows 11`,
  labels: ["bug", "high-priority"],
  assignees: ["developer-name"]
})
```

### 示例 2: 列出所有开放的 Issues

```javascript
// 获取所有未解决的 issues
mcp_github_list_issues({
  owner: "your-username",
  repo: "your-repo",
  state: "open",
  sort: "created",
  direction: "desc",
  per_page: 20
})
```

### 示例 3: 更新 Issue

```javascript
// 更新 issue 状态和标签
mcp_github_update_issue({
  owner: "your-username",
  repo: "your-repo",
  issue_number: 42,
  state: "closed",
  labels: ["fixed", "verified"],
  title: "[已修复] 登录页面无法加载"
})
```

### 示例 4: 添加评论

```javascript
// 在 issue 中添加评论
mcp_github_add_issue_comment({
  owner: "your-username",
  repo: "your-repo",
  issue_number: 42,
  body: "这个问题已经在 PR #45 中修复，将在下一个版本中发布。"
})
```

---

## 4. 管理 Pull Requests

### 示例 1: 创建 Pull Request

```javascript
// 创建一个新的 PR
mcp_github_create_pull_request({
  owner: "your-username",
  repo: "your-repo",
  title: "feat: 添加用户认证功能",
  body: `## 变更说明
- 添加了 JWT 认证中间件
- 实现了登录/登出接口
- 添加了 token 刷新机制

## 测试
- [x] 单元测试通过
- [x] 集成测试通过
- [x] 手动测试完成`,
  head: "feature/auth-system",
  base: "main",
  draft: false,
  maintainer_can_modify: true
})
```

### 示例 2: 列出 Pull Requests

```javascript
// 获取所有开放的 PRs
mcp_github_list_pull_requests({
  owner: "your-username",
  repo: "your-repo",
  state: "open",
  sort: "updated",
  direction: "desc"
})
```

### 示例 3: 获取 PR 详情

```javascript
// 获取特定 PR 的详细信息
mcp_github_get_pull_request({
  owner: "your-username",
  repo: "your-repo",
  pull_number: 123
})
```

### 示例 4: 获取 PR 的文件变更

```javascript
// 查看 PR 中修改了哪些文件
mcp_github_get_pull_request_files({
  owner: "your-username",
  repo: "your-repo",
  pull_number: 123
})
```

### 示例 5: 审查 PR

```javascript
// 批准一个 PR
mcp_github_create_pull_request_review({
  owner: "your-username",
  repo: "your-repo",
  pull_number: 123,
  event: "APPROVE",
  body: "代码看起来不错，已经测试通过，可以合并！"
})
```

### 示例 6: 合并 PR

```javascript
// 使用 squash 方式合并 PR
mcp_github_merge_pull_request({
  owner: "your-username",
  repo: "your-repo",
  pull_number: 123,
  merge_method: "squash",
  commit_title: "feat: 添加用户认证功能 (#123)",
  commit_message: "完整实现 JWT 认证系统"
})
```

---

## 5. 分支操作

### 示例 1: 创建新分支

```javascript
// 从 main 分支创建新的 feature 分支
mcp_github_create_branch({
  owner: "your-username",
  repo: "your-repo",
  branch: "feature/new-feature",
  from_branch: "main"
})
```

### 示例 2: 获取提交历史

```javascript
// 获取 main 分支最近的 commits
mcp_github_list_commits({
  owner: "your-username",
  repo: "your-repo",
  sha: "main",
  perPage: 10,
  page: 1
})
```

---

## 6. 实际应用场景

### 场景 1: 自动化 Release 流程

```javascript
// 1. 创建 release 分支
await mcp_github_create_branch({
  owner: "company",
  repo: "product",
  branch: "release/v1.2.0",
  from_branch: "main"
});

// 2. 创建 release PR
await mcp_github_create_pull_request({
  owner: "company",
  repo: "product",
  title: "Release v1.2.0",
  body: "准备发布 v1.2.0 版本",
  head: "release/v1.2.0",
  base: "main"
});

// 3. 创建 release issue 跟踪进度
await mcp_github_create_issue({
  owner: "company",
  repo: "product",
  title: "Release v1.2.0 Checklist",
  body: "- [ ] 更新版本号\n- [ ] 更新 CHANGELOG\n- [ ] 运行测试\n- [ ] 构建产物",
  labels: ["release"]
});
```

### 场景 2: 批量关闭过时 Issues

```javascript
// 1. 获取所有标记为 stale 的 issues
const issues = await mcp_github_list_issues({
  owner: "project",
  repo: "repo",
  state: "open",
  labels: ["stale"]
});

// 2. 逐个关闭并添加评论
for (const issue of issues) {
  await mcp_github_add_issue_comment({
    owner: "project",
    repo: "repo",
    issue_number: issue.number,
    body: "由于长时间没有活动，此 issue 将被关闭。如果问题仍然存在，请重新打开。"
  });
  
  await mcp_github_update_issue({
    owner: "project",
    repo: "repo",
    issue_number: issue.number,
    state: "closed"
  });
}
```

### 场景 3: 代码审查助手

```javascript
// 1. 获取待审查的 PRs
const prs = await mcp_github_list_pull_requests({
  owner: "team",
  repo: "project",
  state: "open",
  sort: "created"
});

// 2. 检查每个 PR 的状态
for (const pr of prs) {
  // 获取 PR 详情
  const details = await mcp_github_get_pull_request({
    owner: "team",
    repo: "project",
    pull_number: pr.number
  });
  
  // 获取状态检查
  const status = await mcp_github_get_pull_request_status({
    owner: "team",
    repo: "project",
    pull_number: pr.number
  });
  
  // 如果所有检查通过，自动批准
  if (status.state === "success") {
    await mcp_github_create_pull_request_review({
      owner: "team",
      repo: "project",
      pull_number: pr.number,
      event: "APPROVE",
      body: "所有 CI 检查通过，自动批准。"
    });
  }
}
```

### 场景 4: 同步配置文件

```javascript
// 从模板仓库获取最新配置
const configContent = await mcp_github_get_file_contents({
  owner: "organization",
  repo: "templates",
  path: ".github/workflows/ci.yml"
});

// 然后可以使用 create_or_update_file 更新到你的仓库
// （需要配合其他工具使用）
```

---

## 💡 最佳实践

1. **错误处理**: 始终检查 API 调用的返回值，处理可能的错误
2. **分页**: 对于大量数据，使用 page 和 perPage 参数进行分页处理
3. **速率限制**: GitHub API 有速率限制，避免短时间内大量请求
4. **权限**: 确保使用的 token 具有足够的权限执行操作
5. **分支保护**: 在操作受保护的分支时要特别小心
6. **文档化**: 为创建的 Issues 和 PRs 提供清晰的描述

---

## 🔗 相关资源

- [GitHub REST API 文档](https://docs.github.com/en/rest)
- [GitHub CLI 文档](https://cli.github.com/manual/)
- [Octokit.js - GitHub API 客户端](https://octokit.github.io/rest.js/)

---

*最后更新: 2026-05-12*
