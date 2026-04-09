---
title: Plantilla Demostrativa
subtitle: Guía visual de componentes md-deck
author: Tu Nombre
date: "2026-04-09"
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
> Utilizá separadores `---` para crear diapositivas manualmente, o dejá que el auto-paginador lo haga por vos detectando tus títulos `##` y `###`.

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

```python
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
```

---

### Código: Java

```java
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
```

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

```python
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

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
