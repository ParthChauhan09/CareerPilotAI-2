"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ResumeForm } from "@/components/forms/resume-form";
import { CoverLetterForm } from "@/components/forms/cover-letter-form";
import { LinkedInForm } from "@/components/forms/linkedin-form";
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type {
  DocumentType,
  ResumeFormData,
  CoverLetterFormData,
  LinkedInBioFormData,
} from "@/lib/types";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType;
  onDocumentCreated: () => void;
}

export function CreateDocumentDialog({
  open,
  onOpenChange,
  documentType,
  onDocumentCreated,
}: CreateDocumentDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form states
  const [resumeData, setResumeData] = useState<ResumeFormData>({
    title: "",
    promptData: {
      jobTitle: "",
      skills: [],
      experience: "",
      education: "",
      additionalInfo: "",
    },
  });

  const [coverLetterData, setCoverLetterData] = useState<CoverLetterFormData>({
    title: "",
    promptData: {
      jobTitle: "",
      companyName: "",
      skills: [],
      experience: "",
      jobDescription: "",
      additionalInfo: "",
    },
  });

  const [linkedinData, setLinkedinData] = useState<LinkedInBioFormData>({
    title: "",
    profile: {
      firstName: "",
      lastName: "",
      headline: "",
      location: "",
      industry: "",
      currentPosition: "",
    },
    experience: {
      skills: "",
      professionalExperience: "",
      education: "",
      certifications: "",
    },
    preferences: {
      tone: "professional", // Set default tone to professional
      targetRole: "",
      focusPoints: "",
      keywords: "",
    },
  });

  const getTitle = () => {
    switch (documentType) {
      case "resume":
        return "Create New Resume";
      case "coverLetter":
        return "Create New Cover Letter";
      case "linkedin":
        return "Create New LinkedIn Bio";
      default:
        return "Create New Document";
    }
  };

  const getDescription = () => {
    switch (documentType) {
      case "resume":
        return "Fill in the details below to generate a professional resume tailored to your experience and skills.";
      case "coverLetter":
        return "Provide information about the job and your qualifications to create a personalized cover letter.";
      case "linkedin":
        return "Enter your professional details to create an engaging LinkedIn bio that highlights your expertise.";
      default:
        return "Fill in the details to create your document.";
    }
  };

  const validateForm = () => {
    if (documentType === "resume") {
      if (
        !resumeData.title ||
        !resumeData.promptData.jobTitle ||
        !resumeData.promptData.experience ||
        !resumeData.promptData.education
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields for the resume",
          variant: "destructive",
        });
        return false;
      }
    } else if (documentType === "coverLetter") {
      if (
        !coverLetterData.title ||
        !coverLetterData.promptData.jobTitle ||
        !coverLetterData.promptData.companyName ||
        !coverLetterData.promptData.experience
      ) {
        toast({
          title: "Missing information",
          description:
            "Please fill in all required fields for the cover letter",
          variant: "destructive",
        });
        return false;
      }
    } else if (documentType === "linkedin") {
      if (
        !linkedinData.title ||
        !linkedinData.profile.firstName ||
        !linkedinData.profile.lastName ||
        !linkedinData.profile.location ||
        !linkedinData.profile.industry ||
        !linkedinData.profile.currentPosition ||
        !linkedinData.experience.professionalExperience ||
        !linkedinData.experience.education ||
        !linkedinData.preferences.targetRole ||
        !linkedinData.preferences.tone
      ) {
        toast({
          title: "Missing information",
          description:
            "Please fill in all required fields for the LinkedIn bio. Make sure to select a tone.",
          variant: "destructive",
        });
        return false;
      }

      // Validate that tone is one of the allowed values
      if (
        !["professional", "friendly", "creative"].includes(
          linkedinData.preferences.tone
        )
      ) {
        toast({
          title: "Invalid tone",
          description:
            "Please select a valid tone: professional, friendly, or creative",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;

      if (documentType === "resume") {
        response = await resumeAPI.generateResume(resumeData);
      } else if (documentType === "coverLetter") {
        response = await coverLetterAPI.generateCoverLetter(coverLetterData);
      } else if (documentType === "linkedin") {
        response = await linkedinAPI.generateLinkedInBio({
          title: linkedinData.title,
          profile: {
            firstName: linkedinData.profile.firstName,
            lastName: linkedinData.profile.lastName,
            headline: linkedinData.profile.headline,
            location: linkedinData.profile.location,
            industry: linkedinData.profile.industry,
            currentPosition: linkedinData.profile.currentPosition,
          },
          experience: {
            skills: linkedinData.experience.skills,
            professionalExperience:
              linkedinData.experience.professionalExperience,
            education: linkedinData.experience.education,
            certifications: linkedinData.experience.certifications,
          },
          preferences: {
            tone: linkedinData.preferences.tone,
            targetRole: linkedinData.preferences.targetRole,
            focusPoints: linkedinData.preferences.focusPoints,
            keywords: linkedinData.preferences.keywords,
          },
        });
      }

      // Reset form data
      setResumeData({
        title: "",
        promptData: {
          jobTitle: "",
          skills: [],
          experience: "",
          education: "",
          additionalInfo: "",
        },
      });

      setCoverLetterData({
        title: "",
        promptData: {
          jobTitle: "",
          companyName: "",
          skills: [],
          experience: "",
          jobDescription: "",
          additionalInfo: "",
        },
      });

      setLinkedinData({
        title: "",
        profile: {
          firstName: "",
          lastName: "",
          headline: "",
          location: "",
          industry: "",
          currentPosition: "",
        },
        experience: {
          skills: "",
          professionalExperience: "",
          education: "",
          certifications: "",
        },
        preferences: {
          tone: "professional", // Keep the default tone
          targetRole: "",
          focusPoints: "",
          keywords: "",
        },
      });

      onDocumentCreated();
    } catch (error: any) {
      // Extract error message from response if available
      const errorMessage =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.error ||
        "There was an error creating your document. Please try again.";

      toast({
        title: "Error creating document",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (documentType) {
      case "resume":
        return <ResumeForm data={resumeData} onChange={setResumeData} />;
      case "coverLetter":
        return (
          <CoverLetterForm
            data={coverLetterData}
            onChange={setCoverLetterData}
          />
        );
      case "linkedin":
        return <LinkedInForm data={linkedinData} onChange={setLinkedinData} />;
      default:
        return <div>Form not available</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0 sm:p-6 gap-0 sm:gap-4">
        <DialogHeader className="px-4 py-4 sm:px-0 sm:py-0 border-b sm:border-0">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2 sm:px-0">
          <div className="space-y-4 pb-4">
            {renderForm()}
          </div>
        </div>

        <DialogFooter className="px-4 py-4 sm:px-0 sm:py-0 border-t sm:border-0 bg-background sm:bg-transparent mt-auto">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
