# 豆瓣 MCP 服务器

[English](README.md) | [中文](README.zh-CN.md)

这个 MCP 服务器提供了与豆瓣内容交互的功能，包括图书、电影、电视剧和小组讨论等。

## 功能特性

- 书籍：搜索、查看图书评论
- 电影、电视剧：搜索、查看评论
- 小组讨论：列出话题、查看话题详情

## 工具

- **search-book**
  - 从豆瓣搜索图书信息
  - 输入参数:
    - `isbn` (字符串, 可选): 图书的 ISBN 编号
    - `q` (字符串, 可选): 图书标题的搜索关键词

- **list-book-reviews**
  - 获取豆瓣图书评论
  - 输入参数:
    - `id` (字符串): 豆瓣图书 ID

- **search-movie**
  - 从豆瓣搜索电影、电视剧信息
  - 输入参数:
    - `q` (字符串): 电影、电视剧标题的搜索关键词

- **list-movie-reviews**
  - 获取豆瓣电影评论
  - 输入参数:
    - `id` (字符串): 豆瓣电影 ID

- **list-tv-reviews**
  - 获取豆瓣电视剧评论
  - 输入参数:
    - `id` (字符串): 豆瓣电视剧 ID

- **browse**
  - 在默认浏览器中打开图书详情页
  - 输入参数:
    - `id` (字符串): 豆瓣图书 ID

- **list-group-topics**
  - 列出豆瓣小组话题
  - 输入参数:
    - `id` (字符串, 可选): 豆瓣小组 ID (默认为 '732764')
    - `tags` (字符串数组, 可选): 按标签筛选话题
    - `from_date` (字符串, 可选): 按日期筛选话题 (格式: "YYYY-MM-DD")

- **get-group-topic-detail**
  - 获取特定话题的详情
  - 输入参数:
    - `id` (字符串): 豆瓣话题 ID

## 资源

- [豆瓣 API 文档](https://goddlts.github.io/douban-api-docs/)

## 安装

### 1. 配置 GitHub Packages 认证

创建或编辑 `~/.npmrc`，添加以下内容：

```
@yousong:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

将 `YOUR_GITHUB_TOKEN` 替换为你的 GitHub Personal Access Token（需包含 `read:packages` 权限）。

### 2. 安装包

```bash
npm install -g @yousong/douban-mcp
```

## 启动

```bash
douban-mcp
```

作为 MCP stdio 服务器使用：

```json
{
  "mcpServers": {
    "douban": {
      "command": "douban-mcp"
    }
  }
}
```

## 许可证

本项目采用 MIT 许可证。
