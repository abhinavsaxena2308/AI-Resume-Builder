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

  if (!content || !title) {
    return res.status(400).json({ error: "Missing required fields: title, content" });
  }

  try {
    console.time("create-resume-db-op");
    
    // Use a WriteBatch for atomic creation (faster than transaction for new docs)
    const batch = db.batch();
    
    // 1. Create Resume Document Reference
    const resumeRef = db.collection("resumes").doc();
    const resumeId = resumeRef.id;

    // 2. Create Initial Version Document Reference
    const versionRef = resumeRef.collection("versions").doc();
    const versionId = versionRef.id;

    // 3. Prepare Resume Metadata
    const resumeData = {
      id: resumeId,
      user_id: userId,
      title: title,
      current_version_id: versionId,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    // 4. Prepare Version Data (Content + Context Snapshot)
    const versionData = {
      id: versionId,
      resume_id: resumeId,
      content: content, // Structured resume sections
      context: context || {}, // Context metadata (template, industry, etc.)
      created_at: Timestamp.now(),
    };

    // 5. Create Audit Log
    const logRef = db.collection("audit_logs").doc();
    batch.set(logRef, {
      action: "CREATE_RESUME",
      resume_id: resumeId,
      user_id: userId,
      timestamp: Timestamp.now(),
      details: { title }
    });

    // 6. Queue Writes
    batch.set(resumeRef, resumeData);
    batch.set(versionRef, versionData);

    // 7. Commit Batch
    await batch.commit();
    
    console.timeEnd("create-resume-db-op");

    res.status(201).json({ 
      message: "Resume created successfully", 
      resumeId: resumeId 
    });

  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: "Failed to create resume" });
  }
});

// 2. Update existing resume (PUT /api/resumes/:id) - Creates new version
router.put("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const { content, context, title } = req.body;
  const userId = req.user.uid;

  if (!content) {
    return res.status(400).json({ error: "Missing resume content" });
  }

  try {
    await db.runTransaction(async (transaction) => {
      // 1. Get Resume Doc to verify ownership
      const resumeRef = db.collection("resumes").doc(resumeId);
      const resumeDoc = await transaction.get(resumeRef);

      if (!resumeDoc.exists) {
        throw new Error("Resume not found");
      }

      if (resumeDoc.data().user_id !== userId) {
        throw new Error("Unauthorized access");
      }

      // 2. Create New Version
      const versionRef = resumeRef.collection("versions").doc();
      const versionId = versionRef.id;

      const versionData = {
        id: versionId,
        resume_id: resumeId,
        content: content,
        context: context || {}, // Store updated context if provided
        created_at: Timestamp.now(),
      };

      // 3. Update Resume Metadata
      const updateData = {
        updated_at: Timestamp.now(),
        current_version_id: versionId,
      };
      
      if (title) updateData.title = title;

      // 4. Create Audit Log
      const logRef = db.collection("audit_logs").doc();
      transaction.set(logRef, {
        action: "UPDATE_RESUME",
        resume_id: resumeId,
        user_id: userId,
        timestamp: Timestamp.now(),
        details: { 
          updated_sections: content ? Object.keys(content) : [],
          context_updated: !!context
        }
      });

      // 5. Execute Writes
      transaction.set(versionRef, versionData);
      transaction.update(resumeRef, updateData);
    });

    res.json({ message: "Resume updated successfully (new version created)" });

  } catch (error) {
    console.error("Error updating resume:", error);
    if (error.message === "Unauthorized access") {
      res.status(403).json({ error: "Unauthorized" });
    } else if (error.message === "Resume not found") {
      res.status(404).json({ error: "Resume not found" });
    } else {
      res.status(500).json({ error: "Failed to update resume" });
    }
  }
});

// 3. Get Resume Context (GET /api/resumes/:id/context)
// Defaults to the latest version's context
router.get("/:id/context", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;

  try {
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resumeDoc.data().user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const currentVersionId = resumeDoc.data().current_version_id;
    if (!currentVersionId) {
      return res.status(404).json({ error: "No version history found" });
    }

    const versionDoc = await resumeRef.collection("versions").doc(currentVersionId).get();
    
    if (!versionDoc.exists) {
      return res.status(404).json({ error: "Version data missing" });
    }

    res.json({ context: versionDoc.data().context });

  } catch (error) {
    console.error("Error fetching context:", error);
    res.status(500).json({ error: "Failed to fetch context" });
  }
});

