import app from "./app";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
			content: [{ type: "text", text: String(a + b) }],
		}));
	}
}

const mcpHandler = MyMCP.mount('/');

// Export a request handler that checks the transport header
export default {
	async fetch(request: Request, env: any, ctx: any) {
		return mcpHandler.fetch(request, env, ctx);
	  const isSse = request.headers.get('accept')?.includes("text/event-stream");
	  const isMessage = request.url.includes("message");

	  if (isMessage || isSse) {
		return mcpHandler.fetch(request, env, ctx);
	  } else {
		console.log("Default request");
		return app.fetch(request, env, ctx);
	  }
	}
  };