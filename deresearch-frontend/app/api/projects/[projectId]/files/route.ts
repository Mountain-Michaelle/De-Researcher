import { NextRequest, NextResponse } from "next/server";
import { listProjectFiles, saveProjectFileMetadata } from "@/lib/storage/project-file.store";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 50;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const DEBUG_API = process.env.DEBUG_API === "true";

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
  console.info(`[api/projects/:projectId/files] ${message}`, meta ?? {});
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const ip = getClientIp(request);
  const { projectId } = await params;
  debugLog("get_request_received", { ip, projectId });

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const files = listProjectFiles(projectId);
  debugLog("get_success", { projectId, count: files.length });

  return NextResponse.json({ files }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const ip = getClientIp(request);
  const { projectId } = await params;
  debugLog("post_request_received", { ip, projectId });

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = (await request.json()) as {
    files?: Array<{
      rootHash?: string;
      txHash?: string;
      fileName?: string;
      size?: number;
      type?: string;
      fieldType?: "document" | "thumbnail";
    }>;
    uploadedBy?: string;
  };

  if (!Array.isArray(body.files) || body.files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  const uploadedBy = body.uploadedBy || "unknown";
  debugLog("post_payload_validated", {
    projectId,
    uploadedBy,
    fileCount: body.files.length,
  });

  const created = body.files.map((file) =>
    saveProjectFileMetadata({
      projectId,
      rootHash: String(file.rootHash || ""),
      txHash: file.txHash ? String(file.txHash) : undefined,
      fileName: String(file.fileName || "file"),
      size: Number(file.size || 0),
      type: String(file.type || "application/octet-stream"),
      uploadedBy,
      fieldType: file.fieldType === "thumbnail" ? "thumbnail" : "document",
    })
  );

  const invalid = created.some((file) => !file.rootHash);
  if (invalid) {
    return NextResponse.json(
      { error: "Invalid file metadata payload." },
      { status: 400 }
    );
  }

  debugLog("post_success", { projectId, createdCount: created.length });
  return NextResponse.json({ files: created }, { status: 201 });
}