// 4. Get Resume Versions (GET /api/resumes/:id/versions)
router.get("/:id/versions", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;

  try {
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resumeDoc.data().user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const versionsSnapshot = await resumeRef.collection("versions")
      .orderBy("created_at", "desc")
      .limit(20) // Limit to last 20 versions
      .get();

    const versions = versionsSnapshot.docs.map(doc => ({
      id: doc.id,
      created_at: doc.data().created_at.toDate(),
      context: doc.data().context
    }));

    res.json({ versions });

  } catch (error) {
    console.error("Error fetching versions:", error);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

// 5. List User Resumes (GET /api/resumes/user/:userId)
// Only allows users to list their own resumes
router.get("/user/:userId", async (req, res) => {
  const requestedUserId = req.params.userId;
  const authUserId = req.user.uid;

  if (requestedUserId !== authUserId) {
    return res.status(403).json({ error: "Unauthorized: Can only list your own resumes" });
  }

  try {
    const resumesSnapshot = await db.collection("resumes")
      .where("user_id", "==", authUserId)
      .orderBy("updated_at", "desc")
      .get();

    const resumes = resumesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
      updated_at: doc.data().updated_at.toDate()
    }));

    res.json(resumes);

  } catch (error) {
    console.error("Error listing resumes:", error);
    res.status(500).json({ error: "Failed to list resumes" });
  }
});

// 5. Get Resume Details (GET /api/resumes/:id)
// Fetches the resume metadata and the CURRENT version content
router.get("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;

  try {
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();

    if (!resumeDoc.exists) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resumeDoc.data().user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const resumeData = resumeDoc.data();
    const currentVersionId = resumeData.current_version_id;

    let content = {};
    let context = {};

    if (currentVersionId) {
      const versionDoc = await resumeRef.collection("versions").doc(currentVersionId).get();
      if (versionDoc.exists) {
        content = versionDoc.data().content;
        context = versionDoc.data().context;
      }
    }

    res.json({
      ...resumeData,
      content,
      context,
      created_at: resumeData.created_at.toDate(),
      updated_at: resumeData.updated_at.toDate()
    });

  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

// 5. List User Resumes (GET /api/resumes)
// Lists all resumes for the authenticated user
router.get("/", async (req, res) => {
  const userId = req.user.uid;

  try {
    const resumesSnapshot = await db.collection("resumes")
      .where("user_id", "==", userId)
      .orderBy("updated_at", "desc")
      .get();

    const resumes = resumesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
      updated_at: doc.data().updated_at.toDate()
    }));

    res.json(resumes);

  } catch (error) {
    console.error("Error listing resumes:", error);
    res.status(500).json({ error: "Failed to list resumes" });
  }
});

// 6. Delete Resume (DELETE /api/resumes/:id)
router.delete("/:id", async (req, res) => {
  const resumeId = req.params.id;
  const userId = req.user.uid;

  try {
    await db.runTransaction(async (transaction) => {
      const resumeRef = db.collection("resumes").doc(resumeId);
      const resumeDoc = await transaction.get(resumeRef);

      if (!resumeDoc.exists) {
        throw new Error("Resume not found");
      }

      if (resumeDoc.data().user_id !== userId) {
        throw new Error("Unauthorized access");
      }

      // Create Audit Log
      const logRef = db.collection("audit_logs").doc();
      transaction.set(logRef, {
        action: "DELETE_RESUME",
        resume_id: resumeId,
        user_id: userId,
        timestamp: Timestamp.now()
      });

      // Delete resume document (subcollections are NOT automatically deleted in Firestore!)
      // Note: In production, use a recursive delete or cloud function
      transaction.delete(resumeRef);
    });

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    console.error("Error deleting resume:", error);
    if (error.message === "Unauthorized access") {
      res.status(403).json({ error: "Unauthorized" });
    } else if (error.message === "Resume not found") {
      res.status(404).json({ error: "Resume not found" });
    } else {
      res.status(500).json({ error: "Failed to delete resume" });
    }
  }
});

export default router;
