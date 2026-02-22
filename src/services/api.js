import { auth, getCurrentUser } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? "https://ai-resume-builder-h11a.onrender.com" : "http://localhost:3000");

// Wait for auth to be ready and get the current user
const waitForAuth = () => {
  return new Promise((resolve) => {
    // If already have a user, resolve immediately
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    // Otherwise wait for auth state to be determined
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

const getAuthHeaders = async () => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Wait for auth to be ready
  const user = await waitForAuth();

  if (user) {
    try {
      // Force refresh token to ensure it's valid
      const token = await user.getIdToken(true);
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Auth token obtained successfully");
    } catch (error) {
      console.error("Failed to get auth token:", error);
    }
  } else {
    console.warn("No authenticated user found");
  }

  return headers;
};

export const resumeApi = {
  // Create a new resume
  create: async (title, content, context) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/resumes`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, content, context }),
    });
    if (!response.ok) throw new Error("Failed to create resume");
    return response.json();
  },

  update: async (id, content, context, title) => {
    const headers = await getAuthHeaders();

    // Build update object only with present fields
    const body = {};
    if (content !== null && content !== undefined) body.content = content;
    if (context !== null && context !== undefined) body.context = context;
    if (title !== null && title !== undefined) body.title = title;

    const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Failed to update resume");
    return response.json();
  },

  // Get a single resume by ID
  getById: async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
      headers,
    });
    if (!response.ok) throw new Error("Failed to fetch resume");
    return response.json();
  },

  // Get resume versions (history)
  getVersions: async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/resumes/${id}/versions`, {
      headers,
    });
    if (!response.ok) throw new Error("Failed to fetch versions");
    return response.json();
  },

  // List user resumes
  listByUser: async () => {
    const headers = await getAuthHeaders();

    // Check if we have auth token
    if (!headers["Authorization"]) {
      console.error("No auth token available - user may not be logged in");
      throw new Error("Not authenticated. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/api/resumes`, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);

      if (response.status === 403) {
        throw new Error("Authentication failed. Please log in again.");
      }
      throw new Error(`Failed to list resumes: ${response.status}`);
    }
    return response.json();
  },

  // Delete a resume
  delete: async (id) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete resume");
    return response.json();
  },
};
