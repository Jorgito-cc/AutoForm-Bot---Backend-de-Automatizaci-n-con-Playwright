# 🤖 AutoForm Bot - Backend de Automatización con Playwright

Backend desarrollado en **Node.js**, **Express** y **Playwright**, diseñado para automatizar el llenado de formularios de **Google Forms** de manera masiva, dinámica y configurable.  
Forma parte del proyecto completo **AutoForm Bot**, que incluye también un **frontend React** para controlar la ejecución de los bots desde una interfaz web.

---

## 🧩 Descripción general

Este backend actúa como un **microservicio de automatización (RPA)** que recibe desde el frontend los siguientes datos:

- 🔗 **URL del formulario de Google Forms**
- 🔢 **Cantidad de envíos automáticos**

Con estos datos, ejecuta internamente un script con **Playwright (Chromium)** que:
1. Abre el formulario.
2. Rellena las respuestas con valores aleatorios preconfigurados.
3. Envía el formulario.
4. Repite el proceso la cantidad de veces indicada.
5. Envía los **logs en tiempo real** al frontend para visualizar el progreso.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| **Node.js** | Entorno de ejecución del backend |
| **Express.js** | Framework para la API REST |
| **Playwright** | Motor de automatización de navegador |
| **CORS** | Permitir comunicación con el frontend (React/Netlify) |
| **child_process (spawn)** | Para ejecutar el script `fill_form_playwright.js` y transmitir logs |

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Jorgito-cc/AutoForm-Bot---Backend-de-Automatizaci-n-con-Playwright.git
cd AutoForm-Bot---Backend-de-Automatizaci-n-con-Playwright
