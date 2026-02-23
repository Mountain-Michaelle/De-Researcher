"use client";

export type UploadFieldType = "document" | "thumbnail";

export interface UploadResult {
  rootHash: string;
  txHash?: string;
  url: string;
  size: number;
  type: string;
  fileName: string;
}

export const uploadFile = async (
  file: File,
  fieldType: UploadFieldType
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append(fieldType, file, file.name);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | UploadResult
    | { error?: string }
    | null;

  if (!response.ok) {
    const message =
      payload && "error" in payload && payload.error
        ? payload.error
        : `Upload failed (${response.status}).`;
    throw new Error(message);
  }

  if (!payload || !("rootHash" in payload)) {
    throw new Error("Invalid upload response.");
  }

  return payload;
};
