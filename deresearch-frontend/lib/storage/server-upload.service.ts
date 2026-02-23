import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ethers } from "ethers";

import type { UploadResult } from "@/lib/storage/storage.service";

const getGatewayBase = (): string => {
  const raw = process.env.NEXT_PUBLIC_0G_GATEWAY || "";
  return raw.replace(/\/+$/, "");
};

const toHexString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "toString" in value) {
    return String((value as { toString: () => string }).toString());
  }
  return String(value);
};

const extractTxHash = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "object" && value !== null && "hash" in value) {
    return toHexString((value as { hash: unknown }).hash);
  }
  return toHexString(value);
};

const toBytes = async (file: File): Promise<Uint8Array> => {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
};

const writeTempFile = async (file: File): Promise<string> => {
  const extension = path.extname(file.name || "").toLowerCase();
  const tempName = `zg-${Date.now()}-${crypto.randomUUID()}${extension}`;
  const tempPath = path.join(os.tmpdir(), tempName);
  const bytes = await toBytes(file);
  await fs.writeFile(tempPath, bytes);
  return tempPath;
};

export const uploadFileOnServer = async (file: File): Promise<UploadResult> => {
  const indexerRpc = process.env.OG_INDEXER_RPC || "";
  const rpcUrl = process.env.OG_RPC_URL || "";
  const privateKey = process.env.OG_PRIVATE_KEY || "";
  if (!indexerRpc || !rpcUrl || !privateKey) {
    throw new Error(
      "Missing 0G config. Set OG_INDEXER_RPC, OG_RPC_URL, and OG_PRIVATE_KEY."
    );
  }

  const { ZgFile, Indexer } = await import("@0glabs/0g-ts-sdk");
  const signer = new ethers.Wallet(privateKey, new ethers.JsonRpcProvider(rpcUrl));
  const indexer = new Indexer(indexerRpc);

  const tempPath = await writeTempFile(file);
  let rootHash = "";
  let txHash = "";

  try {
    const zgFile = await ZgFile.fromFilePath(tempPath);
    try {
      const [tree, treeErr] = await zgFile.merkleTree();
      if (treeErr !== null) {
        throw new Error(`Failed to build Merkle tree: ${treeErr}`);
      }
      rootHash = toHexString(tree?.rootHash());

      const [tx, uploadErr] = await indexer.upload(zgFile, rpcUrl, signer);
      if (uploadErr !== null) {
        throw new Error(`0G upload failed: ${uploadErr}`);
      }
      txHash = extractTxHash(tx);
    } finally {
      await zgFile.close();
    }
  } finally {
    await fs.unlink(tempPath).catch(() => undefined);
  }

  if (!rootHash) {
    throw new Error("0G upload completed but rootHash was not returned.");
  }

  const gateway = getGatewayBase();

  return {
    rootHash,
    txHash: txHash || undefined,
    url: gateway ? `${gateway}/${rootHash}` : rootHash,
    size: file.size,
    type: file.type,
    fileName: file.name || "file",
  };
};
