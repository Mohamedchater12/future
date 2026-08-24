import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import cloudinary from "@/lib/cloudinary";

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

export type UploadOutcome =
  | { ok: true; url: string }
  | { ok: false; error: string; status: number };

// Shared by the admin (images) and client (PDF/Word) upload endpoints — the
// only difference between callers is the allowed MIME types and, for
// non-image documents, Cloudinary's "raw" resource type.
export async function saveUploadedFile(
  file: File,
  {
    allowedTypes,
    extensionByType,
    maxSize,
    resourceType,
  }: {
    allowedTypes: string[];
    extensionByType: Record<string, string>;
    maxSize: number;
    resourceType?: "raw";
  }
): Promise<UploadOutcome> {
  if (!allowedTypes.includes(file.type)) {
    return { ok: false, error: "invalid_file_type", status: 400 };
  }
  if (file.size > maxSize) {
    return { ok: false, error: "file_too_large", status: 400 };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isCloudinaryConfigured) {
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "future-agency",
        ...(resourceType ? { resource_type: resourceType } : {}),
      });
      return { ok: true, url: result.secure_url };
    } catch {
      return { ok: false, error: "upload_failed", status: 502 };
    }
  }

  // Cloudinary credentials aren't set (dev fallback) — store the file locally
  // under /public/uploads. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in
  // .env to switch to Cloudinary (required for production/serverless).
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${randomUUID()}.${extensionByType[file.type]}`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    return { ok: true, url: `/uploads/${filename}` };
  } catch {
    return { ok: false, error: "upload_failed", status: 502 };
  }
}
