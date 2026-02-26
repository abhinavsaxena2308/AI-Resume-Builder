import express from "express";
import { db } from "../config/firebase.js";
import verifyToken from "../middleware/auth.js";
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();

// Middleware to verify auth token for all routes
router.use(verifyToken);

// 1. Create a new resume with context (POST /api/resumes)
router.post("/", async (req, res) => {
  console.log("POST /api/resumes hit");
  const { title, content, context } = req.body;
  const userId = req.user.uid;

  if (!content) {
    return res.status(400).json({ error: "Missing resume content" });
  }

  try {
    const resumeId = db.collection("resumes").doc().id;
    const batch = db.batch();

    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeData = {
      id: resumeId,
      user_id: userId,
      title: title || "New Resume",
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      current_version_id: "",
    };

    const versionRef = resumeRef.collection("versions").doc();
    const versionId = versionRef.id;
    resumeData.current_version_id = versionId;

    const versionData = {
      id: versionId,
      resume_id: resumeId,
      content: content,
      context: context || {},
      created_at: Timestamp.now(),
    };

    batch.set(resumeRef, resumeData);
    batch.set(versionRef, versionData);
    await batch.commit();

    res.status(201).json({ message: "Resume created", resumeId });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: "Failed to create resume" });
  }
});

// 2. Update existing resume (PUT /api/resumes/:id) 
router.put("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const { content, context, title } = req.body;
  const userId = req.user.uid;

  if (!content && !title) {
    return res.status(400).json({ error: "Missing content or title" });
  }

  try {
    await db.runTransaction(async (transaction) => {
      const resumeRef = db.collection("resumes").doc(resumeId);
      const resumeDoc = await transaction.get(resumeRef);

      if (!resumeDoc.exists) throw new Error("Resume not found");
      if (resumeDoc.data().user_id !== userId) throw new Error("Unauthorized");

      const updateData = { updated_at: Timestamp.now() };
      if (title) updateData.title = title;

      if (content) {
        const versionRef = resumeRef.collection("versions").doc();
        const versionId = versionRef.id;
        const versionData = {
          id: versionId,
          resume_id: resumeId,
          content: content,
          context: context || {},
          created_at: Timestamp.now(),
        };
        updateData.current_version_id = versionId;
        transaction.set(versionRef, versionData);
      }

      transaction.update(resumeRef, updateData);
    });

    res.json({ message: "Resume updated" });
  } catch (error) {
    console.error("Error updating resume:", error);
    if (error.message === "Unauthorized") return res.status(403).json({ error: "Unauthorized" });
    if (error.message === "Resume not found") return res.status(404).json({ error: "Resume not found" });
    res.status(500).json({ error: "Failed to update" });
  }
});

// 3. Get Resume Details (GET /api/resumes/:id)
router.get("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;

  try {
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) return res.status(404).json({ error: "Not found" });
    if (resumeDoc.data().user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const resumeData = resumeDoc.data();
    let content = {};
    let context = {};

    if (resumeData.current_version_id) {
      const vDoc = await resumeRef.collection("versions").doc(resumeData.current_version_id).get();
      if (vDoc.exists) {
        content = vDoc.data().content;
        context = vDoc.data().context;
      }
    }

    res.json({ ...resumeData, content, context });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// 4. List User Resumes (GET /api/resumes)
router.get("/", async (req, res) => {
  const userId = req.user.uid;
  try {
    let snapshot;
    try {
      // This compound query requires a Firestore composite index
      snapshot = await db.collection("resumes")
        .where("user_id", "==", userId)
        .orderBy("updated_at", "desc")
        .get();
    } catch (indexError) {
      // Fallback: if composite index is missing, query without orderBy and sort in-memory
      console.warn("Compound query failed (likely missing index), falling back to simple query:", indexError.message);
      snapshot = await db.collection("resumes")
        .where("user_id", "==", userId)
        .get();
    }

    const resumes = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate(),
    }));

    // Sort in-memory as fallback (ensures correct order even without index)
    resumes.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));

    res.json(resumes);
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ error: "Failed to list", details: error.message });
  }
});

// 5. Delete Resume (DELETE /api/resumes/:id)
router.delete("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;
  try {
    await db.runTransaction(async (transaction) => {
      const resumeRef = db.collection("resumes").doc(resumeId);
      const doc = await transaction.get(resumeRef);
      if (!doc.exists) throw new Error("Not found");
      if (doc.data().user_id !== userId) throw new Error("Unauthorized");
      transaction.delete(resumeRef);
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// 6. Get Resume Versions (GET /api/resumes/:id/versions)
router.get("/:id/versions", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;
  try {
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();
    if (!resumeDoc.exists) return res.status(404).json({ error: "Not found" });
    if (resumeDoc.data().user_id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const versionsSnapshot = await resumeRef.collection("versions")
      .orderBy("created_at", "desc")
      .limit(20)
      .get();

    const versions = versionsSnapshot.docs.map(doc => ({
      id: doc.id,
      created_at: doc.data().created_at?.toDate(),
      context: doc.data().context
    }));
    res.json({ versions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

export default router;
