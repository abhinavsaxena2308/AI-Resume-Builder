import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const DownloadResume = ({ resumeData, selectedTemplate }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { theme } = useTheme();

  const handleDownload = async () => {
    if (!resumeData || !selectedTemplate) {
      toast.error("Please fill in your resume data and select a template first.");
      return;
    }

    setIsDownloading(true);

    try {
      // Try multiple endpoints for PDF generation
      const urls = [
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-pdf`, // Production URL
        "http://localhost:3000/api/generate-pdf" // Local development URL
      ];

      let response;
      let success = false;

      for (const url of urls) {
        try {
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resumeData,
              template: selectedTemplate,
            }),
          });

          if (response.ok) {
            success = true;
            break;
          }
        } catch (error) {
          console.warn(`Failed to connect to ${url}, trying next...`);
        }
      }

      if (!success || !response) {
        throw new Error("Unable to connect to PDF generation service. Please ensure the backend server is running.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `PDF generation failed with status ${response.status}`);
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeData.personalInfo?.fullName || "Resume"}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Download Resume PDF
          </>
        )}
      </Button>
    </div>
  );
};

export default DownloadResume;