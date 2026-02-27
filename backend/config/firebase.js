import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import MockFirestore from "./mockFirestore.js"; // Assume we will create this

dotenv.config();

let serviceAccount;

try {
  // Option 1: Load from a file path specified in environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  }
  // Option 2: Load from environment variable containing the JSON string directly
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

    // Fix for dotenv escaping newlines in JSON strings:
    // If the private key contains literal '\n' strings instead of actual newlines, fix it
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  }
} catch (error) {
  console.warn("Could not load Firebase service account credentials. Falling back to application default credentials.", error.message);
}

console.log("Service account loaded:", serviceAccount ? `Project: ${serviceAccount.project_id}, Email: ${serviceAccount.client_email}, KeyValid: ${!!serviceAccount.private_key}` : "Using application default credentials");

let dbInstance;

try {
  if (process.env.TEST_MODE === "true") {
    console.log("Using Mock Firestore for Testing...");
    dbInstance = new MockFirestore();
  } else {
    const options = {
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    };

    if (!admin.apps.length) {
      admin.initializeApp(options);
      console.log("Firebase Admin initialized successfully");
    }
    dbInstance = admin.firestore();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  // Fallback to mock if real init fails, to keep server running (though operations will fail or be mocked)
  console.warn("Falling back to Mock Firestore due to initialization failure.");
  dbInstance = new MockFirestore();
}

export const db = dbInstance;

// Export the real Firebase Auth instance (no mock fallback)
export const auth = admin.auth();
export default admin;
