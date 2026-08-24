"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IconPhoto, IconLoader2, IconX } from "@tabler/icons-react";
import { useAdminLanguage } from "@/lib/i18n/admin/context";
import { shellTranslations } from "@/lib/i18n/admin/shell";

export default function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { lang } = useAdminLanguage();
  const dict = shellTranslations[lang];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("upload_failed");
      const data = await response.json();
      onChange(data.url);
    } catch {
      toast.error(dict.common.uploadFailed);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          {value ? (
            <Image src={value} alt="" width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            <IconPhoto size={22} className="text-base-gray" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading && <IconLoader2 size={14} className="animate-spin" />}
            {value ? dict.common.replaceImage : dict.common.uploadImage}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-base-gray hover:text-red-400"
              aria-label={dict.common.removeImage}
            >
              <IconX size={16} />
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
