import { NextRequest, NextResponse } from "next/server";
import { uploadFileOnServer } from "@/lib/storage/server-upload.service";
import { sanitizeFileName } from "@/lib/storage/storage.utils";

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB ?? 10);
const MAX_UPLOAD_BYTES = Math.max(MAX_UPLOAD_MB, 1) * 1024 * 1024;
const DEBUG_API = process.env.DEBUG_API === "true";

const DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const THUMBNAIL_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
]);

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 25;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim();
  return candidate || request.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
};

const debugLog = (message: string, meta?: Record<string, unknown>) => {
  if (!DEBUG_API) return;
  console.info(`[api/upload] ${message}`, meta ?? {});
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  debugLog("request_received", { ip });

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const documentFile = formData.get("document");
  const thumbnailFile = formData.get("thumbnail");

  const hasDocument = documentFile instanceof File;
  const hasThumbnail = thumbnailFile instanceof File;

  if (hasDocument === hasThumbnail) {
    return NextResponse.json(
      {
        error:
          "Provide exactly one file field: either `document` or `thumbnail`.",
      },
      { status: 400 }
    );
  }

  const fieldType = hasDocument ? "document" : "thumbnail";
  const file = (hasDocument ? documentFile : thumbnailFile) as File;

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File size exceeds ${MAX_UPLOAD_MB}MB limit.` },
      { status: 400 }
    );
  }

  const allowedTypes =
    fieldType === "document" ? DOCUMENT_MIME_TYPES : THUMBNAIL_MIME_TYPES;

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      {
        error:
          fieldType === "document"
            ? "Unsupported document type. Use PDF, DOC, or DOCX."
            : "Unsupported thumbnail type. Use PNG, JPG, or JPEG.",
      },
      { status: 400 }
    );
  }

  const safeName = sanitizeFileName(file.name);
  debugLog("file_validated", {
    fieldType,
    originalName: file.name,
    safeName,
    size: file.size,
    type: file.type,
  });

  const safeFile = new File([file], safeName, {
    type: file.type,
    lastModified: file.lastModified,
  });

  try {
    const result = await uploadFileOnServer(safeFile);
    debugLog("upload_success", {
      fieldType,
      rootHash: result.rootHash,
      txHash: result.txHash,
      size: result.size,
      type: result.type,
    });
    return NextResponse.json({ ...result, fieldType });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    debugLog("upload_failed", { message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
