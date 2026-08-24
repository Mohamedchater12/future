"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconUser, IconLoader2, IconX } from "@tabler/icons-react";
import { useClientProfile } from "@/lib/client-space/useClientProfile";
import { useClientLanguage } from "@/lib/i18n/clientSpace/ClientLanguageContext";

export default function AvatarUpload() {
  const router = useRouter();
  const { client, mutate } = useClientProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { dict } = useClientLanguage();

  async function saveAvatar(avatarUrl: string | null) {
    setIsUploading(true);
    try {
      const response = await fetch("/api/client/me/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });
      if (!response.ok) throw new Error("update_failed");
      mutate();
      router.refresh();
    } catch {
      toast.error(dict.profile.errors.avatarUpdateFailed);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(dict.profile.errors.invalidImage);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => saveAvatar(reader.result as string);
    reader.onerror = () => toast.error(dict.profile.errors.imageReadFailed);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
        {client?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={client.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <IconUser size={26} className="text-base-gray" />
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
          {client?.avatarUrl ? dict.profile.changePhoto : dict.profile.addPhoto}
        </button>
        {client?.avatarUrl && (
          <button
            type="button"
            onClick={() => saveAvatar(null)}
            className="text-base-gray hover:text-red-400"
            aria-label={dict.profile.removePhotoAria}
          >
            <IconX size={16} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
