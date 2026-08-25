# CMS media fields

Status: ARCHIVADO

## Resultado

- Las ayudas breves de campos se mantienen sin estirar controles vecinos.
- `CmsImageField` centraliza preview real, recomendación, selector, URL oculta y alt opcional.
- Hero permite reemplazar su imagen mediante Vercel Blob y publica el alt guardado.
- Open Graph permite editar alt y lo entrega en metadata.
- Cada fotografía de Look Book expone su alt dentro del proyecto correspondiente.
- Favicon conserva preview y reemplazo sin un campo alt artificial.

## Verificación

- Controles de 48 px y sin overflow a 1440, 834 y 390 px.
- Preview visible en los tres breakpoints.
- Query consolidado de proyecto y alt validado con `EXPLAIN` en Neon, sin modificar datos.
