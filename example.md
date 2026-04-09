---
title: "Relaciones entre Clases en UML"
subtitle: "Composición · Agregación · Asociación · Herencia"
author: "José David Fernando Sandoval"
date: "08 de Abril de 2026"
institution: "IES N° 6023 \"Dr. Alfredo Loutaif\""
subject: "Programación Orientada a Objetos"
professor: "Prof. Lic. Arroyo Carlos"
lang: es
---

# Relaciones entre Clases en UML
Composición · Agregación · Asociación · Herencia

---

## Guía Rápida de Relaciones UML
Los cuatro tipos fundamentales de relaciones entre clases que necesitamos dominar.

---

### 📖 Tabla de Relaciones

| Relación | Símbolo | PlantUML | Concepto | Ejemplo |
|---|---|---|---|---|
| **Asociación** | Línea continua **—** | `--` | "Conoce a" / "Usa un" | Cliente — Producto |
| **Agregación** | Rombo hueco **♢—** | `o--` | "Agrupa a" | Equipo ♢— Jugador |
| **Composición** | Rombo relleno **♦—** | `*--` | "Compuesto por" | Casa ♦— Habitación |
| **Herencia** | Triángulo hueco **◁—** | `<\|--` | "Es un tipo de" | Vehículo ◁— Auto |

---

### 📖 Asociación y Agregación

:::columns

> [!card] 🔗 Asociación Simple
> **Símbolo:** Línea continua `--`
>
> Es la conexión lógica más básica. Dos clases interactúan pero **ambas son completamente independientes**.
>
> Si borrás una del sistema, la otra sigue existiendo sin problemas.

:::split

> [!card] 📦 Agregación — Todo-Parte Débil
> **Símbolo:** Rombo Hueco `o--`
>
> Una clase (el Todo) contiene a otras (las Partes), pero **las partes pueden vivir por su cuenta**.
>
> Si el "Todo" desaparece, las partes quedan sueltas o se reasignan, pero **NO se borran**.

:::end

---

### 📖 Composición y Herencia

:::columns

> [!card] 🔒 Composición — Todo-Parte Fuerte
> **Símbolo:** Rombo Relleno `*--`
>
> Hay una **dependencia de vida total**. La "Parte" no tiene sentido si no es dentro de ese "Todo".
>
> Si eliminás el "Todo", las partes se **destruyen obligatoriamente** con él.

:::split

> [!card] 🧬 Herencia — Generalización
> **Símbolo:** Triángulo `<|--`
>
> Una clase base general con atributos comunes, y subclases que **heredan todo del padre** pero suman sus propias reglas.
>
> Sirve para **abstraer y no repetir** atributos.

:::end

---

## Sistema de Ventas y Facturación
IES N° 6023 — Gestión de facturación por servicios educativos

---

### 📝 Enunciado del Problema

> [!problem]
> El sistema de ventas del IES N° 6023 gestiona la emisión de **facturas** por servicios educativos (aranceles, matrículas, actividades). Una Factura es el "todo" y está compuesta por uno o más **Pedidos**: si se elimina una factura, sus pedidos asociados pierden toda vigencia y deben eliminarse con ella.
>
> Cada Pedido se compone de una o más **LineasDePedido**: cada línea registra el producto o servicio, la cantidad y el precio unitario. Una LineaPedido no tiene sentido ni existencia fuera del Pedido al que pertenece.
>
> Cada LineaPedido referencia un **Producto** del catálogo institucional. El Producto sí puede existir de forma independiente.

---

### 🔍 Relación 1: Factura → Pedido

> [!important] Composición
> La consigna indica que la Factura es el *"todo"*. Si se elimina una factura, sus pedidos *"pierden toda vigencia y deben eliminarse"*.
>
> Es una **dependencia de vida estricta**: el pedido no existe sin la factura que lo contiene.
>
> **Multiplicidad:** `1 ♦—— 1..*` — Una factura está compuesta por uno o más pedidos.

---

### 🔍 Relación 2: Pedido → LineaPedido

