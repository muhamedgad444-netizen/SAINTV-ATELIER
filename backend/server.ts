import "dotenv/config";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import * as healthRoute from "./api/health.js";
import * as productsRoute from "./api/products/index.js";
import * as productByIdRoute from "./api/products/[id].js";
import * as ordersRoute from "./api/orders/index.js";
import * as orderByIdRoute from "./api/orders/[id].js";
import * as newsletterRoute from "./api/newsletter/index.js";
import { errorResponse } from "./lib/http.js";

type RouteModule = {
  GET?: (req: Request) => Response | Promise<Response>;
  POST?: (req: Request) => Response | Promise<Response>;
  PATCH?: (req: Request) => Response | Promise<Response>;
  DELETE?: (req: Request) => Response | Promise<Response>;
  OPTIONS?: (req: Request) => Response | Promise<Response>;
};

async function toWebRequest(req: IncomingMessage, port: number): Promise<Request> {
  const host = req.headers.host || `127.0.0.1:${port}`;
  const url = `http://${host}${req.url || "/"}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers.set(key, value.join(", "));
    else if (value !== undefined) headers.set(key, value);
  }

  const method = (req.method || "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return new Request(url, { method, headers });
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
  return new Request(url, { method, headers, body });
}

function matchRoute(pathname: string): RouteModule | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/api/health") return healthRoute;
  if (clean === "/api/products") return productsRoute;
  if (clean.startsWith("/api/products/") && clean.split("/").length === 4) {
    return productByIdRoute;
  }
  if (clean === "/api/orders") return ordersRoute;
  if (clean.startsWith("/api/orders/") && clean.split("/").length === 4) {
    return orderByIdRoute;
  }
  if (clean === "/api/newsletter") return newsletterRoute;
  return null;
}

async function sendWebResponse(res: ServerResponse, webRes: Response): Promise<void> {
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const arrayBuf = await webRes.arrayBuffer();
  res.end(Buffer.from(arrayBuf));
}

const PORT = Number(process.env.PORT || 3001);

const server = createServer(async (req, res) => {
  try {
    const webReq = await toWebRequest(req, PORT);
    const { pathname } = new URL(webReq.url);
    const route = matchRoute(pathname);

    if (!route) {
      await sendWebResponse(res, errorResponse(`Route not found: ${pathname}`, 404));
      return;
    }

    const method = webReq.method.toUpperCase() as keyof RouteModule;
    const handler = route[method];
    if (!handler) {
      await sendWebResponse(res, errorResponse(`Method ${method} not allowed`, 405));
      return;
    }

    const webRes = await handler(webReq);
    await sendWebResponse(res, webRes);
  } catch (err) {
    console.error("[backend/server] Unhandled error:", err);
    await sendWebResponse(res, errorResponse("Internal server error", 500));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`SAINTV backend listening on http://127.0.0.1:${PORT}`);
});
