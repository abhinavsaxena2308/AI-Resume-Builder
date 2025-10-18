import TemplateModern from "@/components/ResumeTemplates/TemplateModern";
import TemplateClassic from "@/components/ResumeTemplates/TemplateClassic";
import TemplateCreative from "@/components/ResumeTemplates/TemplateCreative";

const ResumePreview = ({ data, template = "modern" }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const templates = {
    modern: TemplateModern,
    classic: TemplateClassic,
    creative: TemplateCreative,
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
