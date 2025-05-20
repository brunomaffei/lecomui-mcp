import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const contextPath = path.resolve(process.cwd(), 'model/lecomui-context.json');
      const raw = fs.readFileSync(contextPath, 'utf-8');
      const message = `data: ${raw}\n\n`;
      controller.enqueue(encoder.encode(message));

      const interval = setInterval(() => {
        const data = fs.readFileSync(contextPath, 'utf-8');
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 30000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
