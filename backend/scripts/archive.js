import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../serviceAccountKey.json"), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const ARCHIVE_THRESHOLD_DAYS = 365; 

async function archiveOldResumes() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - ARCHIVE_THRESHOLD_DAYS);
  const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

  console.log(`Searching for resumes updated before ${cutoffDate.toISOString()}...`);

  const snapshot = await db.collection("resumes")
    .where("updated_at", "<", cutoffTimestamp)
    .get();

  if (snapshot.empty) {
    console.log("No resumes to archive.");
    return;
  }

  console.log(`Found ${snapshot.size} resumes to archive.`);

  const batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const resumeData = doc.data();
    const archiveRef = db.collection("archived_resumes").doc(doc.id);
    
    // Copy to archive
    batch.set(archiveRef, {
      ...resumeData,
      archived_at: admin.firestore.Timestamp.now(),
      original_updated_at: resumeData.updated_at
    });
    
    // Delete from active
    batch.delete(doc.ref);
    
    // Log audit
    const logRef = db.collection("audit_logs").doc();
    batch.set(logRef, {
      action: "ARCHIVE_RESUME",
      resume_id: doc.id,
      user_id: resumeData.user_id,
      timestamp: admin.firestore.Timestamp.now()
    });

    count++;
    if (count >= 400) { // Batch limit is 500
      await batch.commit();
      console.log(`Archived batch of ${count} resumes.`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Archived remaining ${count} resumes.`);
  }

  console.log("Archive process completed.");
}

archiveOldResumes().catch(console.error);
