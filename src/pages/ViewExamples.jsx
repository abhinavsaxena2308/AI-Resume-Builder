import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ViewExamples = () => {
  const navigate = useNavigate();

  // Sample resume data for examples
  const exampleResumes = [
    {
      personalInfo: {
        fullName: "John Doe",
        email: "john.doe@email.com",
        phone: "(555) 123-4567",
        location: "New York, NY",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
      },
      summary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
      experience: [
        {
          id: 1,
          title: "Senior Software Engineer",
          company: "Tech Corp",
          duration: "2020 - Present",
          description: "Led development of scalable web applications, mentored junior developers, and implemented CI/CD pipelines.",
        },
        {
          id: 2,
          title: "Software Engineer",
          company: "Startup Inc",
          duration: "2018 - 2020",
          description: "Developed and maintained multiple client-facing applications using React and Node.js.",
        },
      ],
      education: [
        {
          id: 1,
          degree: "Bachelor of Science in Computer Science",
          institution: "University of Technology",
          year: "2018",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
    },
    {
      personalInfo: {
        fullName: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "(555) 987-6543",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/janesmith",
        github: "github.com/janesmith",
      },
      summary: "Creative UX/UI designer with a passion for user-centered design and modern web technologies.",
      experience: [
        {
          id: 1,
          title: "Senior UX Designer",
          company: "Design Studio",
          duration: "2019 - Present",
          description: "Created user-centered designs for web and mobile applications, conducted user research, and collaborated with development teams.",
        },
        {
          id: 2,
          title: "UX Designer",
          company: "Creative Agency",
          duration: "2017 - 2019",
          description: "Designed interfaces for various client projects, created wireframes and prototypes, and performed usability testing.",
        },
      ],
      education: [
        {
          id: 1,
          degree: "Master of Fine Arts in Design",
          institution: "Art Institute",
          year: "2017",
        },
      ],
      skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping", "HTML/CSS"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Resume Examples
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Get inspired by these professionally crafted resume examples
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-8 py-3 text-lg"
          >
            Create Your Own Resume
          </Button>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {exampleResumes.map((resume, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Example {index + 1}: {resume.personalInfo.fullName}
                </h2>
                <Button
                  onClick={() => navigate("/auth")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Use Template
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <ResumePreview data={resume} />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Build Your Resume?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Use our AI-powered builder to create a professional resume in minutes
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-8 py-3 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewExamples;
