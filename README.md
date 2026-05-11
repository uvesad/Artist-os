# Artist OS

Artist OS es una app SaaS local para artistas independientes, managers y equipos creativos musicales. Permite organizar releases, gastos musicales y contenido para redes sociales desde una interfaz oscura, moderna y responsive.

## Qué incluye

- **Dashboard general** con próximos releases, gasto musical del mes, límite mensual, contenidos pendientes y tareas urgentes.
- **Releases musicales** con título, artista, tipo de lanzamiento, fecha, género, mood, estado, presupuesto, portada por URL, links, notas, checklist, ideas de TikTok/Reels, pitch editorial y plan de marketing.
- **Finanzas musicales** con registro de gastos, proveedor, estado, release asociado, gasto por categoría, gasto por release y aviso visual al acercarse o superar el límite mensual.
- **Contenido para redes sociales** con piezas para TikTok, Instagram, YouTube Shorts y X, estado de producción, fecha prevista, caption, hashtags, link final y notas.
- **Plantillas automáticas** de plan de marketing para single, EP y álbum.
- **Generador local de ideas** de contenido basado en género, mood y objetivo, sin usar APIs externas.

## Persistencia de datos

La app no usa login, base de datos externa ni APIs reales. Toda la información se guarda en `localStorage`, dentro del navegador del usuario. Si cambias de navegador o limpias los datos del sitio, la información local puede desaparecer.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

No hay dependencias externas de npm: la app usa JavaScript, HTML y CSS locales para que sea fácil de leer y mantener.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre la URL que muestra la terminal, normalmente `http://localhost:5173`.

## Build de producción

```bash
npm run build
```

El script copia los archivos estáticos necesarios a la carpeta `dist`.

## Preview del build

```bash
npm run preview
```

## Deploy en Vercel

El proyecto está preparado para Vercel con `vercel.json`:

- Build command: `npm run build`.
- Output directory: `dist`.
- Rewrite a `index.html` para soportar la app como SPA.

Pasos recomendados:

1. Sube el repositorio a GitHub.
2. Importa el proyecto desde Vercel.
3. Vercel usará la configuración incluida y publicará la carpeta `dist`.
4. Ejecuta el deploy.

## Estructura principal

```text
src/main.js       # Lógica de la app, formularios, localStorage, dashboard y generadores internos
src/styles.css    # Dirección visual premium, dark mode, responsive, glassmorphism y microanimaciones
scripts/build.js  # Build estático a dist/
scripts/dev.js    # Servidor local de desarrollo
scripts/preview.js # Preview local del build
vercel.json       # Configuración de despliegue para Vercel
```

## Nota para futuras mejoras

El código se mantiene en una app JavaScript sencilla para que sea fácil de leer y modificar. Cuando el producto crezca, se pueden separar componentes por carpetas y añadir autenticación, base de datos o integraciones reales con plataformas sociales.
