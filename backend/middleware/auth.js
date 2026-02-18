import { auth } from "../config/firebase.js";

const verifyToken = async (req, res, next) => {
  console.log("verifyToken called for:", req.method, req.path);
  console.log("Full Headers:", JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers.authorization;
  console.log("Authorization header received:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No valid authorization header found");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  console.log("Token received (first 50 chars):", idToken ? idToken.substring(0, 50) + "..." : "Missing");
  console.log("Token length:", idToken ? idToken.length : 0);

  // Allow bypass for testing if explicitly enabled
  if (process.env.TEST_MODE === "true" && idToken === "TEST_TOKEN") {
    console.log("Using test token bypass");
    req.user = { uid: "test-user-123", email: "test@example.com" };
    return next();
  }

  try {
    console.log("Attempting to verify Firebase token...");
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log("Token verified successfully!");
    console.log("Decoded token UID:", decodedToken.uid);
    console.log("Decoded token email:", decodedToken.email);
    console.log("Decoded token project_id:", decodedToken.firebase?.project_id || decodedToken.aud);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return res.status(403).json({ 
      error: "Unauthorized: Invalid token",
      details: error.message,
      code: error.code
    });
  }
};

export default verifyToken;
