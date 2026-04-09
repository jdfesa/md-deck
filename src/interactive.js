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

  // Banner — solo se muestra una vez
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

  // Loop principal — vuelve al menú después de cada acción
  while (true) {
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
      await handleTemplate();
      continue;
    }

    // Para build y serve, necesitamos archivo y tema
    const fileToActOn = await selectFile();
    if (!fileToActOn) continue;

    const theme = await selectTheme();

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
        return; // Serve bloquea — no volver al menú
      }
    } catch (err) {
      console.error(chalk.red(`\n  ❌ Error: ${err.message}\n`));
    }
  }
}

// ── Helpers ──

async function selectFile() {
  const mdFiles = getMarkdownFiles();

  if (mdFiles.length === 0) {
    console.log(chalk.yellow('  ⚠️  No se encontraron archivos .md en esta carpeta.'));
    return await input({ message: 'Ingresa la ruta de tu archivo .md:' });
  }

  const chosen = await select({
    message: 'Selecciona el archivo Markdown de origen:',
    choices: mdFiles.map(file => ({ name: `📄 ${file}`, value: file })).concat([
      { name: '✏️  Escribir ruta manualmente...', value: 'manual' },
      { name: '↩️  Volver al menú', value: 'back' }
    ])
  });

  if (chosen === 'back') return null;
  if (chosen === 'manual') return await input({ message: 'Ingresa la ruta de tu archivo .md:' });
  return chosen;
}

async function selectTheme() {
  return await select({
    message: 'Selecciona el tema de la presentación:',
    choices: [
      { name: '🎨 Default (Dark Premium)', value: 'default' },
      { name: '🌑 Dark', value: 'dark' },
      { name: '🌙 Night', value: 'night' },
      { name: '🌕 Moon', value: 'moon' },
      { name: '☀️  Solarized', value: 'solarized' }
    ]
  });
}

async function handleTemplate() {
  const filename = await input({ message: 'Nombre del archivo:', default: 'presentacion-demo.md' });
  const today = new Date().toISOString().split('T')[0];
  const content = `---
title: Plantilla Demostrativa
subtitle: Guía visual de componentes md-deck
author: Tu Nombre
date: "${today}"
institution: Tu Institución
subject: Materia
professor: Nombre del Profesor
theme: default
lang: es
---

# Plantilla Demostrativa
Guía visual de componentes md-deck

---

## Introducción
Esta plantilla muestra **todos los componentes** que soporta md-deck. Usala como referencia para construir tus propias presentaciones.

---

### Viñetas y Listas

Listas desordenadas:

- Primer punto importante
- Segundo punto con **énfasis**
- Tercer punto con *cursiva*

Listas ordenadas:

1. Paso uno del proceso
2. Paso dos del proceso
3. Paso tres del proceso

---

### Callout: Nota

> [!note] Información general
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Las notas se usan para dar contexto adicional sin interrumpir el flujo principal de la presentación.

---

### Callout: Tip

> [!tip] Buena práctica
> Utilizá separadores \`---\` para crear diapositivas manualmente, o dejá que el auto-paginador lo haga por vos detectando tus títulos \`##\` y \`###\`.

---

### Callout: Advertencia

> [!warning] Atención
> Lorem ipsum dolor sit amet. Las advertencias resaltan puntos donde el lector debe tener precaución o considerar posibles riesgos.

---

### Callout: Importante

> [!important] Concepto clave
> Este tipo de callout se utiliza para conceptos que no se pueden olvidar. Ideal para definiciones, teoremas o reglas fundamentales.

---

### Callout: Card

> [!card] Tarjeta Estilizada
> Las cards son perfectas para encapsular información dentro de un contenedor visual con borde y fondo. Excelente para resúmenes o datos destacados.

---

### Callout: Problema

> [!problem] Enunciado del Ejercicio
> Dado un arreglo de N números enteros, diseñar un algoritmo que encuentre el subconjunto de suma máxima. Analizar la complejidad temporal de la solución propuesta.

---

### Código: Python

\`\`\`python
def fibonacci(n: int) -> list:
    """Genera los primeros n números de Fibonacci."""
    if n <= 0:
        return []
    
    secuencia = [0, 1]
    for i in range(2, n):
        secuencia.append(secuencia[-1] + secuencia[-2])
    
    return secuencia[:n]

# Ejemplo de uso
resultado = fibonacci(10)
print(f"Fibonacci: {resultado}")
\`\`\`

---

### Código: Java

\`\`\`java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1; // No encontrado
    }
    
    public static void main(String[] args) {
        int[] datos = {2, 5, 8, 12, 16, 23, 38, 56};
        System.out.println("Índice: " + search(datos, 23));
    }
}
\`\`\`

---

### Tablas

| Algoritmo | Mejor Caso | Caso Promedio | Peor Caso |
|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |
| Binary Search | O(1) | O(log n) | O(log n) |

---

### Layout de Dos Columnas

:::columns

#### Ventajas
- Separación contenido/diseño
- Control de versiones con Git
- Offline-first
- Exportable y autocontenido

:::split

#### Tecnologías
- **Motor**: Reveal.js 5.1
- **Parser**: Marked (GFM)
- **Fuentes**: Inter + JetBrains Mono
- **Highlighting**: Highlight.js

:::end

---

### Columnas con Código

:::columns

#### Descripción
El patrón **Singleton** garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.

:::split

\`\`\`python
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
\`\`\`

:::end

---

### Múltiples Callouts Combinados

> [!tip] Recordá
> Podés combinar cualquier componente en una misma diapositiva.

> [!warning] Cuidado
> Si la diapositiva tiene mucho contenido, aparecerá un indicador de scroll automáticamente.

---

# ¡Gracias!
Presentación generada con md-deck
`;
  writeFileSync(filename, content);
  console.log('');
  console.log(chalk.green(`  ✅ Plantilla generada: ${filename}`));
  console.log(chalk.gray(`  Abrila en tu editor, personalizala, y ejecutá 'md-deck' para servirla.\n`));
}
