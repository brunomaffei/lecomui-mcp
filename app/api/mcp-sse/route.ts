import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const contextPath = path.resolve(process.cwd(), 'model/lecomui-context.json');

      const sendContexts = () => {
        try {
          const raw = fs.readFileSync(contextPath, 'utf-8');
          const contexts = JSON.parse(raw);

          const message = {
            jsonrpc: "2.0",
            method: "context/refresh",
            params: {
              contexts
            }
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
        } catch (e) {
          console.error('[SSE ERROR]', e);
        }
      };

      sendContexts();

      const interval = setInterval(() => {
        sendContexts();
      }, 30000);

      req.signal.addEventListener('abort', () => clearInterval(interval));
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    }
  });
}
