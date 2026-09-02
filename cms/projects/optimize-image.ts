const maximumEdge = 2_000;
const webpQuality = 0.82;

function webpName(name: string) {
  return `${name.replace(/\.[^.]+$/, "") || "project-photograph"}.webp`;
}

export async function optimizeProjectImage(file: File): Promise<File> {
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
        (result) => result ? resolve(result) : reject(new Error("This browser could not optimize the image.")),
        "image/webp",
        webpQuality,
      );
    });

    const optimized = new File([blob], webpName(file.name), {
      type: "image/webp",
      lastModified: file.lastModified,
    });

    return optimized.size < file.size ? optimized : file;
  } finally {
    bitmap.close();
  }
}
