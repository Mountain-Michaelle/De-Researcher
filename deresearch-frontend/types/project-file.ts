export interface ProjectFile {
  id: string;
  projectId: string;
  rootHash: string;
  txHash?: string;
  fileName: string;
  size: number;
  type: string;
  uploadedBy: string;
  createdAt: string;
  fieldType: "document" | "thumbnail";
}
