import "server-only";

import { maximumProjectImageBytes } from "@/cms/projects/image-policy";

const projectImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

const maximumImageDimension = 20_000;

export type ProjectImageMetadata = {
  extension: string;
  width: number;
  height: number;
};

function readUint16BigEndian(bytes: Uint8Array, offset: number) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

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

function isJpegStartOfFrame(marker: number) {
  return (
    (marker >= 0xc0 && marker <= 0xc3)
    || (marker >= 0xc5 && marker <= 0xc7)
    || (marker >= 0xc9 && marker <= 0xcb)
    || (marker >= 0xcd && marker <= 0xcf)
  );
}

function jpegDimensions(bytes: Uint8Array) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("The JPG file could not be read.");
  }

  let offset = 2;
  while (offset < bytes.length) {
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) break;

    const segmentLength = readUint16BigEndian(bytes, offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) break;

    if (isJpegStartOfFrame(marker)) {
      if (segmentLength < 8) break;
      return {
        height: readUint16BigEndian(bytes, offset + 3),
        width: readUint16BigEndian(bytes, offset + 5),
      };
    }

    offset += segmentLength;
  }

  throw new Error("The JPG dimensions could not be read.");
}

function webpDimensions(bytes: Uint8Array) {
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

export async function projectImageMetadata(file: File): Promise<ProjectImageMetadata> {
  const extension = projectImageTypes.get(file.type);
  if (!extension) throw new Error("Choose a JPG or WebP image.");
  if (file.size === 0) throw new Error("Choose an image before uploading.");
  if (file.size > maximumProjectImageBytes) throw new Error("The image must be 10 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const dimensions = file.type === "image/jpeg" ? jpegDimensions(bytes) : webpDimensions(bytes);

  if (
    dimensions.width < 1
    || dimensions.height < 1
    || dimensions.width > maximumImageDimension
    || dimensions.height > maximumImageDimension
  ) {
    throw new Error("The image dimensions are not supported.");
  }

  return { extension, ...dimensions };
}
