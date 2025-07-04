"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  PlusCircle,
  Loader2,
  RefreshCw,
  FileText,
  FileEdit,
  FileText as LinkedinIcon
} from "lucide-react"
import { CreateDocumentDialog } from "@/components/create-document-dialog"
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { DocumentType, Resume, CoverLetter, LinkedInBio } from "@/lib/types"

// Dashboard Welcome Component
function DashboardWelcome({
  user,
  totalDocuments,
  isLoading,
  onCreateDocument,
  setActiveTab
}: {
  user: any,
  totalDocuments: number,
  isLoading: boolean,
  onCreateDocument: () => void,
  setActiveTab: (tab: DocumentType) => void
}) {
  return (
    <Card className="overflow-hidden border-muted-foreground/20 transition-all duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <PlusCircle className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
          Quick Start
        </CardTitle>
        <CardDescription>Get started with your career documents</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground animate-fade-in">
              You have created a total of <span className="font-bold">{totalDocuments}</span> documents so far.
              Create more documents to enhance your job search.
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 justify-start transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 hover:translate-y-[-2px] animate-fade-in"
                style={{ animationDelay: '100ms' }}
                onClick={() => {
                  setActiveTab("resume");
                  onCreateDocument();
                }}
              >
                <FileText className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                New Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 justify-start transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 hover:translate-y-[-2px] animate-fade-in"
                style={{ animationDelay: '200ms' }}
                onClick={() => {
                  setActiveTab("coverLetter");
                  onCreateDocument();
                }}
              >
                <FileEdit className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                New Cover Letter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 justify-start transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-300 hover:translate-y-[-2px] animate-fade-in"
                style={{ animationDelay: '300ms' }}
                onClick={() => {
                  setActiveTab("linkedin");
                  onCreateDocument();
                }}
              >
                <LinkedinIcon className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                New LinkedIn Bio
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  // const router = useRouter() // Not needed for now
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as DocumentType | null

  const [activeTab, setActiveTab] = useState<DocumentType>(tabParam || "resume")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [linkedinBios, setLinkedinBios] = useState<LinkedInBio[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchDocuments()
    }
  }, [authLoading, isAuthenticated])

  // Handle URL query parameters for tab selection
  useEffect(() => {
    if (tabParam && ['resume', 'coverLetter', 'linkedin'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // No longer needed with separate pages

  const fetchDocuments = async () => {
    setLoading(true)
    setRefreshing(true)
    try {
      // Fetch all document types in parallel
      const [resumesRes, coverLettersRes, linkedinBiosRes] = await Promise.all([
        resumeAPI.getAllResumes(),
        coverLetterAPI.getAllCoverLetters(),
        linkedinAPI.getAllLinkedInBios(),
      ])

      // Extract data from responses
      const resumeData = resumesRes.data.resumes || resumesRes.data.data || []
      const coverLetterData = coverLettersRes.data.coverLetters || coverLettersRes.data.data || []
      const linkedinData = linkedinBiosRes.data.linkedinBios || linkedinBiosRes.data.data || []

      setResumes(resumeData)
      setCoverLetters(coverLetterData)
      setLinkedinBios(linkedinData)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error fetching documents",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // No longer needed with separate pages

  const handleDocumentCreated = () => {
    fetchDocuments()
    setIsCreateDialogOpen(false)

    toast({
      title: "Document created",
      description: "Your document has been created successfully",
      key: "document-created-" + new Date().getTime() // Add unique key to prevent duplicates
    })
  }

  // No longer needed with separate pages

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-background to-background/90">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-lg animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome${user?.name ? ', ' + user.name.split(' ')[0] : ''}`}
        text="Create and manage your career documents"
        className="animate-fade-in"
      >
        <div className="flex items-center gap-2 animate-fade-in [animation-delay:200ms]">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDocuments}
            disabled={refreshing}
            className="h-9 w-9 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : 'transition-transform duration-300 hover:rotate-180'}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-1 transition-all duration-300 hover:scale-105"
          >
            <PlusCircle className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            New Document
          </Button>
        </div>
      </DashboardHeader>

      {/* Dashboard Welcome */}
      <div className="mt-8 animate-fade-in [animation-delay:300ms]">
        <DashboardWelcome
          user={user}
          totalDocuments={resumes.length + coverLetters.length + linkedinBios.length}
          isLoading={loading}
          onCreateDocument={() => setIsCreateDialogOpen(true)}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 animate-fade-in [animation-delay:400ms]">
        <Card className="overflow-hidden border-muted-foreground/20 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <RefreshCw className="h-5 w-5 animate-pulse" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest document updates</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-2">
                <div className="h-12 animate-pulse rounded-md bg-muted"></div>
                <div className="h-12 animate-pulse rounded-md bg-muted"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.length + coverLetters.length + linkedinBios.length > 0 ? (
                  <div className="space-y-2">
                    {[
                      ...resumes.map(doc => ({ ...doc, docType: 'resume' })),
                      ...coverLetters.map(doc => ({ ...doc, docType: 'coverLetter' })),
                      ...linkedinBios.map(doc => ({ ...doc, docType: 'linkedin' }))
                    ]
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                      .slice(0, 3)
                      .map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {doc.docType === 'resume' ? (
                                <FileText className="h-4 w-4 text-primary" />
                              ) : doc.docType === 'coverLetter' ? (
                                <FileEdit className="h-4 w-4 text-primary" />
                              ) : (
                                <LinkedinIcon className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Updated {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/document/${doc.docType === 'resume' ? 'resume' : doc.docType === 'coverLetter' ? 'cover-letter' : 'linkedin'}/${doc.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No documents created yet.</p>
                    <p className="text-sm text-muted-foreground">Create your first document to get started!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Type Cards */}
      <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 animate-fade-in [animation-delay:500ms]">
        {/* Resume Card */}
        <Card className="overflow-hidden border-muted-foreground/20 group transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] animate-fade-in [animation-delay:600ms]">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <FileText className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Resumes
            </CardTitle>
            <CardDescription>Professional summaries for job applications</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">{resumes.length}</div>
            <div className="text-sm text-muted-foreground">
              {resumes.length === 1 ? 'resume' : 'resumes'} created
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 bg-muted/5">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              asChild
            >
              <Link href="/resumes">
                <FileText className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                View All Resumes
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Cover Letter Card */}
        <Card className="overflow-hidden border-muted-foreground/20 group transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] animate-fade-in [animation-delay:700ms]">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <FileEdit className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Cover Letters
            </CardTitle>
            <CardDescription>Tailored letters for job applications</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">{coverLetters.length}</div>
            <div className="text-sm text-muted-foreground">
              {coverLetters.length === 1 ? 'cover letter' : 'cover letters'} created
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 bg-muted/5">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              asChild
            >
              <Link href="/cover-letters">
                <FileEdit className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                View All Cover Letters
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* LinkedIn Bio Card */}
        <Card className="overflow-hidden border-muted-foreground/20 group transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] md:col-span-2 lg:col-span-1 animate-fade-in [animation-delay:800ms]">
          <CardHeader className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 pb-2">
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <LinkedinIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              LinkedIn Bios
            </CardTitle>
            <CardDescription>Professional profiles for LinkedIn</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">{linkedinBios.length}</div>
            <div className="text-sm text-muted-foreground">
              {linkedinBios.length === 1 ? 'LinkedIn bio' : 'LinkedIn bios'} created
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 bg-muted/5">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
              asChild
            >
              <Link href="/linkedin-bios">
                <LinkedinIcon className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                View All LinkedIn Bios
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <CreateDocumentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          documentType={activeTab}
          onDocumentCreated={handleDocumentCreated}
          className="animate-fade-in"
        />
      </div>
    </DashboardShell>
  )
}
