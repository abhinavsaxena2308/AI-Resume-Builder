import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and contemporary design",
      color: "blue",
      preview: "Modern template with blue accents and structured layout",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional and professional",
      color: "gray",
      preview: "Classic template with formal styling and gray tones",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Vibrant and eye-catching",
      color: "purple",
      preview: "Creative template with colorful gradients and modern flair",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="h-5 w-5 text-purple-600" />
        <span className="font-medium text-gray-700 dark:text-gray-300">Choose Template</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplate === template.id
                  ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => onSelect(template.id)}
            >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Template Name */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg capitalize">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <Badge variant="default" className="bg-purple-600">
                      Selected
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>

                {/* Color Indicator */}
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${
                  template.color === "blue"
                    ? "from-blue-400 to-blue-600"
                    : template.color === "gray"
                    ? "from-gray-400 to-gray-600"
                    : "from-purple-400 to-pink-400"
                }`} />

                {/* Mini Preview Text */}
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {template.preview}
                </div>

                {/* Select Button */}
                <Button
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {selectedTemplate === template.id ? "Current" : "Preview"}
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
