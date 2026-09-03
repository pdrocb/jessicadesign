import {
  maximumCmsImageBytes,
  maximumCmsImageEdge,
} from "@/cms/media/image-policy";

export type CmsImageMetadata = {
  extension: "webp";
  width: number;
  height: number;
};

function readUint16LittleEndian(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32LittleEndian(bytes: Uint8Array, offset: number) {
  return (
    bytes[offset]
    | (bytes[offset + 1] << 8)
    | (bytes[offset + 2] << 16)
    | (bytes[offset + 3] << 24)
  ) >>> 0;
}

export function webpDimensions(bytes: Uint8Array) {
  if (
    bytes.length < 12
    || String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF"
    || String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  ) {
    throw new Error("The WebP file could not be read.");
  }

  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const chunk = String.fromCharCode(...bytes.slice(offset, offset + 4));
    const size = readUint32LittleEndian(bytes, offset + 4);
    const dataOffset = offset + 8;
    if (dataOffset + size > bytes.length) break;

    if (chunk === "VP8X" && size >= 10) {
      return {
        width: 1 + bytes[dataOffset + 4] + (bytes[dataOffset + 5] << 8) + (bytes[dataOffset + 6] << 16),
        height: 1 + bytes[dataOffset + 7] + (bytes[dataOffset + 8] << 8) + (bytes[dataOffset + 9] << 16),
      };
    }

    if (
      chunk === "VP8 "
      && size >= 10
      && bytes[dataOffset + 3] === 0x9d
      && bytes[dataOffset + 4] === 0x01
      && bytes[dataOffset + 5] === 0x2a
    ) {
      return {
        width: readUint16LittleEndian(bytes, dataOffset + 6) & 0x3fff,
        height: readUint16LittleEndian(bytes, dataOffset + 8) & 0x3fff,
      };
    }

    if (chunk === "VP8L" && size >= 5 && bytes[dataOffset] === 0x2f) {
      const packedDimensions = readUint32LittleEndian(bytes, dataOffset + 1);
      return {
        width: 1 + (packedDimensions & 0x3fff),
        height: 1 + ((packedDimensions >>> 14) & 0x3fff),
      };
    }

    offset = dataOffset + size + (size % 2);
  }

  throw new Error("The WebP dimensions could not be read.");
}

export async function optimizedCmsImageMetadata(
  file: File,
  maximumEdge = maximumCmsImageEdge,
): Promise<CmsImageMetadata> {
  if (file.type !== "image/webp") {
    throw new Error("Choose the image through the CMS so it can be optimized before upload.");
  }
  if (file.size === 0) throw new Error("Choose an image before uploading.");
  if (file.size > maximumCmsImageBytes) throw new Error("The optimized image must be 10 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = webpDimensions(bytes);

  if (
    dimensions.width < 1
    || dimensions.height < 1
    || dimensions.width > maximumEdge
    || dimensions.height > maximumEdge
  ) {
    throw new Error("The image dimensions are not supported.");
  }

  return { extension: "webp", ...dimensions };
}
