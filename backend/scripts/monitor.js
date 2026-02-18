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

async function monitorStats() {
  const resumes = await db.collection("resumes").count().get();
  const users = await db.collection("users").count().get();
  const logs = await db.collection("audit_logs").count().get();

  console.log("System Statistics:");
  console.log(`- Total Active Resumes: ${resumes.data().count}`);
  console.log(`- Total Registered Users: ${users.data().count}`);
  console.log(`- Total Audit Logs: ${logs.data().count}`);

  // Check for suspicious activity (e.g., high volume of deletes)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentDeletes = await db.collection("audit_logs")
    .where("action", "==", "DELETE_RESUME")
    .where("timestamp", ">", admin.firestore.Timestamp.fromDate(oneHourAgo))
    .count()
    .get();

  console.log(`- Recent Deletes (last hour): ${recentDeletes.data().count}`);

  if (recentDeletes.data().count > 10) {
    console.warn("WARNING: High volume of deletions detected!");
  }
}

monitorStats().catch(console.error);
