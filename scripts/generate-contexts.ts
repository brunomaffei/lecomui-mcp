import fs from 'fs';
import path from 'path';
import { parse } from 'react-docgen-typescript';

const dtsPath = path.resolve(
  process.cwd(),
  'node_modules/lecom-ui/dist/index.d.ts'
);

const parser = parse(dtsPath, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
});

const components = parser.map(comp => ({
  id: comp.displayName,
  name: comp.displayName,
  description: comp.description,
  type: 'tool',
  properties: Object.entries(comp.props || {}).map(([name, prop]: any) => ({
    name,
    type: prop.type?.name || 'unknown',
    defaultValue: prop.defaultValue?.value || null,
    description: prop.description || '',
  })),
}));

// Salva em: model/lecomui-context.json
const outputPath = path.resolve(process.cwd(), 'model/lecomui-context.json');
fs.writeFileSync(outputPath, JSON.stringify(components, null, 2), 'utf-8');

console.log('✅ Contextos gerados em:', outputPath);
