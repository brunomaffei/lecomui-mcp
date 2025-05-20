import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido ou ausente.' }, { status: 400 });
  }

  const { method, id } = body;

  if (method === 'initialize') {
    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      result: {
        capabilities: { contextProvider: true },
      },
    });
  }

  try {
    const filePath = path.resolve(process.cwd(), 'model/lecomui-context.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Arquivo lecomui-context.json não encontrado na Vercel.' },
      { status: 500 }
    );
  }
}
