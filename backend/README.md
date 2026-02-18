# Resume Storage System Backend

This backend service provides secure storage, retrieval, and management of user resumes using Firebase Firestore and Node.js.

## Features

- **Resume Storage**: Secure storage of resume content and metadata.
- **Versioning**: Automatic version control for every resume update.
- **Context Awareness**: Stores context (template used, creation method) alongside content.
- **Audit Logging**: Tracks all CREATE, UPDATE, DELETE actions for GDPR compliance.
- **Transactional Integrity**: Uses Firestore transactions to ensure data consistency.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes` | Create a new resume with context. |
| GET | `/api/resumes/user/:userId` | List all resumes for a user. |
| GET | `/api/resumes/:id` | Get a specific resume by ID. |
| PUT | `/api/resumes/:id` | Update resume content and/or context. |
| DELETE | `/api/resumes/:id` | Delete a resume (soft delete recommended). |

## Scripts

### Archival Script
Archives resumes that haven't been updated in over a year.
```bash
node scripts/archive.js
```

### Monitoring Script
Checks system stats and alerts on suspicious activity (e.g., mass deletions).
```bash
node scripts/monitor.js
```

## Setup

1. Place your `serviceAccountKey.json` in the `backend/` directory.
2. Run `npm install`.
3. Start the server: `node server.js`.
