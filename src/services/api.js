import { auth } from "@/integrations/firebase/client";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? "https://ai-resume-builder-h11a.onrender.com" : "http://localhost:3000");

const getAuthHeaders = async () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
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

  // Update an existing resume
  update: async (id, content, context, title) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/resumes/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ content, context, title }),
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
    const response = await fetch(`${API_BASE_URL}/api/resumes`, {
      headers,
    });
    if (!response.ok) throw new Error("Failed to list resumes");
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