> [!important] Composición
> El texto dice explícitamente: *"Una LineaPedido no tiene sentido ni existencia fuera del Pedido al que pertenece"*.
>
> Nuevamente, **dependencia estricta**. Si se cancela y borra el pedido, sus líneas se destruyen con él.
>
> **Multiplicidad:** `1 ♦—— 1..*` — Un pedido se compone de una o más líneas.

---

### 🔍 Relación 3: LineaPedido → Producto

> [!note] Asociación Simple
> La consigna aclara que el Producto *"sí puede existir de forma independiente (catálogo)"*.
>
> La línea solo lo referencia para saber qué cobrar. Si el pedido y su línea se eliminan, el **producto sigue intacto** en el sistema.
>
> **Multiplicidad:** `* —— 1` — Muchas líneas pueden apuntar a un mismo producto.

---

## Sistema de Reservas de un Hotel
Gestión de habitaciones, reservas, huéspedes y servicios adicionales

---

### 📝 Enunciado del Problema

> [!problem]
> Un hotel gestiona sus **habitaciones** (simples, dobles, suites, familiares), las **reservas** realizadas por los huéspedes y los **servicios adicionales** contratados durante la estadía.
>
> Los servicios adicionales son parte integral de la reserva y **se eliminan si la reserva es cancelada**. Los **huéspedes** se dividen en frecuentes y ocasionales. Las **áreas** del hotel agrupan empleados, pero si un área es eliminada, los empleados **son reasignados, no dados de baja**.
>
> La **factura** contiene cargos por habitación y servicios adicionales. Los cargos son **parte constitutiva** de la factura.

---

### 🧬 Herencia en Habitaciones y Huéspedes

> [!tip] Generalización
> **Habitaciones:** `Habitacion` es la *"clase base"* y las demás son *"subclases"* que especializan el cálculo de tarifas y servicios incluidos.
>
> **Huéspedes:** Ambos tipos comparten atributos (nombre, DNI, etc.) pero tienen **distintos comportamientos** en el cálculo de beneficios.
>
> La herencia se justifica porque hay atributos comunes que se heredan, y comportamientos específicos que se especializan en cada subclase.

---

### 🔒 Reserva → ServicioAdicional

> [!important] Composición
> Dependencia de vida estricta. El texto lo da servido: *"se eliminan si la reserva es cancelada"*.
>
> Un servicio de spa o transfer **no tiene sentido** en el sistema si no está atado a la reserva que lo solicitó.
>
> **Multiplicidad:** `1 ♦—— *` — Una reserva puede tener cero o varios servicios adicionales.

---

### 📦 Área → Empleado — ¡Punto Clave!

> [!warning] Agregación (no Composición)
> Esta es la **diferencia fundamental**. El texto aclara: *"Si un área es eliminada, los empleados son reasignados pero no dados de baja"*.
>
> Es una relación "todo-parte" **débil**: el empleado existe en el sistema de forma independiente a si el área de "gastronomía" cierra temporalmente.
>
> **Multiplicidad:** `1 ♢—— *` — Un área agrupa a muchos empleados, pero ellos sobreviven sin ella.

---

### 🔒 Factura → Cargo

> [!important] Composición
> El texto dice que los cargos son *"parte constitutiva"* de la factura.
>
> Un cargo específico (ej: "$50 por lavandería") **no existe suelto** en el sistema sin la factura que lo totaliza y documenta.
>
> **Multiplicidad:** `1 ♦—— 1..*` — Una factura tiene que tener al menos un cargo para existir.

---

## Conclusión
Resumen visual de los conceptos clave aprendidos

---

### 📌 Resumen: ¿Cómo distinguir cada relación?

> [!note]
> **Asociación** → ¿Si elimino A, B sigue existiendo sin problemas? **Sí → Asociación.**
>
> **Agregación** → ¿A "agrupa" a B, pero B sobrevive solo? **Sí → Agregación.**
>
> **Composición** → ¿Si elimino A, B se destruye obligatoriamente? **Sí → Composición.**
>
> **Herencia** → ¿B "es un tipo de" A con comportamiento propio? **Sí → Herencia.**

---

# ¡Gracias!
Programación Orientada a Objetos — Relaciones UML
