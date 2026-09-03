"use client";

import { useEffect, useState } from "react";
import { CmsField } from "@/cms/components/ui/CmsField";
import { largeCmsImageBytes } from "@/cms/media/image-policy";
import { optimizeCmsImage } from "@/cms/media/optimize-image";

type CmsImageFieldProps = {
  id: string;
  label: string;
  currentUrl: string;
  urlName: string;
  fileName: string;
  accept: string;
  hint: string;
  maximumEdge?: number;
  onProcessingChange?: (processing: boolean) => void;
  alt?: {
    name: string;
    value: string;
    label?: string;
    required?: boolean;
  };
};

export function CmsImageField({
  id,
  label,
  currentUrl,
  urlName,
  fileName,
  accept,
  hint,
  maximumEdge,
  onProcessingChange,
  alt,
}: CmsImageFieldProps) {
  const [preview, setPreview] = useState(currentUrl);
  const [selectedName, setSelectedName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  async function selectImage(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;

    setProcessing(true);
    setError("");
    setWarning("");
    onProcessingChange?.(true);

    try {
      const optimized = await optimizeCmsImage(file, maximumEdge);
      const files = new DataTransfer();
      files.items.add(optimized);
      input.files = files.files;
      setSelectedName(optimized.name);
      setWarning(
        optimized.size > largeCmsImageBytes
          ? "This image is still quite large. Try a smaller source image if possible."
          : "",
      );
      setPreview((previous) => {
        if (previous.startsWith("blob:")) URL.revokeObjectURL(previous);
        return URL.createObjectURL(optimized);
      });
    } catch (failure) {
      input.value = "";
      setSelectedName("");
      setWarning("");
      setError(
        failure instanceof Error
          ? failure.message
          : "The image could not be optimized.",
      );
    } finally {
      setProcessing(false);
      onProcessingChange?.(false);
    }
  }

  return (
    <div className="cms-field-stack cms-media-stack" data-wide aria-busy={processing}>
      <label htmlFor={`${id}-file`}>{label}</label>
      <div className="cms-media-field">
        <div className="cms-media-summary">
          <div className="cms-media-preview">
            {preview ? (
              // CMS assets may be local or come from the configured public Blob store.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div className="cms-media-copy">
            <strong>
              {processing
                ? "Optimizing image…"
                : selectedName || (currentUrl ? "Published image" : "No image published")}
            </strong>
            <small>{hint}</small>
            {error ? <small className="cms-field-error" role="alert">{error}</small> : null}
            {warning ? <small role="status">{warning}</small> : null}
            <label className="cms-file-button" htmlFor={`${id}-file`}>Choose image</label>
            <input
              className="cms-file-input"
              id={`${id}-file`}
              name={fileName}
              type="file"
              accept={accept}
              disabled={processing}
              onChange={(event) => void selectImage(event.currentTarget)}
            />
            <input type="hidden" name={urlName} value={currentUrl} />
          </div>
        </div>
        {alt ? (
          <div className="cms-media-alt">
            <CmsField
              id={`${id}-alt`}
              name={alt.name}
              label={alt.label ?? "Alternative text"}
              defaultValue={alt.value}
              maxLength={500}
              required={alt.required}
              hint="Describe what matters in the image for someone who cannot see it."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
