# Rose Meraki

Sitio de una sola página del estudio de retrato Rose Meraki. La guía para personas está en `README.md`. Este archivo es para agentes que editan el código.

Documentación de Astro: https://docs.astro.build

Guías que encajan con este repositorio:

- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Estilos](https://docs.astro.build/en/guides/styling/)
- [Componentes de framework](https://docs.astro.build/en/guides/framework-components/) (`@astrojs/react` ya está registrado)

## Stack

- Astro `^7.4.7` y Node.js `>=22.23.4`, según `package.json`. Gestor: npm (`package-lock.json`).
- `astro.config.mjs` registra `@astrojs/react` y las fuentes. No define `site`, `output`, adaptador ni `outDir`.
- La UI visible son componentes `.astro`. React y `react-dom` están en las dependencias y `tsconfig.json` usa `jsx: react-jsx`, pero no hay archivos `.tsx` ni `.jsx`.
- TypeScript estricto (`astro/tsconfigs/strict`).
- El texto visible de la página está en español. `<html lang="es">` está en `src/layouts/Layout.astro`.

## Comandos

Desde la raíz, con npm:

| Comando | Script |
| --- | --- |
| `npm install` | Instala según `package-lock.json`. |
| `npm run dev` | `astro dev`. Puerto por defecto: 4321. |
| `npm run build` | `astro build`. Salida estática en `dist/`. |
| `npm run preview` | `astro preview`. Sirve `dist/`. Puerto por defecto: 4321. |
| `npm run astro` | CLI de Astro (`npm run astro -- --help`). |

`package.json` no tiene scripts de test ni de lint.

Al arrancar el servidor de desarrollo en segundo plano, usar el modo background de la CLI:

```sh
astro dev --background
```

Gestionarlo con `astro dev stop`, `astro dev status` y `astro dev logs`.

## Estructura

La única ruta es `src/pages/index.astro`. Orden: `Header`, hero `#top`, `Studio` (`#estudio`), `Rose` (`#sobre-mi`), `Projects` (`#proyectos`), `Contact` (`#contacto`).

| Ruta | Rol |
| --- | --- |
| `src/layouts/Layout.astro` | Documento, favicons de `public/`, `tokens.css`, fuentes y la clase `has-js`. |
| `src/styles/tokens.css` | Tokens de color, tipo y layout; revelado al scroll; `.has-glow`. |
| `src/components/Header.astro` | Cabecera fija y anclas de la página. |
| `src/components/Studio.astro` | Sección Estudio. Cifras escritas en el componente. |
| `src/components/Rose.astro` | Sección Sobre mí. |
| `src/components/Projects.astro` | Sección Proyectos. Las dos fichas (Prisma, Meraki) están escritas en el componente. |
| `src/components/Contact.astro` | Sección Contacto. El correo y el enlace de Instagram están escritos en el componente. |
| `src/components/DrawPortrait.astro` | Line-art que se dibuja y luego deja paso a la imagen a color. |
| `src/lib/draw-art.ts` | `prepareLineArt`: prepara el SVG de línea en el build. |
| `src/assets/artwork/` | Parejas line-art SVG + color (hero, studio, rose). |
| `src/components/Welcome.astro` | Resto de la plantilla Astro Basics. La página no lo monta. Tampoco uses `src/assets/astro.svg` ni `src/assets/background.svg` para el sitio. |

Los SVG de línea se importan con `?raw`. El color se importa como asset de Astro y se pasa a `DrawPortrait` (`colorSrc`, `colorWidth`, `colorHeight`).

## Convenciones observadas

- Paleta, fuentes y medidas de sección viven en `src/styles/tokens.css`. Los componentes usan `--color-*`, `--font-display`, `--font-text`, `--section-gutter`, `--section-block`, `--content-width` y `--header-height`. Algunas reglas repiten un color del token como `rgb()` suelto.
- Cada bloque de contenido lleva la clase `has-glow` y ajusta sus variables `--glow-*`. El revelado usa `data-section-reveal`; `index.astro` añade `is-visible`.
- `Layout.astro` marca `html.has-js`. `DrawPortrait` depende de esa clase: sin JavaScript se ve la imagen a color y se oculta la capa de líneas. No quites `has-js` ni muestres el line-art como estado final.
- Las animaciones de retrato, el revelado de sección y la cabecera respetan `prefers-reduced-motion: reduce`. Conserva ese comportamiento al añadir movimiento.
- Los `id` de sección y los `href` de `Header.astro` van juntos: `#top`, `#estudio`, `#sobre-mi`, `#proyectos`, `#contacto`.
- Por debajo de 769px el título del hero se oculta y la cabecera muestra el wordmark «Rose Meraki». El corte de 900px se usa en el layout de Estudio, Sobre mí, Proyectos y en el `focus` de escritorio de `DrawPortrait`.
- Los estilos van en el `<style>` del propio componente Astro.
- Instrument Serif entra por el proveedor de Google (`--font-instrument-serif`, con `preload`). Darker Grotesque entra del archivo local `src/assets/fonts/DarkerGrotesque-VariableFont_wght.ttf` (`--font-body`, peso `100 900`, sin `preload`). El build emite Instrument Serif como dos `.woff2` de peso 400 (normal e italic) y conserva Darker Grotesque en `.ttf`. `InstrumentSerif-Regular.ttf` e `InstrumentSerif-Italic.ttf` están en `src/assets/fonts/` y no forman parte de esa configuración.
- No hay colecciones de contenido ni variables de entorno leídas en `src/`. Los datos de Estudio, Proyectos y Contacto están en el frontmatter de cada componente.
- El repositorio no incluye `vercel.json`. El sitio publicado es https://rose-meraki.vercel.app y el build es `npm run build`.
