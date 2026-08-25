import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type CmsFieldProps = {
  id: string;
  name?: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type?: Exclude<HTMLInputTypeAttribute, "file"> | "textarea";
  hint?: string;
  required?: boolean;
  wide?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  placeholder?: string;
  autoFocus?: boolean;
};

export function CmsField({
  id,
  name = id,
  label,
  defaultValue,
  value,
  onChange,
  type = "text",
  hint,
  required,
  wide,
  rows = 4,
  maxLength,
  disabled,
  autoComplete,
  inputMode,
  placeholder,
  autoFocus,
}: CmsFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const sharedProps = {
    id,
    name,
    ...(value === undefined ? { defaultValue } : { value }),
    onChange,
    required,
    maxLength,
    disabled,
    autoComplete,
    placeholder,
    autoFocus,
    "aria-describedby": hintId,
  };

  return (
    <div className="cms-field-stack" data-wide={wide || undefined}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input {...sharedProps} type={type} inputMode={inputMode} />
      )}
      {hint ? <small id={hintId}>{hint}</small> : null}
    </div>
  );
}
