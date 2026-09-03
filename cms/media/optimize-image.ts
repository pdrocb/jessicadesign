import {
  cmsImageWebpQuality,
  maximumCmsImageBytes,
  maximumCmsImageEdge,
} from "@/cms/media/image-policy";

function webpName(name: string) {
  return `${name.replace(/\.[^.]+$/, "") || "cms-image"}.webp`;
}

export async function optimizeCmsImage(
  file: File,
  maximumEdge = maximumCmsImageEdge,
): Promise<File> {
  if (file.size > maximumCmsImageBytes) {
    throw new Error("Choose an image that is 10 MB or smaller.");
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, maximumEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser could not optimize the image.");
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => result
          ? resolve(result)
          : reject(new Error("This browser could not optimize the image.")),
        "image/webp",
        cmsImageWebpQuality,
      );
    });

    // The source upload is never retained. Blob receives only this normalized
    // WebP, even when the source file happened to contain fewer bytes.
    const optimized = new File([blob], webpName(file.name), {
      type: "image/webp",
      lastModified: file.lastModified,
    });
    if (optimized.size > maximumCmsImageBytes) {
      throw new Error("The optimized image must be 10 MB or smaller.");
    }
    return optimized;
  } finally {
    bitmap.close();
  }
}
