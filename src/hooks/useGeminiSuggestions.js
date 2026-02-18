import { useState } from "react";
import { API_BASE_URL } from "@/services/api";

const useGeminiSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  const fetchSuggestions = async (userType, resumeData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!userType) {
        throw new Error("User type is required");
      }
      
      if (!resumeData) {
        throw new Error("Resume data is required");
      }
      
      // Build the full URL for the API endpoint
      const url = `${API_BASE_URL}/api/gemini-suggestions`;
      
      console.log("Attempting to fetch suggestions from:", url);
      console.log("Environment:", isProduction ? "Production" : "Development");
      console.log("User type:", userType);
      console.log("Resume data:", JSON.stringify(resumeData, null, 2));

      // Make the request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType, resumeData }),
      });

      console.log(`Response from ${url}:`, response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from ${url}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received suggestions:", data);
      
      setSuggestions(data);
      return data;
    } catch (err) {
      console.error("Error in fetchSuggestions:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    suggestions,
    fetchSuggestions,
  };
};

export default useGeminiSuggestions;