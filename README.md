# CV Match

Frontend de CV Match: adapta tu currículum a cada oferta de empleo con IA. Hecho con React, Vite, Tailwind CSS, Lucide y pdf.js. Se instala en el móvil como una app (PWA).

> La optimización con IA está simulada (2 segundos y datos de ejemplo). El punto de conexión con tu backend es la función `handleOptimize` en `src/App.jsx`.

## Probar en local

Necesitas Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal. Con `--host` también sale una dirección de red (`http://192.168.x.x:5173`) para abrirla desde el móvil en la misma wifi.

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

Si prefieres no usar la terminal, en el repositorio vacío pulsa **uploading an existing file** y arrastra el contenido de la carpeta (sin `node_modules` ni `dist`).

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

```
src/
  App.jsx                 Pantalla principal, pestañas y barra móvil
  data/cvData.js          CV de ejemplo y resultado simulado
  components/
    InputCard.jsx         Tarjeta con área de texto expansible
    PdfAttach.jsx         Botón «PDF» y ficha del archivo importado
    CvSheet.jsx           CV maquetado (Folio / Lectura)
    Segmented.jsx         Control segmentado estilo iOS
    Toast.jsx             Avisos
  hooks/usePdfImport.js   Selector, arrastrar y soltar, errores
  lib/extractPdfText.js   Lectura del PDF en el navegador
public/
  manifest.webmanifest    Datos de la app instalable
  sw.js                   Funcionamiento sin conexión
  icons/                  Iconos de la app
```
