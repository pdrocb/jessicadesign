/**
 * Recorta y recomprime todo lo que viva en `assets/`.
 *
 * Existe porque la fotografía llega por WhatsApp o del Wix viejo, sin
 * control de tamaño: una foto de 6000px cuesta build, cuesta
 * transformaciones en Vercel y no se ve mejor — el contenedor más ancho
 * del sitio es el rail de 1536px.
 *
 * Idempotente: si un archivo ya cumple el tope y no adelgaza al
 * recomprimir, se deja como está. Correr con `npm run assets`.
 */
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "assets";
const MAX_EDGE = 2000; // lado largo; el rail más ancho es 1536
const JPEG = { quality: 82, mozjpeg: true };

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let touched = 0;

for (const name of files) {
  const file = path.join(DIR, name);
  const before = (await stat(file)).size;
  const img = sharp(file);
  const { width, height, format } = await img.metadata();

  const tmp = path.join(DIR, `.tmp-${name}`);
  await img
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .toFormat(format === "png" ? "png" : "jpeg", format === "png" ? { compressionLevel: 9 } : JPEG)
    .toFile(tmp);

  const after = (await stat(tmp)).size;
  const shrank = after < before * 0.98; // menos de un 2% no vale reescribir
  const oversize = Math.max(width, height) > MAX_EDGE;

  if (shrank || oversize) {
    await rename(tmp, file);
    const m = await sharp(file).metadata();
    console.log(
      `  ${name.padEnd(28)} ${width}x${height} → ${m.width}x${m.height}  ` +
        `${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`,
    );
    touched++;
  } else {
    await unlink(tmp);
  }
}

console.log(touched ? `\n${touched} archivo(s) optimizado(s).` : "Todo ya estaba optimizado.");
