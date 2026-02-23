"use client";

import { useState } from "react";
import type { ProjectFile } from "@/types/project-file";
import { uploadFile, type UploadFieldType } from "@/lib/storage/storage.service";


interface UploadState {
  loading: boolean;
  error: string | null;
  result: ProjectFile[] | null;
  progress: number;
}

interface UploadOptions {
  projectId: string;
  uploadedBy?: string;
}

export const useProjectUpload = (defaults?: UploadOptions) => {
  const [state, setState] = useState<UploadState>({
    loading: false,
    error: null,
    result: null,
    progress: 0,
  });

  const upload = async (
    file: File,
    fieldType: UploadFieldType,
    options?: UploadOptions
  ): Promise<ProjectFile> => {
    setState((prev) => ({ ...prev, loading: true, error: null, progress: 0 }));
    try {
      const context = options || defaults;
      if (!context?.projectId) {
        throw new Error("projectId is required for uploads.");
      }

      setState((prev) => ({ ...prev, progress: 20 }));
      const uploadResult = await uploadFile(file, fieldType);
      setState((prev) => ({ ...prev, progress: 75 }));

      const response = await fetch(`/api/projects/${context.projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadedBy: context.uploadedBy || "unknown",
          files: [
            {
              rootHash: uploadResult.rootHash,
              txHash: uploadResult.txHash,
              fileName: uploadResult.fileName,
              size: uploadResult.size,
              type: uploadResult.type,
              fieldType,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(errorData?.error || "Failed to persist uploaded metadata.");
      }

      const payload = (await response.json()) as { files?: ProjectFile[] };
      const uploaded = payload.files?.[0];
      if (!uploaded) {
        throw new Error("Upload metadata response missing file record.");
      }

      setState((prev) => ({ ...prev, progress: 100 }));
      setState((prev) => ({ ...prev, loading: false, result: [uploaded] }));
      return uploaded;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  return {
    upload,
    loading: state.loading,
    error: state.error,
    result: state.result,
    progress: state.progress,
  };
};
