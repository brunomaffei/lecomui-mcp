import fs from 'fs';
import path from 'path';
import { parse } from 'react-docgen-typescript';

const typingsPath = path.resolve(process.cwd(), 'node_modules/lecom-ui/dist/index.d.ts');
const outputDir = path.resolve(process.cwd(), 'model');
const outputPath = path.join(outputDir, 'lecomui-context.json');

// Garante que a pasta model/ existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const parser = parse(typingsPath, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
});

// ⚠️ Filtro: apenas componentes React.FC com `props` válidos
const components = parser
  .filter(comp => comp.displayName && comp.props && Object.keys(comp.props).length > 0)
  .map(comp => ({
    id: comp.displayName,
    name: comp.displayName,
    description: comp.description || '',
    type: 'tool',
    properties: Object.entries(comp.props || {})
      .filter(([name]) =>
        ![
          'dangerouslySetInnerHTML',
          'onCopy',
          'onCopyCapture',
          'onCut',
          'onCutCapture',
          'onPaste',
          'onPasteCapture',
          'string'
        ].includes(name)
      )
      .map(([name, prop]: any) => ({
        name,
        type: prop.type?.name || 'unknown',
        defaultValue: prop.defaultValue?.value || null,
        description: prop.description || '',
      })),
  }));


// Salva o JSON gerado
fs.writeFileSync(outputPath, JSON.stringify(components, null, 2), 'utf-8');
console.log(`✅ ${components.length} contextos gerados em ${outputPath}`);
