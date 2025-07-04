"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Download, FileDown, Pencil } from "lucide-react"
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { EditDocumentDialog } from "@/components/edit-document-dialog"
import type { DocumentType } from "@/lib/types"
import { downloadPdf, downloadDocx, downloadTxt } from "@/lib/download-utils"

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  const type = params.type as string
  const id = params.id as string

  // Convert URL type parameter to internal document type
  const documentType: DocumentType =
    type === "resume" ? "resume" :
    type === "cover-letter" ? "coverLetter" :
    type === "linkedin" ? "linkedin" :
    "resume" // Default to resume if unknown type

  console.log("URL type parameter:", type)
  console.log("Converted to document type:", documentType)

  useEffect(() => {
    fetchDocument()

    // Check URL for tab parameter
    const url = new URL(window.location.href)
    const tabParam = url.searchParams.get('tab')
    if (tabParam === 'export') {
      setActiveTab('export')
    }
  }, [type, id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      let response

      console.log(`Fetching document with type: ${type}, id: ${id}`)

      // Validate MongoDB ID format
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id)
      if (!isValidMongoId) {
        console.error("Invalid MongoDB ID format:", id)
        throw new Error(`Invalid document ID format: ${id}`)
      }

      if (type === "resume") {
        response = await resumeAPI.getResume(id)
        console.log("Resume response:", response)
      } else if (type === "cover-letter") {
        console.log("Fetching cover letter with ID:", id)
        try {
          response = await coverLetterAPI.getCoverLetter(id)
          console.log("Cover letter response:", response)
        } catch (err: any) {
          console.error("Error in cover letter API call:", err)
          throw new Error(`Failed to fetch cover letter: ${err?.message || 'Unknown error'}`)
        }
      } else if (type === "linkedin") {
        response = await linkedinAPI.getLinkedInBio(id)
        console.log("LinkedIn bio response:", response)
      } else {
        console.error("Unknown document type:", type)
        throw new Error(`Unknown document type: ${type}`)
      }

      // Extract the document data from the response
      let documentData = null

      console.log("Response structure:", JSON.stringify(response?.data, null, 2))

      if (response?.data?.resume) {
        documentData = response.data.resume
      } else if (response?.data?.coverLetter) {
        documentData = response.data.coverLetter
      } else if (response?.data?.linkedinBio) {
        documentData = response.data.linkedinBio
      } else if (response?.data) {
        // If the data is directly in the response
        documentData = response.data

        // Special handling for cover letters - the API might return the cover letter
        // directly or nested in a 'coverLetter' property
        if (type === "cover-letter" && !documentData.resultText && !documentData.coverLetter) {
          // Create a wrapper to match expected structure
          documentData = { coverLetter: documentData }
        }
      }

      console.log("Document data after extraction:", documentData)

      if (!documentData) {
        console.error("No document data found in response:", response)
        throw new Error("No document data found in response")
      }

      setDocument(documentData)
    } catch (error: any) {
      console.error("Error fetching document:", error)
      toast({
        title: "Error fetching document",
        description: `Could not load the document: ${error?.message || 'Unknown error'}. Please try again.`,
        variant: "destructive",
      })

      // Delay the redirect to allow the user to read the error message
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      if (!document || !document.title) {
        throw new Error("Document not loaded properly");
      }

      let response

      console.log(`Exporting PDF for document type: ${type}, id: ${id}`);

      if (type === "resume") {
        console.log("Exporting resume PDF for ID:", id);
        response = await resumeAPI.generateResumePdf(id)
      } else if (type === "cover-letter") {
        console.log("Exporting cover letter PDF for ID:", id);
        response = await coverLetterAPI.generateCoverLetterPdf(id)
      } else if (type === "linkedin") {
        console.log("Exporting LinkedIn bio PDF for ID:", id);
        response = await linkedinAPI.generateLinkedInBioPdf(id)
      } else {
        throw new Error(`Unknown document type for PDF export: ${type}`);
      }

      if (!response) {
        throw new Error("No response from server");
      }

      console.log("PDF export response:", response);

      // Use the download utility
      const success = downloadPdf(response.data, document.title);

      if (success) {
        toast({
          title: "PDF downloaded",
          description: "Your document has been downloaded as PDF",
        });
      } else {
        throw new Error("Failed to download PDF");
      }
    } catch (error: any) {
      console.error("PDF export error:", error);

      // Check if this is a permission error (403)
      if (error.response?.status === 403) {
        toast({
          title: "Export not available",
          description: "PDF export is only available for Basic and Premium plans. Please upgrade your plan.",
          variant: "destructive",
        })

        // Redirect to subscription page after a short delay
        setTimeout(() => {
          router.push('/subscription');
        }, 3000);
      } else {
        toast({
          title: "Export failed",
          description: `Could not export the document to PDF: ${error?.message || 'Unknown error'}. Please try again.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleExportDOCX = async () => {
    try {
      if (!document || !document.title) {
        throw new Error("Document not loaded properly");
      }

      let response

      console.log(`Exporting DOCX for document type: ${type}, id: ${id}`);

      if (type === "resume") {
        console.log("Exporting resume DOCX for ID:", id);
        response = await resumeAPI.exportResumeDocx(id)
      } else if (type === "cover-letter") {
        console.log("Exporting cover letter DOCX for ID:", id);
        response = await coverLetterAPI.exportCoverLetterDocx(id)
      } else if (type === "linkedin") {
        console.log("Exporting LinkedIn bio DOCX for ID:", id);
        response = await linkedinAPI.exportLinkedInBioDocx(id)
      } else {
        throw new Error(`Unknown document type for DOCX export: ${type}`);
      }

      if (!response) {
        throw new Error("No response from server");
      }

      console.log("DOCX export response:", response);

      // Use the download utility
      const success = downloadDocx(response.data, document.title);

      if (success) {
        toast({
          title: "DOCX downloaded",
          description: "Your document has been downloaded as DOCX",
        });
      } else {
        throw new Error("Failed to download DOCX");
      }
    } catch (error: any) {
      console.error("DOCX export error:", error);

      // Check if this is a permission error (403)
      if (error.response?.status === 403) {
        toast({
          title: "Export not available",
          description: "DOCX export is only available for Basic and Premium plans. Please upgrade your plan.",
          variant: "destructive",
        })

        // Redirect to subscription page after a short delay
        setTimeout(() => {
          router.push('/subscription');
        }, 3000);
      } else {
        toast({
          title: "Export failed",
          description: `Could not export the document to DOCX: ${error?.message || 'Unknown error'}. Please try again.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleExportTXT = async () => {
    try {
      if (!document || !document.title) {
        throw new Error("Document not loaded properly");
      }

      let response

      console.log(`Exporting TXT for document type: ${type}, id: ${id}`);

      if (type === "resume") {
        console.log("Exporting resume TXT for ID:", id);
        response = await resumeAPI.exportResumeTxt(id)
      } else if (type === "cover-letter") {
        console.log("Exporting cover letter TXT for ID:", id);
        response = await coverLetterAPI.exportCoverLetterTxt(id)
      } else if (type === "linkedin") {
        console.log("Exporting LinkedIn bio TXT for ID:", id);
        response = await linkedinAPI.exportLinkedInBioTxt(id)
      } else {
        throw new Error(`Unknown document type for TXT export: ${type}`);
      }

      if (!response) {
        throw new Error("No response from server");
      }

      console.log("TXT export response:", response);

      // Use the download utility
      const success = downloadTxt(response.data, document.title);

      if (success) {
        toast({
          title: "TXT downloaded",
          description: "Your document has been downloaded as TXT",
        });
      } else {
        throw new Error("Failed to download TXT");
      }
    } catch (error: any) {
      console.error("TXT export error:", error);

      // Check if this is a permission error (403)
      if (error.response?.status === 403) {
        toast({
          title: "Export not available",
          description: "TXT export is only available for paid plans. Please upgrade your plan.",
          variant: "destructive",
        })

        // Redirect to subscription page after a short delay
        setTimeout(() => {
          router.push('/subscription');
        }, 3000);
      } else {
        toast({
          title: "Export failed",
          description: `Could not export the document to TXT: ${error?.message || 'Unknown error'}. Please try again.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleDocumentUpdated = () => {
    fetchDocument()
    setIsEditDialogOpen(false)
  }

  const getDocumentTypeName = () => {
    switch (type) {
      case "resume":
        return "Resume"
      case "cover-letter":
        return "Cover Letter"
      case "linkedin":
        return "LinkedIn Bio"
      default:
        return "Document"
    }
  }

  const getDocumentContent = () => {
    if (!document) return "";

    console.log("Getting content from document:", document);

    // Handle different document structures
    if (typeof document.content === 'string') {
      return document.content.replace(/\n/g, '<br>');
    } else if (document.resultText) {
      // Convert plain text to HTML with line breaks
      return document.resultText.replace(/\n/g, '<br>');
    }

    // Special handling for LinkedIn bios
    if (type === "linkedin") {
      // Check if we have the expected LinkedIn bio structure
      if (document.profile && document.content) {
        const { profile, experience, content } = document;

        // Format the LinkedIn bio content as HTML
        let htmlContent = '';

        // Add name and headline
        htmlContent += `<h1>${profile.firstName} ${profile.lastName}</h1>`;

        // Add headline or current position
        if (content.headline && typeof content.headline === 'string') {
          htmlContent += `<h2>${content.headline}</h2>`;
        } else if (profile.headline) {
          htmlContent += `<h2>${profile.headline}</h2>`;
        } else if (profile.currentPosition) {
          htmlContent += `<h2>${profile.currentPosition}</h2>`;
        }

        // Add location and industry
        if (profile.location && profile.industry) {
          htmlContent += `<p>${profile.location} | ${profile.industry}</p>`;
        }

        // Add about section
        if (content.about && typeof content.about === 'string') {
          htmlContent += `<h3>About</h3><p>${content.about.replace(/\n/g, '<br>')}</p>`;
        }

        // Add experience section
        if (content.experience && typeof content.experience === 'string') {
          htmlContent += `<h3>Experience</h3><p>${content.experience.replace(/\n/g, '<br>')}</p>`;
        } else if (experience && experience.professionalExperience) {
          htmlContent += `<h3>Experience</h3><p>${experience.professionalExperience.replace(/\n/g, '<br>')}</p>`;
        }

        // Add skills section
        if (experience && experience.skills) {
          htmlContent += `<h3>Skills</h3><p>${experience.skills.replace(/\n/g, '<br>')}</p>`;
        }

        return htmlContent;
      }

      // Fallback for LinkedIn bios with just profile data
      if (document.profile) {
        const { profile, experience } = document;
        return `
          <h1>${profile.firstName} ${profile.lastName}</h1>
          <h2>${profile.headline || profile.currentPosition}</h2>
          <p>${profile.location} | ${profile.industry}</p>
          ${experience ? `
            <h3>Experience</h3>
            <p>${experience.professionalExperience?.replace(/\n/g, '<br>') || ''}</p>
            <h3>Skills</h3>
            <p>${experience.skills?.replace(/\n/g, '<br>') || ''}</p>
          ` : ''}
        `;
      }

      // Handle case where content is an object
      if (document.content && typeof document.content === 'object') {
        const contentObj = document.content;
        let htmlContent = '<div class="linkedin-content">';

        // Add headline if available
        if (contentObj.headline) {
          htmlContent += `<h3>Headline</h3><p>${contentObj.headline}</p>`;
        }

        // Add about section if available
        if (contentObj.about) {
          htmlContent += `<h3>About</h3><p>${contentObj.about.replace(/\n/g, '<br>')}</p>`;
        }

        // Add experience if available
        if (contentObj.experience) {
          htmlContent += `<h3>Experience</h3><p>${contentObj.experience.replace(/\n/g, '<br>')}</p>`;
        }

        htmlContent += '</div>';
        return htmlContent;
      }
    }

    // Check if the document is a cover letter (they have a different structure)
    if (type === "cover-letter") {
      // Try to access the resultText directly from the document
      if (document.resultText) {
        return document.resultText.replace(/\n/g, '<br>');
      }

      // If we're here, the document might be wrapped in a coverLetter property
      if (document.coverLetter && document.coverLetter.resultText) {
        return document.coverLetter.resultText.replace(/\n/g, '<br>');
      }
    }

    // Fallback: try to stringify the document for debugging
    try {
      return `<pre>${JSON.stringify(document, null, 2)}</pre>`;
    } catch (e) {
      return "No content available";
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={loading ? "Loading..." : document?.title || "Document"}
        text={`View and export your ${getDocumentTypeName().toLowerCase()}`}
        className="animate-fade-in"
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="animate-fade-in">
                <TabsTrigger value="preview" className="transition-all duration-300 hover:bg-primary/10">Preview</TabsTrigger>
                <TabsTrigger value="export" className="transition-all duration-300 hover:bg-primary/10">Export</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview" className="space-y-4 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: getDocumentContent() }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button
                      onClick={handleExportPDF}
                      className="flex h-24 flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Download className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span>Export as PDF</span>
                    </Button>
                    <Button
                      onClick={handleExportDOCX}
                      className="flex h-24 flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <FileDown className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span>Export as DOCX</span>
                    </Button>
                    <Button
                      onClick={handleExportTXT}
                      variant="outline"
                      className="flex h-24 flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <FileDown className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      <span>Export as TXT</span>
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
              className="animate-fade-in"
            />
          )}
        </>
      )}
    </DashboardShell>
  )
}
