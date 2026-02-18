import admin from "firebase-admin";
import { db } from "../config/firebase.js";

async function verifyConnection() {
  try {
    console.log("🔍 Checking Firebase connection...");
    
    if (process.env.TEST_MODE === "true") {
      console.warn("⚠️  Running in TEST_MODE (Mock Database). Please restart without TEST_MODE to verify real connection.");
    } else {
      console.log("ℹ️  Using environment configuration.");
    }

    // Try to list collections (requires admin privileges)
    const collections = await db.listCollections();
    console.log(`✅ Connection Successful! Found ${collections.length} collections.`);
    collections.forEach(col => console.log(`   - ${col.id}`));

    // Try a write operation
    const testDocRef = db.collection("_system_check").doc("connectivity_test");
    await testDocRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "online",
      checked_at: new Date().toISOString()
    });
    console.log("✅ Write operation successful.");

    // Try a read operation
    const docSnap = await testDocRef.get();
    if (docSnap.exists) {
      console.log("✅ Read operation successful.");
    } else {
      throw new Error("Read failed: Document not found after write.");
    }

    // Clean up
    await testDocRef.delete();
    console.log("✅ Cleanup successful.");
    console.log("\n🎉 INTEGRATION VERIFIED: Backend is correctly connected to Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED:", error.message);
    if (error.code === 'app/no-app') {
      console.error("   Hint: Firebase App not initialized. Check serviceAccountKey.json path and .env configuration.");
    }
    if (error.code === 7 || error.message.includes("credential")) {
      console.error("   Hint: Invalid credentials. Check serviceAccountKey.json content.");
    }
    process.exit(1);
  }
}

verifyConnection();
