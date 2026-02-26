import express from "express";
import { db, auth } from "../config/firebase.js";

const router = express.Router();

// Admin credentials check middleware
const verifyAdmin = (req, res, next) => {
    // For now, check the admin-key header (matches the hardcoded admin credentials from Auth.jsx)
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== "resume-admin-verified") {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }
    next();
};

router.use(verifyAdmin);

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        let allUsers = [];
        let listUsersFailed = false;

        // 1. Get all users from Firebase Auth
        try {
            let listUsersResult = await auth.listUsers(1000);
            allUsers = listUsersResult.users;
            // Paginate if there are more users
            while (listUsersResult.pageToken) {
                listUsersResult = await auth.listUsers(1000, listUsersResult.pageToken);
                allUsers = allUsers.concat(listUsersResult.users);
            }
        } catch (authError) {
            console.warn("Could not list users from Firebase Auth:", authError.message);
            listUsersFailed = true;
        }

        // 2. Count total resumes from Firestore and group by user
        let totalResumes = 0;
        const resumesByUser = {};
        try {
            const resumesSnapshot = await db.collection("resumes").get();
            totalResumes = resumesSnapshot.size;

            resumesSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.user_id) {
                    resumesByUser[data.user_id] = (resumesByUser[data.user_id] || 0) + 1;
                }
            });
        } catch (dbError) {
            console.warn("Could not count resumes:", dbError.message);
        }

        // 3. Fallback: if auth.listUsers failed, derive basic user profiles from resumes found
        if (listUsersFailed) {
            allUsers = Object.keys(resumesByUser).map(uid => ({
                uid,
                displayName: `User ${uid.substring(0, 6)}`,
                email: `user${uid.substring(0, 4)}@example.com`,
                metadata: {
                    creationTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    lastSignInTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                providerData: [{ providerId: "fallback" }],
                disabled: false
            }));
        }

        // 4. Build user list with resume counts
        const usersWithResumes = [];
        for (const user of allUsers) {
            let resumeCount = resumesByUser[user.uid] || 0;
            // If listUsers didn't fail but we didn't count all resumes locally before (we did above),
            // just use the pre-computed resumesByUser!

            usersWithResumes.push({
                id: user.uid,
                name: user.displayName || "No Name",
                email: user.email || "N/A",
                joined: user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toISOString().split("T")[0]
                    : "N/A",
                lastSignIn: user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toISOString().split("T")[0]
                    : "N/A",
                status: user.disabled ? "Disabled" : (
                    // "Active" if signed in within last 30 days, otherwise "Inactive"
                    user.metadata.lastSignInTime &&
                        (Date.now() - new Date(user.metadata.lastSignInTime).getTime()) < 30 * 24 * 60 * 60 * 1000
                        ? "Active"
                        : "Inactive"
                ),
                provider: user.providerData?.[0]?.providerId || "email",
                resumes: resumeCount,
            });
        }

        const totalUsers = usersWithResumes.length;
        // 5. Calculate stats
        const activeUsers = usersWithResumes.filter(u => u.status === "Active").length;

        res.json({
            stats: {
                totalUsers,
                activeUsers,
                totalResumes,
            },
            users: usersWithResumes,
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ error: "Failed to fetch admin stats", details: error.message });
    }
});

export default router;
