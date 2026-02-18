# Firebase Setup Guide for AI Resume Builder

## 1. Create/Open Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Open your project: **resume-ai-97737**.

## 2. Enable Authentication
1. Navigate to **Build** > **Authentication**.
2. Click **Get Started**.
3. Go to the **Sign-in method** tab.
4. Enable **Email/Password** and **Google** providers.

## 3. Enable Firestore Database
1. Navigate to **Build** > **Firestore Database**.
2. Click **Create Database**.
3. Select **Production mode** (recommended) or **Test mode**.
4. Choose a location (e.g., `nam5 (us-central)`).
5. Click **Enable**.

## 4. Create Required Index (Crucial for Dashboard)
The dashboard executes a query that requires a composite index. Without this, your resumes won't load.

**Query:** `resumes` collection, filtered by `user_id`, sorted by `updated_at` descending.

**Steps to create:**
1. Go to **Firestore Database** > **Indexes**.
2. Click **Create Index**.
3. Enter the following details:
   - **Collection ID**: `resumes`
   - **Fields to index**:
     1. Field path: `user_id` -> Index mode: `Ascending`
     2. Field path: `updated_at` -> Index mode: `Descending`
4. Click **Create**.
   - *Note: Index building may take a few minutes.*

## 5. Verify Security Rules
Since all database operations are handled by the backend (which uses the Admin SDK and bypasses rules), strict rules are safe.

1. Go to **Firestore Database** > **Rules**.
2. Use these rules to prevent direct public access (since only your backend should touch the DB):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Deny all client-side access
    }
  }
}
```

## 6. Service Account (Already Completed)
You have already added the `serviceAccountKey.json` to `backend/config/`. This allows the backend to authenticate as an Admin.
