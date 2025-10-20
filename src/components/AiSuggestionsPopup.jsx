import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Lightbulb, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useGeminiSuggestions from "@/hooks/useGeminiSuggestions";

const AiSuggestionsPopup = ({ isOpen, onClose, resumeData, onApplySuggestions }) => {
  const { toast } = useToast();
  const { loading, error, suggestions, fetchSuggestions } = useGeminiSuggestions();
  const [userType, setUserType] = useState("");

  const handleGetSuggestions = async () => {
    if (!userType) {
      toast({
        title: "Select User Type",
        description: "Please select your profession type first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetchSuggestions(userType, resumeData);
      toast({
        title: "Suggestions Generated!",
        description: "AI has provided personalized suggestions for your resume.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    }
  };

  const handleApplySection = (section) => {
    if (onApplySuggestions && suggestions) {
      onApplySuggestions(section, suggestions[section]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle>AI Role-Based Suggestions</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Role-specific suggestions for your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">I am a:</label>
            <div className="flex gap-2">
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="flex-1 bg-background text-foreground border-border">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coder">Coder</SelectItem>
                  <SelectItem value="Researcher">Researcher</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleGetSuggestions}
                disabled={loading || !userType}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Get Suggestions
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
              Error: {error}
            </div>
          )}

          {suggestions && (
            <div className="space-y-4">
              {/* Recommended Sections */}
              {suggestions.recommendedSections && suggestions.recommendedSections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommended Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.recommendedSections.map((section, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Suggestion */}
              {suggestions.summarySuggestion && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Suggested Summary</h4>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleApplySection("summarySuggestion")}
                    >
                      Apply
                    </Button>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-md text-sm">
                    {suggestions.summarySuggestion}
                  </div>
                </div>
              )}

              {/* Recommended Skills */}
              {suggestions.recommendedSkills && suggestions.recommendedSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Recommended Skills</h4>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleApplySection("recommendedSkills")}
                    >
                      Add All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.recommendedSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 border-blue-300 dark:border-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!suggestions && !loading && (
            <div className="text-center py-6 text-muted-foreground">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p>Select your profession and click "Get Suggestions" to receive role-specific recommendations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiSuggestionsPopup;