"use client";

// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { DocumentList } from "@/components/document-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, FileText, RefreshCw } from "lucide-react";
import { CreateDocumentDialog } from "@/components/create-document-dialog";
import { resumeAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Resume } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Resume Stats Component
function ResumeStats({
  count,
  isLoading,
}: {
  count: number;
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden border-muted-foreground/20">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <FileText className="h-5 w-5" />
          Resumes
        </CardTitle>
        <CardDescription>Your professional summaries</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">{count}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResumesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "a-z" | "z-a"
  >("newest");
  const { toast } = useToast();

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchResumes();
    }
  }, [authLoading, isAuthenticated]);

  const fetchResumes = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await resumeAPI.getAllResumes();
      const resumeData = response.data.resumes || response.data.data || [];
      setResumes(resumeData);
    } catch (error) {
      toast({
        title: "Error fetching resumes",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateResume = () => {
    setIsCreateDialogOpen(true);
  };

  const handleResumeCreated = () => {
    fetchResumes();
    setIsCreateDialogOpen(false);

    toast({
      title: "Resume created",
      description: "Your resume has been created successfully",
      key: "resume-created-" + new Date().getTime(), // Add unique key to prevent duplicates
    });
  };

  const handleDeleteResume = async (id: string) => {
    try {
      await resumeAPI.deleteResume(id);
      setResumes(resumes.filter((resume) => resume.id !== id));

      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting resume",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Filter and sort resumes
  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resume.jobTitle &&
        resume.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (resume.company &&
        resume.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    try {
      switch (sortOrder) {
        case "newest":
          // Safely parse dates with fallback
          const dateA1 = a.updatedAt
            ? new Date(a.updatedAt).getTime()
            : new Date(a.createdAt).getTime();
          const dateB1 = b.updatedAt
            ? new Date(b.updatedAt).getTime()
            : new Date(b.createdAt).getTime();
          return dateB1 - dateA1; // Newest first
        case "oldest":
          const dateA2 = a.updatedAt
            ? new Date(a.updatedAt).getTime()
            : new Date(a.createdAt).getTime();
          const dateB2 = b.updatedAt
            ? new Date(b.updatedAt).getTime()
            : new Date(b.createdAt).getTime();
          return dateA2 - dateB2; // Oldest first
        case "a-z":
          return (a.title || "").localeCompare(b.title || "");
        case "z-a":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    } catch (error) {
      return 0; // Keep original order if there's an error
    }
  });

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your resumes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Resumes"
        text="Create and manage your professional resumes"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchResumes}
            disabled={refreshing}
            className="h-9 w-9"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button onClick={handleCreateResume} className="gap-1">
            <PlusCircle className="mr-1 h-4 w-4" />
            New Resume
          </Button>
        </div>
      </DashboardHeader>

      {/* Resume Stats */}
      <div className="mt-8">
        <ResumeStats count={resumes.length} isLoading={loading} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-8">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value as any);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="a-z">A to Z</SelectItem>
              <SelectItem value="z-a">Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resume List */}
      <div className="mt-8">
        <DocumentList
          type="resume"
          documents={sortedResumes}
          loading={loading}
          onCreateNew={handleCreateResume}
          onDelete={handleDeleteResume}
          onRefresh={fetchResumes}
          hideSearch={true} // Hide the search in DocumentList since we have our own
          hideSort={true} // Hide the sort in DocumentList since we have our own
          externalSearchQuery={searchQuery} // Pass our search query to DocumentList
        />
      </div>

      <div className="mt-6">
        <CreateDocumentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          documentType="resume"
          onDocumentCreated={handleResumeCreated}
        />
      </div>
    </DashboardShell>
  );
}
