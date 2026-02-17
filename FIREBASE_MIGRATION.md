# Firebase Migration Guide

## ✅ Migration Complete

All Supabase functionality has been successfully migrated to Firebase. The application now uses:
- **Firebase Authentication** for user authentication (email/password and OAuth)
- **Cloud Firestore** for database operations (resume CRUD)

## 🔧 Setup Instructions

### 1. Install Dependencies

Run the following command to install Firebase:

```bash
npm install
```

This will install `firebase` package (replacing `@supabase/supabase-js`).

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
   - Enable **Google** provider (if using OAuth)
   - Enable **GitHub** provider (if using OAuth)
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in **Production mode** (or Test mode for development)
   - Choose your preferred location

### 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Copy the Firebase configuration object

### 4. Update Environment Variables

Update your `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Security Rules

Set up Firestore security rules to secure your data. Go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Resumes collection - users can only access their own resumes
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

### 6. Create Firestore Indexes

The Dashboard query uses `where` and `orderBy` together, which requires a composite index:

1. When you first run the app and try to fetch resumes, Firebase will show an error with a link to create the index
2. Click the link or manually create an index in Firebase Console:
   - Collection: `resumes`
   - Fields: `user_id` (Ascending), `updated_at` (Descending)
   - Query scope: Collection

### 7. Firestore Collection Structure

The `resumes` collection should have documents with this structure:

```javascript
{
  user_id: "firebase_user_uid",
  title: "Resume Title",
  content: {
    personalInfo: { ... },
    summary: "...",
    experience: [ ... ],
    education: [ ... ],
    projects: [ ... ],
    certifications: [ ... ],
    skills: { ... }
  },
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## 📝 Changes Made

### Files Modified:
- ✅ `package.json` - Replaced Supabase with Firebase dependency
- ✅ `src/integrations/firebase/client.js` - New Firebase client configuration
- ✅ `src/pages/Auth.jsx` - Migrated to Firebase Authentication
- ✅ `src/pages/Dasboard.jsx` - Migrated to Firestore for CRUD operations
- ✅ `src/pages/Builder.jsx` - Migrated to Firestore for resume loading/saving
- ✅ `src/components/Navbar.jsx` - Updated logout to use Firebase
- ✅ `src/pages/index.jsx` - Updated auth state management
- ✅ `src/pages/ViewExamples.jsx` - Updated auth state management
- ✅ `.env` - Updated with Firebase configuration variables

### Functionality Preserved:
- ✅ Email/Password authentication (sign up & sign in)
- ✅ OAuth authentication (Google & GitHub)
- ✅ Session management and auth state listeners
- ✅ Resume CRUD operations (Create, Read, Update, Delete)
- ✅ Auto-save functionality
- ✅ User-specific data isolation

## 🚀 Testing

After setup, test the following:
1. User registration and login
2. OAuth login (Google/GitHub)
3. Creating a new resume
4. Editing and saving resume data
5. Deleting a resume
6. Logout functionality

## 📚 Firebase Documentation

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## ⚠️ Important Notes

1. **Data Migration**: If you have existing data in Supabase, you'll need to migrate it manually to Firestore
2. **OAuth Setup**: Make sure to configure OAuth consent screens and redirect URLs in Firebase Console
3. **Indexes**: Firestore composite indexes are required for queries with `where` and `orderBy` - Firebase will prompt you to create them
4. **Security Rules**: Always review and test your Firestore security rules before deploying to production
