"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, FileDown, Pencil } from "lucide-react";
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { EditDocumentDialog } from "@/components/edit-document-dialog";
import { PDFPreview } from "@/components/pdf-preview";
import type { DocumentType } from "@/lib/types";
import { useExport } from "@/hooks/use-export";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { exportToPDF, exportToTXT, isExporting } = useExport();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  const type = params?.type as string;
  const id = params?.id as string;

  // Get granular export states
  const isPdfExporting = isExporting(id, "PDF");
  const isTxtExporting = isExporting(id, "TXT");

  // Convert URL type parameter to internal document type
  const documentType: DocumentType =
    type === "resume"
      ? "resume"
      : type === "cover-letter"
      ? "coverLetter"
      : type === "linkedin"
      ? "linkedin"
      : "resume"; // Default to resume if unknown type

  useEffect(() => {
    fetchDocument();

    // Check URL for tab parameter
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get("tab");
    if (tabParam === "export") {
      setActiveTab("export");
    }
  }, [type, id]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      let response;

      // Validate MongoDB ID format
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidMongoId) {
        throw new Error(`Invalid document ID format: ${id}`);
      }

      if (type === "resume") {
        response = await resumeAPI.getResume(id);
      } else if (type === "cover-letter") {
        try {
          response = await coverLetterAPI.getCoverLetter(id);
        } catch (err: any) {
          throw new Error(
            `Failed to fetch cover letter: ${err?.message || "Unknown error"}`
          );
        }
      } else if (type === "linkedin") {
        response = await linkedinAPI.getLinkedInBio(id);
      } else {
        throw new Error(`Unknown document type: ${type}`);
      }

      // Extract the document data from the response
      let documentData = null;

      if (response?.data?.resume) {
        documentData = response.data.resume;
      } else if (response?.data?.coverLetter) {
        documentData = response.data.coverLetter;
      } else if (response?.data?.linkedinBio) {
        documentData = response.data.linkedinBio;
      } else if (response?.data) {
        documentData = response.data;

        if (
          type === "cover-letter" &&
          !documentData.resultText &&
          !documentData.coverLetter
        ) {
          documentData = { coverLetter: documentData };
        }
      }

      if (!documentData) {
        throw new Error("No document data found in response");
      }

      setDocument(documentData);
    } catch (error: any) {
      toast({
        title: "Error fetching document",
        description: `Could not load the document: ${
          error?.message || "Unknown error"
        }. Please try again.`,
        variant: "destructive",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpdated = () => {
    fetchDocument();
    setIsEditDialogOpen(false);
  };

  const getDocumentTypeName = () => {
    switch (type) {
      case "resume":
        return "Resume";
      case "cover-letter":
        return "Cover Letter";
      case "linkedin":
        return "LinkedIn Bio";
      default:
        return "Document";
    }
  };

  const getDocumentContent = () => {
    if (!document) return "";

    if (typeof document.content === "string") {
      return document.content.replace(/\n/g, "<br>");
    } else if (document.resultText) {
      return document.resultText.replace(/\n/g, "<br>");
    }

    if (type === "linkedin") {
      if (document.profile && document.content) {
        const { profile, experience, content } = document;
        let htmlContent = "";

        htmlContent += `<h1>${profile.firstName} ${profile.lastName}</h1>`;

        if (content.headline && typeof content.headline === "string") {
          htmlContent += `<h2>${content.headline}</h2>`;
        } else if (profile.headline) {
          htmlContent += `<h2>${profile.headline}</h2>`;
        } else if (profile.currentPosition) {
          htmlContent += `<h2>${profile.currentPosition}</h2>`;
        }

        if (profile.location && profile.industry) {
          htmlContent += `<p>${profile.location} | ${profile.industry}</p>`;
        }

        if (content.about && typeof content.about === "string") {
          htmlContent += `<h3>About</h3><p>${content.about.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        if (content.experience && typeof content.experience === "string") {
          htmlContent += `<h3>Experience</h3><p>${content.experience.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        } else if (experience && experience.professionalExperience) {
          htmlContent += `<h3>Experience</h3><p>${experience.professionalExperience.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        if (experience && experience.skills) {
          htmlContent += `<h3>Skills</h3><p>${experience.skills.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        return htmlContent;
      }

      if (document.profile) {
        const { profile, experience } = document;
        return `
          <h1>${profile.firstName} ${profile.lastName}</h1>
          <h2>${profile.headline || profile.currentPosition}</h2>
          <p>${profile.location} | ${profile.industry}</p>
          ${
            experience
              ? `
            <h3>Experience</h3>
            <p>${
              experience.professionalExperience?.replace(/\n/g, "<br>") || ""
            }</p>
            <h3>Skills</h3>
            <p>${experience.skills?.replace(/\n/g, "<br>") || ""}</p>
          `
              : ""
          }
        `;
      }

      if (document.content && typeof document.content === "object") {
        const contentObj = document.content;
        let htmlContent = '<div class="linkedin-content">';

        if (contentObj.headline) {
          htmlContent += `<h3>Headline</h3><p>${contentObj.headline}</p>`;
        }

        if (contentObj.about) {
          htmlContent += `<h3>About</h3><p>${contentObj.about.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        if (contentObj.experience) {
          htmlContent += `<h3>Experience</h3><p>${contentObj.experience.replace(
            /\n/g,
            "<br>"
          )}</p>`;
        }

        htmlContent += "</div>";
        return htmlContent;
      }
    }

    if (type === "cover-letter") {
      if (document.resultText) {
        return document.resultText.replace(/\n/g, "<br>");
      }

      if (document.coverLetter && document.coverLetter.resultText) {
        return document.coverLetter.resultText.replace(/\n/g, "<br>");
      }
    }

    try {
      return `<pre>${JSON.stringify(document, null, 2)}</pre>`;
    } catch (e) {
      return "No content available";
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading={loading ? "Loading..." : document?.title || "Document"}
        text={`View and export your ${getDocumentTypeName().toLowerCase()}`}
      >
        <div className="flex space-x-2 animate-fade-in [animation-delay:200ms]">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="transition-all duration-300 hover:bg-primary/10 hover:border-primary/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="transition-all duration-300 hover:bg-primary/10 hover:border-primary/30"
          >
            <Pencil className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            Edit
          </Button>
        </div>
      </DashboardHeader>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-8 w-[250px] animate-pulse" />
          <Skeleton className="h-[300px] w-full animate-pulse" />
        </div>
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <TabsList className="animate-fade-in">
                <TabsTrigger
                  value="preview"
                  className="transition-all duration-300 hover:bg-primary/10"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="transition-all duration-300 hover:bg-primary/10"
                >
                  Export
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview" className="space-y-4 animate-fade-in">
              <PDFPreview
                documentId={id}
                documentType={documentType}
                documentTitle={document?.title || getDocumentTypeName()}
                className="transition-all duration-300 hover:shadow-md"
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-4 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button
                      onClick={() =>
                        exportToPDF({
                          documentId: id,
                          documentType,
                          documentTitle: document?.title || "Document",
                        })
                      }
                      disabled={isPdfExporting}
                      className="flex h-24 flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Download className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span>
                        {isPdfExporting ? "Exporting PDF..." : "Export as PDF"}
                      </span>
                    </Button>
                    <Button
                      onClick={() =>
                        exportToTXT({
                          documentId: id,
                          documentType,
                          documentTitle: document?.title || "Document",
                        })
                      }
                      disabled={isTxtExporting}
                      variant="outline"
                      className="flex h-24 flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <FileDown className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span>
                        {isTxtExporting ? "Exporting TXT..." : "Export as TXT"}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {document && (
            <EditDocumentDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              documentType={documentType}
              document={document}
              onDocumentUpdated={handleDocumentUpdated}
            />
          )}
        </>
      )}
    </DashboardShell>
  );
}
