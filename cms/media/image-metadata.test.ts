import assert from "node:assert/strict";
import test from "node:test";
import {
  optimizedCmsImageMetadata,
  webpDimensions,
} from "@/cms/media/image-metadata";

function vp8xWebp(width: number, height: number) {
  const bytes = new Uint8Array(30);
  bytes.set(Buffer.from("RIFF"), 0);
  new DataView(bytes.buffer).setUint32(4, 22, true);
  bytes.set(Buffer.from("WEBPVP8X"), 8);
  new DataView(bytes.buffer).setUint32(16, 10, true);

  const widthMinusOne = width - 1;
  const heightMinusOne = height - 1;
  bytes[24] = widthMinusOne & 0xff;
  bytes[25] = (widthMinusOne >>> 8) & 0xff;
  bytes[26] = (widthMinusOne >>> 16) & 0xff;
  bytes[27] = heightMinusOne & 0xff;
  bytes[28] = (heightMinusOne >>> 8) & 0xff;
  bytes[29] = (heightMinusOne >>> 16) & 0xff;
  return bytes;
}

test("reads normalized WebP dimensions", () => {
  assert.deepEqual(webpDimensions(vp8xWebp(1600, 2000)), {
    width: 1600,
    height: 2000,
  });
});

test("accepts a normalized WebP inside the CMS limits", async () => {
  const file = new File([vp8xWebp(2000, 1200)], "project.webp", {
    type: "image/webp",
  });

  assert.deepEqual(await optimizedCmsImageMetadata(file), {
    extension: "webp",
    width: 2000,
    height: 1200,
  });
});

test("rejects source formats that skipped browser optimization", async () => {
  const file = new File([vp8xWebp(1200, 800)], "project.jpg", {
    type: "image/jpeg",
  });

  await assert.rejects(optimizedCmsImageMetadata(file), /optimized before upload/);
});

test("rejects WebP images larger than the normalized edge", async () => {
  const file = new File([vp8xWebp(2001, 1200)], "project.webp", {
    type: "image/webp",
  });

  await assert.rejects(optimizedCmsImageMetadata(file), /dimensions are not supported/);
});

test("enforces a smaller field-specific edge", async () => {
  const file = new File([vp8xWebp(513, 512)], "favicon.webp", {
    type: "image/webp",
  });

  await assert.rejects(optimizedCmsImageMetadata(file, 512), /dimensions are not supported/);
});
