"use client";

import { useEffect, useState } from "react";
import type { ProjectFile } from "@/types/project-file";

interface ProjectFilesProps {
  projectId: string;
}

const gatewayBase = (process.env.NEXT_PUBLIC_0G_GATEWAY || "").replace(/\/+$/, "");
const resolveFileUrl = (rootHash: string): string => {
  if (!gatewayBase) return rootHash;
  return `${gatewayBase}/${rootHash}`;
};

export const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let active = true;

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${projectId}/files`);
        if (!response.ok) {
          throw new Error("Failed to fetch project files.");
        }
        const data = (await response.json()) as { files?: ProjectFile[] };
        if (active) {
          setFiles(Array.isArray(data.files) ? data.files : []);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch files.";
        if (active) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchFiles();

    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return <p className="text-gray-400 mt-6">Loading project files...</p>;
  }

  if (error) {
    return (
      <p className="text-red-400 mt-6">
        {error} Try refreshing or uploading again.
      </p>
    );
  }

  if (!files.length) {
    return (
      <div className="mt-6">
        <span className="inline-flex items-center rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-400/30">
          0G storage integrated
        </span>
        <p className="text-gray-400 mt-2 text-sm">
          No project files available yet.
        </p>
      </div>
    );
  }

  const documents = files.filter((file) => file.fieldType === "document");
  const thumbnails = files.filter((file) => file.fieldType === "thumbnail");

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-blue-300 mb-4">Files</h3>
      {!gatewayBase && (
        <p className="text-xs text-yellow-300 mb-4">
          `NEXT_PUBLIC_0G_GATEWAY` is not set. URLs may not be directly downloadable.
        </p>
      )}
      {documents.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-blue-200 mb-3">Documents</h4>
          <div className="space-y-3">
            {documents.map((file) => (
              <div
                key={file.id}
                className="bg-gray-700/70 p-4 rounded-lg flex justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-white break-all">{file.fileName}</p>
                  <p className="text-xs text-gray-300">
                    {(file.size / 1024).toFixed(1)} KB · {file.type}
                  </p>
                  <p className="text-xs text-gray-400 break-all">
                    rootHash: {file.rootHash}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <a
                    className="text-sm text-blue-300 underline"
                    href={resolveFileUrl(file.rootHash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                  <a
                    className="text-sm text-green-300 underline"
                    href={resolveFileUrl(file.rootHash)}
                    download={file.fileName}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {thumbnails.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-blue-200 mb-3">Thumbnails</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {thumbnails.map((file) => (
              <div key={file.id} className="bg-gray-700/70 p-3 rounded-lg">
                <img
                  src={resolveFileUrl(file.rootHash)}
                  alt={file.fileName}
                  className="h-36 w-full object-cover rounded"
                />
                <p className="font-semibold text-white break-all mt-2">{file.fileName}</p>
                <div className="flex gap-3 mt-2">
                  <a
                    className="text-sm text-blue-300 underline"
                    href={resolveFileUrl(file.rootHash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                  <a
                    className="text-sm text-green-300 underline"
                    href={resolveFileUrl(file.rootHash)}
                    download={file.fileName}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
