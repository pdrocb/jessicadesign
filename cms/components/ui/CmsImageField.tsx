"use client";

import { useEffect, useState } from "react";
import { CmsField } from "@/cms/components/ui/CmsField";

type CmsImageFieldProps = {
  id: string;
  label: string;
  currentUrl: string;
  urlName: string;
  fileName: string;
  accept: string;
  hint: string;
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
  alt,
}: CmsImageFieldProps) {
  const [preview, setPreview] = useState(currentUrl);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className="cms-field-stack cms-media-stack" data-wide>
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
            <strong>{selectedName || (currentUrl ? "Published image" : "No image published")}</strong>
            <small>{hint}</small>
            <label className="cms-file-button" htmlFor={`${id}-file`}>Choose image</label>
            <input
              className="cms-file-input"
              id={`${id}-file`}
              name={fileName}
              type="file"
              accept={accept}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;
                setSelectedName(file.name);
                setPreview((previous) => {
                  if (previous.startsWith("blob:")) URL.revokeObjectURL(previous);
                  return URL.createObjectURL(file);
                });
              }}
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
