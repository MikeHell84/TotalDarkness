# Instrucciones para la fuente AlphaCentauri

Para completar la instalación de la fuente AlphaCentauri:

1. **Descarga la fuente** desde uno de estos recursos:
   - [DaFont](https://www.dafont.com/alpha-centauri.font)
   - [Font Squirrel](https://www.fontsquirrel.com/)
   - O busca "AlphaCentauri font" en Google

2. **Coloca los archivos** en esta carpeta (`public/fonts/`):
   - `AlphaCentauri.woff2` (recomendado - mejor compresión)
   - `AlphaCentauri.woff` (alternativa)
   - `AlphaCentauri.ttf` (alternativa)

3. **Uso en el código:**

   ```jsx
   // Usando Tailwind CSS
   <h1 className="font-alpha">Texto con AlphaCentauri</h1>
   
   // Usando CSS inline
   <h1 style={{ fontFamily: 'AlphaCentauri, Inter, sans-serif' }}>
     Texto con AlphaCentauri
   </h1>
   ```

4. **Configuración actual:**
   - ✅ `@font-face` configurado en `src/index.css`
   - ✅ Familia de fuente `font-alpha` agregada a Tailwind
   - ⚠️ Archivos de fuente pendientes de agregar

## Conversión de fuentes

Si tienes archivos `.otf` o `.ttf`, puedes convertirlos a `.woff2` usando:

- [CloudConvert](https://cloudconvert.com/ttf-to-woff2)
- [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
