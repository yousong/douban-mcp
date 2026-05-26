#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { TOOL } from "./types.js";
import { 
  getBookReviews, 
  getGroupTopicDetail, 
  getGroupTopics, 
  getMovieReviews, 
  getTVReviews, 
  searchBooks, 
  searchMovies 
} from "./api.js";
import open from 'open';

const server = new McpServer({
  name: "L-Chris/douban-mcp",
  version: "0.3.0",
});

// 统一处理工具执行与返回格式，直接返回 API 原始 JSON 结果
const executeTool = async (handler: () => Promise<any>) => {
  const result = await handler();
  return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
};

server.tool(
  TOOL.SEARCH_BOOK,
  'search books from douban, either by ISBN or by query',
  {
    q: z.string().optional().describe('query string, e.g. "python"'),
    isbn: z.string().optional().describe('ISBN number, e.g. "9787501524044"')
  },
  async (args) => {
    if (!args.isbn && !args.q) {
      throw new McpError(ErrorCode.InvalidParams, "Either q or isbn must be provided");
    }
    return executeTool(() => searchBooks(args));
  }
);

server.tool(
  TOOL.LIST_BOOK_REVIEWS,
  "list book reviews",
  {
    id: z.string().describe('douban book id, e.g. "1234567890"')
  },
  async (args) => executeTool(() => getBookReviews(args))
);

server.tool(
  TOOL.SEARCH_MOVIE,
  'search movies or tvs from douban by query',
  {
    q: z.string().describe('query string, e.g. "python"')
  },
  async (args) => executeTool(() => searchMovies(args))
);

server.tool(
  TOOL.LIST_MOVIE_REVIEWS,
  "list movie reviews",
  {
    id: z.string().describe('douban movie id, e.g. "1234567890"')
  },
  async (args) => executeTool(() => getMovieReviews(args))
);

server.tool(
  'list-tv-reviews',
  "list tv reviews",
  {
    id: z.string().describe('douban tv id, e.g. "1234567890"')
  },
  async (args) => executeTool(() => getTVReviews(args))
);

server.tool(
  TOOL.BROWSE,
  "open default browser and browse douban book detail",
  {
    id: z.string().describe('douban book id, e.g. "1234567890"')
  },
  async (args) => {
    await open(`https://book.douban.com/subject/${args.id}/`);
    return { content: [{ type: 'text' as const, text: "The Douban Book Page has been opened in your default browser" }] };
  }
);

server.tool(
  TOOL.LIST_GROUP_TOPICS,
  "list group topics",
  {
    id: z.string().optional().describe('douban group id'),
    tags: z.array(z.string()).optional().describe('tags, e.g. ["python"]'),
    from_date: z.string().optional().describe('from date, e.g. "2024-01-01"')
  },
  async (args) => {
    const id = args.id || '732764';
    return executeTool(() => getGroupTopics({ id, tags: args.tags, from_date: args.from_date }));
  }
);

server.tool(
  TOOL.GET_GROUP_TOPIC_DETAIL,
  "get group topic detail",
  {
    id: z.string().describe('douban group topic id, e.g. "1234567890"')
  },
  async (args) => executeTool(() => getGroupTopicDetail(args))
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
