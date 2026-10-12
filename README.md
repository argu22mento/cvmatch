# CV Match

Frontend de CV Match: adapta tu currículum a cada oferta de empleo con IA. Hecho con React, Vite, Tailwind CSS, Lucide y pdf.js. Se instala en el móvil como una app (PWA).

> La optimización la hace Gemini (Google) desde la función `api/optimize.js`, con la clave gratuita de Google AI Studio. Parte siempre de los datos de tu CV: no inventa empresas, cargos, fechas ni estudios, y lo que la oferta pide y tu CV no menciona aparece aparte, sin añadirse al currículum.

## Clave de Gemini (obligatoria, gratuita)

1. Crea o copia tu clave en aistudio.google.com › **Get API key**.
2. En Vercel: tu proyecto › **Settings › Environment Variables** › añade `GEMINI_API_KEY` con la clave, marcando Production, Preview y Development.
3. Vuelve a desplegar (**Deployments › ⋯ › Redeploy**) para que la función la lea.

Opcional: `GEMINI_MODEL` para cambiar de modelo (por defecto `gemini-3.8-flash`, con nivel gratuito).

## Probar en local

Necesitas Node.js 18 o superior.

```bash
npm install
npx vercel dev
```

`vercel dev` arranca la web y también la función de IA (con `npm run dev` solo verías la interfaz). Crea un archivo `.env.local` con `GEMINI_API_KEY=tu_clave` para probar en local.

## 1. Subir a GitHub

1. En github.com, pulsa **New repository**, llámalo `cv-match` y créalo vacío (sin README).
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "CV Match: primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cv-match.git
git push -u origin main
```

Si prefieres no usar la terminal, en el repositorio vacío pulsa **uploading an existing file** y arrastra todos los archivos de la carpeta.

## 2. Importar en Vercel

1. Entra en vercel.com con tu cuenta de GitHub.
2. **Add New… › Project** y elige el repositorio `cv-match`.
3. Vercel detecta Vite solo. Deja la configuración tal cual:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Pulsa **Deploy**. En un minuto tendrás una dirección del tipo `https://cv-match.vercel.app`.

Cada `git push` a `main` vuelve a publicar la web automáticamente.

## 3. Tenerla en el móvil

**iPhone (Safari):** abre la dirección de Vercel, pulsa **Compartir** y luego **Añadir a pantalla de inicio**.

**Android (Chrome):** abre la dirección, menú **⋮** y **Instalar aplicación** (o **Añadir a pantalla de inicio**).

Se abre a pantalla completa, con su icono, y funciona sin conexión una vez visitada.

## Cómo está pensada para el móvil

- **Dos pestañas** (Datos / Vista previa) en lugar de dos columnas; tras optimizar, salta sola a la vista previa.
- **Barra de acciones fija abajo**, al alcance del pulgar, que se esconde mientras escribes para dejar sitio al teclado.
- **Modo Lectura** del CV con texto a tamaño cómodo; el modo Folio mantiene la proporción A4.
- Campos de texto a 16 px (iOS no hace zoom al escribir) y botones de 40–48 px de alto.
- Respeta la muesca y la barra de inicio del iPhone (`safe-area`).

## Descargar PDF

El botón abre el diálogo del sistema con solo el folio A4:

- **Ordenador:** destino **Guardar como PDF**.
- **iPhone:** en el diálogo de impresión, **Compartir › Guardar en Archivos**.
- **Android:** impresora **Guardar como PDF**.

## Estructura

Todos los archivos van en la raíz del repositorio, salvo la función de IA, que Vercel exige dentro de la carpeta `api/`. Así se pueden subir a GitHub arrastrándolos desde el navegador sin que se pierda nada.

```
index.html              Página de entrada
main.jsx                Arranque de React y del service worker
App.jsx                 Pantalla principal, pestañas y barra móvil
api/optimize.js         Función de Vercel que llama a Gemini
cvData.js               Textos de ejemplo y CV de muestra
InputCard.jsx           Tarjeta con área de texto expansible
PdfAttach.jsx           Botón «PDF» y ficha del archivo importado
CvSheet.jsx             CV maquetado (Folio / Lectura)
Segmented.jsx           Control segmentado estilo iOS
Toast.jsx               Avisos
usePdfImport.js         Selector, arrastrar y soltar, errores
extractPdfText.js       Lectura del PDF en el navegador
index.css               Estilos (Tailwind + folio A4 + impresión)
manifest.webmanifest    Datos de la app instalable
sw.js                   Funcionamiento sin conexión
*.png, favicon.svg      Iconos de la app
vite.config.js          Compilación; copia manifest, sw.js e iconos a la web publicada
```
