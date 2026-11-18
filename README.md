# Rose Meraki

Sitio para documentar proyectos de código abierto y ofrecer consultoría para migrar proyectos a inteligencia artificial.

Publicado en [https://rose-meraki.vercel.app](https://rose-meraki.vercel.app).

## Contenido visible (pendiente de actualizar)

La página que hay hoy en `src/` no describe ese propósito. El texto y la navegación hablan de un estudio de retrato:

- La cabecera enlaza «Estudio», «Sobre mí», «Proyectos» y «Contacto».
- `Studio.astro` habla de sesiones, de un estudio propio y de que el retrato se parezca a quien lo protagoniza.
- `Rose.astro` habla de retratos y de fotografiar gestos.
- `Projects.astro` lista Prisma (sesión editorial, 2026) y Meraki (retrato en estudio, 2025), y cierra con «Hablemos de tu sesión».
- `Contact.astro` invita a hablar de la próxima sesión y el pie dice «Estudio y exterior».

Ese contenido está pendiente de actualizar. La estructura sigue siendo una sola página en español: cabecera, hero y esas cuatro secciones.

## Stack

Declarado en `package.json` e instalado con el `package-lock.json` de este repositorio (npm). No hay lockfile de pnpm, Yarn ni Bun.

- [Astro](https://astro.build) `^7.4.7`. El lockfile resuelve Astro 7.4.7.
- Integración [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) `^7.1.4`, con `react` y `react-dom` `^19.3.1` y los tipos correspondientes. La integración está registrada en `astro.config.mjs`. La interfaz actual está en componentes `.astro`; el repositorio no contiene archivos `.tsx` ni `.jsx`.
- TypeScript estricto: `tsconfig.json` extiende `astro/tsconfigs/strict` y define `jsx` como `react-jsx`.
- Node.js `>=22.23.4` (`engines` en `package.json`).

`astro.config.mjs` no define `site`, `output` ni un adaptador.

### Fuentes

Las familias se declaran en `astro.config.mjs` (`fonts`, con `fontProviders` de `astro/config`) y se emiten en `src/layouts/Layout.astro` con el componente `Font` de `astro:assets`.

| Familia | Cómo se carga | Variable CSS |
| --- | --- | --- |
| Instrument Serif | Proveedor de Google, `fontProviders.google()`. Fallback `serif`. En el layout: `<Font cssVariable="--font-instrument-serif" preload />`. | `--font-instrument-serif` |
| Darker Grotesque | Proveedor local, `fontProviders.local()`. Archivo `src/assets/fonts/DarkerGrotesque-VariableFont_wght.ttf`, peso `100 900`, estilo `normal`. Fallback `sans-serif`. En el layout: `<Font cssVariable="--font-body" />` (sin `preload`). | `--font-body` |

`src/styles/tokens.css` las reexpone como `--font-display` (Instrument Serif, para títulos) y `--font-text` (Darker Grotesque, para el texto).

En `src/assets/fonts/` también están `InstrumentSerif-Regular.ttf` e `InstrumentSerif-Italic.ttf`. Esos archivos no están referenciados en `astro.config.mjs`. El build deja Instrument Serif en dos `.woff2` (peso 400, estilos normal e italic) y copia Darker Grotesque como el `.ttf` local.

## Instalación y scripts

Desde la raíz del repositorio:

```sh
npm install
npm run dev
```

`npm run dev` ejecuta `astro dev`. El puerto por defecto del CLI es 4321.

| Comando | Script en `package.json` | Qué hace |
| --- | --- | --- |
| `npm install` | — | Instala las dependencias según `package-lock.json`. |
| `npm run dev` | `dev`: `astro dev` | Arranca el servidor de desarrollo. |
| `npm run build` | `build`: `astro build` | Genera el sitio estático en `dist/`. |
| `npm run preview` | `preview`: `astro preview` | Sirve en local el contenido de `dist/`. Puerto por defecto del CLI: 4321. |
| `npm run astro` | `astro`: `astro` | Ejecuta la CLI de Astro. Ejemplo: `npm run astro -- --help`. |

`package.json` no define scripts de test ni de lint. `dist/` figura en `.gitignore` como salida de build. `astro.config.mjs` no cambia `outDir`.

## Estructura de `src/`

```text
src/
├── pages/
│   └── index.astro
├── layouts/
│   └── Layout.astro
├── styles/
│   └── tokens.css
├── components/
│   ├── Header.astro
│   ├── Studio.astro
│   ├── Rose.astro
│   ├── Projects.astro
│   ├── Contact.astro
│   ├── DrawPortrait.astro
│   └── Welcome.astro
├── lib/
│   └── draw-art.ts
└── assets/
    ├── fonts/
    ├── artwork/          hero, studio y rose
    ├── logo.svg
    ├── astro.svg
    └── background.svg
```

`public/` contiene `favicon.svg` y `favicon.ico`, enlazados desde el layout.

### Páginas y layout

- `src/pages/index.astro` es la única ruta. Monta el layout, la cabecera, el hero (`#top`) y, en este orden, Estudio, Sobre mí, Proyectos y Contacto. El hero usa `DrawPortrait` con `src/assets/artwork/hero/hero-line.svg` (importado como `?raw`) y `hero-color.webp`. Un script de la página añade `is-visible` a `[data-section-reveal]` e `is-drawn` a `[data-draw]` al entrar en el viewport. Si el sistema pide movimiento reducido, aplica esas clases de inmediato.
- `src/layouts/Layout.astro` es el documento HTML (`lang="es"`), con el título «Rose Meraki», los favicons, `tokens.css` y las dos fuentes. Un script en línea añade la clase `has-js` a `<html>`. El `body` usa `--color-primary` y `--font-text`.

### Estilos

`src/styles/tokens.css` concentra la paleta, la tipografía y las medidas de la página:

- Color: `--color-primary`, `--color-primary-light`, `--color-primary-muted`, `--color-secondary`, `--color-secondary-dark`, `--color-accent`, `--color-cream`, `--color-ink`, `--color-white`.
- Tipo: `--font-display` y `--font-text`.
- Layout: `--section-gutter`, `--section-block`, `--content-width` y `--header-height`.

También define el revelado al hacer scroll (`[data-section-reveal]` / `.is-visible`, solo con `html.has-js`), el anillo `:focus-visible` y el brillo decorativo `.has-glow` (cada sección ajusta `--glow-color`, `--glow-size` y la posición). El revelado se anula con `prefers-reduced-motion: reduce`.

### Componentes

Estas fichas describen el código actual, incluido el texto de estudio de retrato pendiente de cambiar.

- `Header.astro`. Cabecera fija con el logo (`src/assets/logo.svg`, enlace a `#top`) y la navegación a `#estudio`, `#sobre-mi`, `#proyectos` y `#contacto`. Por debajo de 769px el menú pasa a un panel con botón. Al hacer scroll recibe `is-scrolled`; en escritorio se oculta al bajar (`is-hidden`) y no se oculta con el menú abierto ni en móvil.
- `Studio.astro`. Sección `#estudio`. Texto del estudio y tres cifras definidas en el archivo (sesiones realizadas, años de archivo, estudio propio). El retrato usa el arte de `src/assets/artwork/studio/`.
- `Rose.astro`. Sección `#sobre-mi`. Texto sobre la mirada de Rose y retrato con el arte de `src/assets/artwork/rose/`. En este fondo claro el trazo usa `--color-primary`.
- `Projects.astro`. Sección `#proyectos`. Dos fichas definidas en el archivo: Prisma (sesión editorial, 2026) y Meraki (retrato en estudio, 2025). El fondo de cada ficha es un degradado con los tokens de color; no hay imágenes de obra.
- `Contact.astro`. Sección `#contacto`. Enlaces a `mailto:hola@rosemeraki.com` y a `https://instagram.com/rosemeraki` (texto «@rosemeraki»). El pie escribe el año con `new Date().getFullYear()` en el frontmatter (queda fijado en el build) y el texto «Estudio y exterior».
- `DrawPortrait.astro`. Retrato en dos capas: el SVG de línea y la imagen a color. Recibe el SVG en crudo, la URL y las medidas del color, y la descripción accesible. Sin JavaScript muestra solo el color. Con `html.has-js` dibuja los trazos y después funde el color cuando el elemento tiene `is-drawn`. Respeta `prefers-reduced-motion`. Los tiempos y el encuadre (`fit`, `focus`) llegan por props.
- `Welcome.astro`. Componente de la plantilla Astro Basics. `index.astro` no lo importa. Usa `src/assets/astro.svg` y `src/assets/background.svg`.

### `lib/draw-art.ts`

`prepareLineArt` prepara el SVG de línea en el build, antes de enviarlo al cliente. Quita el relleno, deja el trazo y asigna `pathLength="1"` a cada `path`, más una variable `--t` (0–1) según la altura del primer punto, para escalonar el dibujo de arriba abajo. El encaje (`contain` o `cover`, y el foco) se escribe en `preserveAspectRatio`.

## Despliegue

El sitio publicado está en [https://rose-meraki.vercel.app](https://rose-meraki.vercel.app).

El repositorio no incluye `vercel.json` ni otra configuración de Vercel. El comando de build es `npm run build` (`astro build`), que deja el sitio estático en `dist/`.
