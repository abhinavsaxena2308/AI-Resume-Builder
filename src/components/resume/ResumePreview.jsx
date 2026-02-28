import TemplateModern from "@/components/ResumeTemplates/TemplateModern";
import TemplateClassic from "@/components/ResumeTemplates/TemplateClassic";
import TemplateAts from "@/components/ResumeTemplates/TemplateAts";
import { useTheme } from "@/contexts/ThemeContext";

const ResumePreview = ({ data, template = "modern" }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const { theme } = useTheme();

  const templates = {
    modern: TemplateModern,
    classic: TemplateClassic,
    ats: TemplateAts,
  };

  const SelectedTemplate = templates[template] || TemplateModern;

  return (
    <SelectedTemplate
      personalInfo={personalInfo}
      summary={summary}
      experience={experience}
      education={education}
      skills={skills}
    />
  );
};

export default ResumePreview;