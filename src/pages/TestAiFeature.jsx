import { useState } from "react";
import EnhancedResumeForm from "@/components/EnhancedResumeForm";
import AiSuggestionsPopup from "@/components/AiSuggestionsPopup";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const TestAiFeature = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      location: "New York, NY",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    summary: "",
    experience: [],
    education: [],
    skills: ["JavaScript", "React", "Node.js"],
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isSuggestionsPopupOpen, setIsSuggestionsPopupOpen] = useState(false);

  const handleApplySuggestions = (section, content) => {
    console.log("Applying suggestion:", section, content);
    // In a real implementation, you would apply the suggestions to the resume data
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI Feature Test</h1>
      
      <div className="mb-6">
        <Button
          onClick={() => setIsSuggestionsPopupOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Get Suggestions
        </Button>
      </div>
      
      {/* AI Suggestions Popup */}
      <AiSuggestionsPopup
        isOpen={isSuggestionsPopupOpen}
        onClose={() => setIsSuggestionsPopupOpen(false)}
        resumeData={resumeData}
        onApplySuggestions={handleApplySuggestions}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EnhancedResumeForm 
            data={resumeData} 
            onChange={setResumeData} 
            aiSuggestions={aiSuggestions}
          />
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <div className="mb-4">
            <h3 className="font-medium">Resume Data:</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-medium">AI Suggestions:</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {aiSuggestions ? JSON.stringify(aiSuggestions, null, 2) : "No suggestions yet"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAiFeature;