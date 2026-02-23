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

## Flow (How Routes + Detail View Interact)

```text
┌──────────────────────────────┐
│ 1) User creates project      │
│    (Solidity / ethers.js)    │
└──────────────┬───────────────┘
               │ returns projectId
               v
┌──────────────────────────────┐
│ 2) POST /api/upload          │
│    - validate type + size    │
│    - upload bytes to 0G      │
│    - get rootHash + txHash   │
└──────────────┬───────────────┘
               │ upload result
               v
┌──────────────────────────────┐
│ 3) POST /api/projects/{id}/files
│    - store metadata only     │
│    - link to projectId       │
│    - fieldType=document|thumb│
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│ 4) Detail page loads         │
│    GET /api/projects/{id}/files
└──────────────┬───────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    v                     v
Files exist          No files yet
render docs +        show badge:
thumbnail preview    "0G storage integrated"
and download links   + "No project files available yet."
```

## Routes in This Project

- `POST /api/upload`
  - receives multipart file in exactly one field:
    - `document` (`.pdf`, `.doc`, `.docx`)
    - `thumbnail` (`.png`, `.jpg`, `.jpeg`)
  - sends file to 0G through server upload service
  - returns `rootHash`, `txHash`, and file info

- `POST /api/projects/{projectId}/files`
  - stores metadata only (`rootHash`, `txHash`, file info, `fieldType`)

- `GET /api/projects/{projectId}/files`
  - fetches all metadata for project details page

## Detail View Behavior

- If files are present:
  - Documents show `View` and `Download`.
  - Thumbnails show image preview plus `Open` and `Download`.
- If files are not present:
  - UI does not show empty file cards.
  - UI shows an integration status badge:
    - `0G storage integrated`

## How To Test (Manual API Check)

1. Set env and restart dev server:
```env
DEBUG_API=true
```

2. Upload a document:
```powershell
$doc = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/upload" -Form @{
  document = Get-Item "C:\path\proposal.pdf"
}
$doc | ConvertTo-Json -Depth 5
```

3. Upload a thumbnail:
```powershell
$thumb = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/upload" -Form @{
  thumbnail = Get-Item "C:\path\thumb.jpg"
}
$thumb | ConvertTo-Json -Depth 5
```

4. Save metadata to a project:
```powershell
$projectId = 9
$payload = @{
  uploadedBy = "0xYourWalletAddress"
  files = @(
    @{
      rootHash  = $doc.rootHash
      txHash    = $doc.txHash
      fileName  = $doc.fileName
      size      = $doc.size
      type      = $doc.type
      fieldType = "document"
    },
    @{
      rootHash  = $thumb.rootHash
      txHash    = $thumb.txHash
      fileName  = $thumb.fileName
      size      = $thumb.size
      type      = $thumb.type
      fieldType = "thumbnail"
    }
  )
} | ConvertTo-Json -Depth 8

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/projects/$projectId/files" -ContentType "application/json" -Body $payload
```

5. Fetch and confirm:
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/projects/$projectId/files" | ConvertTo-Json -Depth 10
```

6. Check terminal logs (because `DEBUG_API=true`):
- `[api/upload] file_validated`
- `[api/upload] upload_success`
- `[api/projects/:projectId/files] post_success`
- `[api/projects/:projectId/files] get_success`

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
