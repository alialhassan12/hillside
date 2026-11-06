import { useId } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { labelClass } from "./adminClasses";

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  previewSrc?: string;
  previewClassName?: string;
  accept?: string;
  multiple?: boolean;
  onFileChange?: (file: File | null) => void;
  selectedFileName?: string;
}

export default function ImageUploadField({
  label,
  hint,
  previewSrc,
  previewClassName = "aspect-video",
  accept = "image/jpeg,image/png,image/webp",
  multiple = false,
  onFileChange,
  selectedFileName,
}: ImageUploadFieldProps) {
  const inputId = useId();

  return (
    <div>
      <span className={labelClass}>{label}</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div
          className={`flex w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100 sm:w-44 ${previewClassName}`}
        >
          {previewSrc ? (
            <img
              src={previewSrc}
              alt={`Current ${label.toLowerCase()}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon
              size={28}
              className="text-stone-400"
              aria-hidden="true"
            />
          )}
        </div>

        <label
          htmlFor={inputId}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-stone-300 px-4 py-6 text-center transition-colors hover:border-gold hover:bg-stone-50 has-focus-visible:border-gold"
        >
          <Upload size={20} className="text-gold" aria-hidden="true" />
          <span className="text-sm font-medium text-stone-700">
            {selectedFileName ?? (multiple ? "Choose files" : "Choose a file")}
          </span>
          <span className="text-xs text-stone-500">{hint}</span>

          <input
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(event) => {
              onFileChange?.(event.target.files?.[0] ?? null);
            }}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
