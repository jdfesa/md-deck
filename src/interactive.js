import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { readdirSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';

function getMarkdownFiles() {
  try {
    const files = readdirSync(process.cwd());
    return files.filter(f => extname(f).toLowerCase() === '.md');
  } catch (err) {
    return [];
  }
}

export async function startInteractiveMenu(buildPresentation, startServer) {
  const orange = chalk.hex('#FF8B3D');
  const darkOrange = chalk.hex('#CC5500');
  const lightOrange = chalk.hex('#FFB37C');
  const white = chalk.white;

  console.log('');
  console.log(orange('  ╭───────────────────────╮'));
  console.log(orange('  │ ') + white('◇ Info: md-deck     ') + orange('  │'));
  console.log(orange('  ╰───────────────────────╯'));
  console.log('');
  console.log(orange('  ███╗   ███╗██████╗       ██████╗ ███████╗██████╗ ██╗  ██╗'));
  console.log(orange('  ████╗ ████║██╔══██╗      ██╔══██╗██╔════╝██╔════╝██║ ██╔╝'));
  console.log(orange('  ██╔████╔██║██║  ██║█████╗██║  ██║█████╗  ██║     █████╔╝ '));
  console.log(darkOrange('  ██║╚██╔╝██║██║  ██║╚════╝██║  ██║██╔══╝  ██║     ██╔═██╗ '));
  console.log(darkOrange('  ██║ ╚═╝ ██║██████╔╝      ██████╔╝███████╗╚██████╗██║  ██╗'));
  console.log(darkOrange('  ╚═╝     ╚═╝╚═════╝       ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝'));
  console.log('');
  console.log(lightOrange('  > Description:'));
  console.log(white('  > md-deck (open source)'));
  console.log('');

  const action = await select({
    message: '¿Qué deseas hacer?',
    choices: [
      { name: '✨ Generar plantilla de presentación', value: 'template' },
      { name: '🛠️  Construir presentación', value: 'build' },
      { name: '🌐 Iniciar servidor (Live Preview)', value: 'serve' },
      { name: '❌ Salir', value: 'exit' }
    ]
  });

  if (action === 'exit') {
    console.log(chalk.gray('  ¡Hasta luego!\n'));
    process.exit(0);
  }
  
  if (action === 'template') {
    const filename = await input({ message: 'Nombre del archivo:', default: 'presentacion-demo.md' });
    const content = `---
title: Mi Presentación Genial
subtitle: Generado con md-deck
author: Tu Nombre
date: 2026-04-09
theme: moon
---

# ¡Hola Mundo!
Bienvenido a tu nueva presentación.

## Primera Sección
Esta diapositiva fue auto-paginada gracias a md-deck.

> [!tip] Consejo
> md-deck detecta tus títulos \`##\` para crear nuevas pantallas mágicamente.

## Columnas
:::columns
### Izquierda
Texto de la izquierda.
:::split
### Derecha
Texto de la derecha.
:::end

# ¡Gracias!
`;
    writeFileSync(filename, content);
    console.log('');
    console.log(chalk.green(`  ✅ Plantilla generada: ${filename}`));
    console.log(chalk.gray(`  Puedes abrirla en tu editor y luego ejecutar 'md-deck' para servirla.\n`));
    process.exit(0);
  }

  // File selection
  const mdFiles = getMarkdownFiles();
  let fileToActOn = '';

  if (mdFiles.length === 0) {
    console.log(chalk.yellow('  ⚠️  No se encontraron archivos .md en esta carpeta.'));
    fileToActOn = await input({ message: 'Ingresa la ruta de tu archivo .md:' });
  } else {
    fileToActOn = await select({
      message: 'Selecciona el archivo Markdown de origen:',
      choices: mdFiles.map(file => ({ name: `📄 ${file}`, value: file })).concat([
        { name: 'Escribir ruta manualmente...', value: 'manual' }
      ])
    });

    if (fileToActOn === 'manual') {
      fileToActOn = await input({ message: 'Ingresa la ruta de tu archivo .md:' });
    }
  }

  // Theme selection
  const theme = await select({
    message: 'Selecciona el tema de la presentación:',
    choices: [
      { name: 'Default', value: 'default' },
      { name: 'Dark', value: 'dark' },
      { name: 'Night', value: 'night' },
      { name: 'Moon', value: 'moon' },
      { name: 'Solarized', value: 'solarized' }
    ]
  });

  try {
    if (action === 'build') {
      const result = buildPresentation(fileToActOn, { theme, output: null });
      console.log('');
      console.log(chalk.green('  ✅ ¡Presentación construida exitosamente!'));
      console.log(chalk.blue(`  📂 ${result.outputDir}`));
      console.log(chalk.blue(`  📄 ${result.outputFile}`));
      console.log('');
    } else if (action === 'serve') {
      const portInput = await input({ message: 'Puerto:', default: '8080' });
      const portNum = parseInt(portInput, 10);
      
      const result = buildPresentation(fileToActOn, { theme, output: null, noUuid: true });
      const server = await startServer(result.outputDir, portNum);
      const actualPort = server.address().port;

      console.log('');
      console.log(chalk.cyan('  📽️  md-deck — Live Preview'));
      console.log(chalk.gray('  ─────────────────────────'));
      console.log(`  🌐 http://localhost:${actualPort}`);
      console.log(`  📂 ${result.outputDir}`);
      console.log(chalk.gray('  ⌨️  Presiona Ctrl+C para detener'));
      console.log('');
    }
  } catch (err) {
    console.error(chalk.red(`\n  ❌ Error: ${err.message}\n`));
    process.exit(1);
  }
}
