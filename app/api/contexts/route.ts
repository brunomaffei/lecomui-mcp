import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'react-docgen-typescript';
import path from 'path';
import fs from 'fs';

// Add a GET handler to support browser requests
export async function GET() {
  try {
    // Caminho correto para onde está o index.d.ts
    const typingsPath = path.resolve(process.cwd(), 'node_modules/lecom-ui/dist/index.d.ts');

    if (!fs.existsSync(typingsPath)) {
      return NextResponse.json(
        { error: `Arquivo não encontrado: ${typingsPath}` },
        { status: 500 }
      );
    }

    const parser = parse(typingsPath, {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    });

    const components = parser.map(comp => ({
      id: comp.displayName,
      name: comp.displayName,
      description: comp.description,
      type: 'tool',
      properties: Object.entries(comp.props || {}).map(([name, prop]: [string, {
        type?: { name: string };
        defaultValue?: { value: unknown };
        description?: string;
      }]) => ({
        name,
        type: prop.type?.name || 'unknown',
        defaultValue: prop.defaultValue?.value || null,
        description: prop.description || '',
      })),
    }));

    return NextResponse.json(components);
  } catch (error) {
    console.error('[ERRO MCP]', error);
    return NextResponse.json(
      { error: 'Erro ao processar os componentes. Verifique o caminho e tipos.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'JSON inválido ou ausente. Envie {"method": "initialize"} ou {"method": "..."}' },
      { status: 400 }
    );
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
    // Caminho correto para onde está o index.d.ts
    const typingsPath = path.resolve(process.cwd(), 'node_modules/lecom-ui/dist/index.d.ts');

    if (!fs.existsSync(typingsPath)) {
      return NextResponse.json(
        { error: `Arquivo não encontrado: ${typingsPath}` },
        { status: 500 }
      );
    }

    const parser = parse(typingsPath, {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    });

    const components = parser.map(comp => ({
      id: comp.displayName,
      name: comp.displayName,
      description: comp.description,
      type: 'tool',
      properties: Object.entries(comp.props || {}).map(([name, prop]: [string, {
        type?: { name: string };
        defaultValue?: { value: unknown };
        description?: string;
      }]) => ({
        name,
        type: prop.type?.name || 'unknown',
        defaultValue: prop.defaultValue?.value || null,
        description: prop.description || '',
      })),
    }));

    return NextResponse.json(components);
  } catch (error) {
    console.error('[ERRO MCP]', error);
    return NextResponse.json(
      { error: 'Erro ao processar os componentes. Verifique o caminho e tipos.' },
      { status: 500 }
    );
  }
}
