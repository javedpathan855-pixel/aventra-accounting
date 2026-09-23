"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import Button from "@/shared/components/ui/button";
import FieldError from "@/shared/components/ui/field-error";
import cn from "@/shared/utils/cn";
import { getFieldErrorId } from "@/shared/utils/form-ids";
import {
  validateImageFile,
  type UploadConstraints,
} from "@/features/organization/domain/services/upload-validation";

interface LogoUploadFieldProps {
  id: string;
  uploadLabel: string;
  acceptText: string;
  recommendedText?: string;
  removeLabel: string;
  constraints: UploadConstraints;
  /** Local preview URL (object URL or served asset). Null = placeholder. */
  previewUrl: string | null;
  previewAlt: string;
  compact?: boolean;
  onSelect: (file: File, previewUrl: string) => void;
  onRemove: () => void;
}

/**
 * Shared imagery upload (organization logo, primary logo, favicon).
 * Validates type + size through the domain validator, shows a local
 * preview, and surfaces errors through FieldError. No persistence here:
 * without asset storage the file stays local until Save (and only
 * persisted fields travel to the server).
 */
const LogoUploadField = ({
  id,
  uploadLabel,
  acceptText,
  recommendedText,
  removeLabel,
  constraints,
  previewUrl,
  previewAlt,
  compact = false,
  onSelect,
  onRemove,
}: LogoUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const errorId = getFieldErrorId(id);

  // Revoke the previous object URL whenever the preview is replaced or
  // the field unmounts, so repeated uploads cannot leak memory.
  const previousUrl = useRef<string | null>(null);
  useEffect(() => {
    const current = previewUrl;
    const previous = previousUrl.current;
    previousUrl.current = current;
    if (previous && previous !== current && previous.startsWith("blob:")) {
      URL.revokeObjectURL(previous);
    }
  }, [previewUrl]);
  useEffect(() => {
    return () => {
      const current = previousUrl.current;
      if (current && current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
    };
  }, []);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      return;
    }
    const message = validateImageFile(
      { type: file.type, size: file.size, name: file.name },
      constraints,
    );
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStatus(`${uploadLabel} selected: ${file.name}. Local preview only.`);
    onSelect(file, URL.createObjectURL(file));
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className={cn(
          "flex min-w-0 flex-wrap gap-4",
          compact ? "items-center" : "items-start",
        )}
      >
        <div
          aria-hidden={previewUrl ? undefined : true}
          role={previewUrl ? "img" : undefined}
          aria-label={previewUrl ? previewAlt : undefined}
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-surface-subtle",
            compact ? "h-20 w-20" : "h-28 w-28",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Image
              src="/images/aventra-logo.png"
              alt=""
              width={compact ? 44 : 56}
              height={compact ? 44 : 56}
              className="opacity-90"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-[1_1_12rem] flex-col items-start gap-1.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            aria-describedby={error ? errorId : undefined}
          >
            <Upload aria-hidden="true" className="h-4 w-4" />
            {uploadLabel}
          </Button>
          <p className="font-lato text-xs text-muted">{acceptText}</p>
          {recommendedText ? (
            <p className="font-lato text-xs text-muted">{recommendedText}</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStatus(`${removeLabel.replace(/^Remove\s+/i, "")} removed.`);
              onRemove();
            }}
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 rounded-md font-lato text-sm font-medium text-error",
              "transition-colors hover:text-error/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            )}
            aria-label={removeLabel}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {removeLabel}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={constraints.accept.join(",")}
        aria-label={uploadLabel}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <FieldError id={errorId} message={error} />
      {status ? (
        <p role="status" className="sr-only">
          {status}
        </p>
      ) : null}
    </div>
  );
};

export default LogoUploadField;
