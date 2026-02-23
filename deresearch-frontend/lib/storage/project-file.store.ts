import type { ProjectFile } from "@/types/project-file";
import { sanitizeFileName } from "@/lib/storage/storage.utils";

const projectFileStore = new Map<string, ProjectFile[]>();

export interface CreateProjectFileInput {
  projectId: string;
  rootHash: string;
  txHash?: string;
  fileName: string;
  size: number;
  type: string;
  uploadedBy: string;
  fieldType: "document" | "thumbnail";
}

const ensureProjectList = (projectId: string): ProjectFile[] => {
  const list = projectFileStore.get(projectId);
  if (list) return list;

  const next: ProjectFile[] = [];
  projectFileStore.set(projectId, next);
  return next;
};

export const listProjectFiles = (projectId: string): ProjectFile[] => {
  return [...ensureProjectList(projectId)];
};

export const saveProjectFileMetadata = (
  input: CreateProjectFileInput
): ProjectFile => {
  const existing = ensureProjectList(input.projectId);
  const duplicate = existing.find(
    (file) =>
      file.rootHash === input.rootHash &&
      file.fieldType === input.fieldType &&
      file.fileName === sanitizeFileName(input.fileName)
  );

  if (duplicate) {
    return duplicate;
  }

  const created: ProjectFile = {
    id: crypto.randomUUID(),
    projectId: input.projectId,
    rootHash: input.rootHash,
    txHash: input.txHash,
    fileName: sanitizeFileName(input.fileName),
    size: input.size,
    type: input.type,
    uploadedBy: input.uploadedBy,
    createdAt: new Date().toISOString(),
    fieldType: input.fieldType,
  };

  existing.push(created);
  return created;
};
