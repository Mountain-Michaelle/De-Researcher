# 0G Storage Integration (Layman Version)

This app uses 0G to store files in a decentralized way, and uses your app database layer to remember which file belongs to which project.

In simple words:
- Solidity keeps project/funding logic on-chain.
- 0G keeps the heavy files.
- App routes keep only file references (metadata).

## 0G Storage Use Cases (Your Requested Model)

0G Storage can be used for:
- Dataset storage
- NFT metadata
- AI model weights
- User files

In this project, we are currently using it for:
- User files (documents and thumbnails linked to research projects)

The same flow can later be reused for datasets, NFT metadata JSON, or model weights.

## Actual Compute Output Powered by 0G

A key pitch point: 0G does real computation during upload.

When a file is uploaded, the SDK computes a Merkle tree and gives:
- `rootHash`: cryptographic fingerprint of the file
- `txHash`: upload transaction hash

This is the actual verifiable output from 0G compute in your current app.

Example response shape:

```json
{
  "rootHash": "0xabc123...",
  "txHash": "0xdef456...",
  "url": "https://your-gateway/0xabc123...",
  "size": 245678,
  "type": "application/pdf",
  "fileName": "proposal.pdf"
}
```

## Flow (How Routes Interact)

```text
User creates project on-chain -> gets projectId
        |
        v
POST /api/upload
  - validates file
  - uploads file to 0G
  - returns rootHash + txHash
        |
        v
POST /api/projects/{projectId}/files
  - stores metadata linked to projectId + fieldType
        |
        v
GET /api/projects/{projectId}/files
  - returns metadata so UI can render files
```

## Routes in This Project

- `POST /api/upload`
  - receives multipart file
  - sends file to 0G through server upload service
  - returns `rootHash`, `txHash`, and file info

- `POST /api/projects/{projectId}/files`
  - stores metadata only (`rootHash`, `txHash`, file info, `fieldType`)

- `GET /api/projects/{projectId}/files`
  - fetches all metadata for project details page

## Required Environment Variables

Set these in `.env.local`:

```env
OG_INDEXER_RPC=
OG_RPC_URL=
OG_PRIVATE_KEY=
NEXT_PUBLIC_0G_GATEWAY=
MAX_UPLOAD_MB=10
```

Optional:

```env
OG_FLOW_NODES=grpc-node-1,grpc-node-2
```

If `OG_FLOW_NODES` is not set, the SDK auto-selects available storage nodes.

## Data Model Stored by App

`types/project-file.ts`:
- `projectId`
- `rootHash`
- `txHash`
- `fileName`
- `size`
- `type`
- `uploadedBy`
- `createdAt`
- `fieldType` (`document` or `thumbnail`)

Important:
- File bytes are in 0G Storage.
- App stores only metadata links.

## Current Limitations

- Metadata storage is currently in-memory (`lib/storage/project-file.store.ts`), so restart clears data.
- No persistent database yet.
- No wallet-signature verification on metadata API yet.

## Solidity Impact

No Solidity changes required for this upload feature:
- `projectId` already exists from contract events.
- File metadata is intentionally off-chain.
