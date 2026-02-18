import { auth } from "../config/firebase.js";

const verifyToken = async (req, res, next) => {
  console.log("verifyToken called for:", req.method, req.path);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  // Allow bypass for testing if explicitly enabled
  if (process.env.TEST_MODE === "true" && idToken === "TEST_TOKEN") {
    req.user = { uid: "test-user-123", email: "test@example.com" };
    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
