export const sanitizeFileName = (name: string): string => {
  const baseName = name.split(/[\\/]/).pop() || "file";
  const cleaned = baseName
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (cleaned || "file").slice(0, 120);
};
