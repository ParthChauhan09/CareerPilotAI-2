"use client";

// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { DocumentList } from "@/components/document-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, FileEdit, RefreshCw } from "lucide-react";
import { CreateDocumentDialog } from "@/components/create-document-dialog";
import { coverLetterAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CoverLetter } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Cover Letter Stats Component
function CoverLetterStats({
  count,
  isLoading,
}: {
  count: number;
  isLoading: boolean;
}) {
  return (
    <Card className="overflow-hidden border-muted-foreground/20">
      <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 pb-2">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <FileEdit className="h-5 w-5" />
          Cover Letters
        </CardTitle>
        <CardDescription>Your job applications</CardDescription>
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

export default function CoverLettersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
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
      fetchCoverLetters();
    }
  }, [authLoading, isAuthenticated]);

  const fetchCoverLetters = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await coverLetterAPI.getAllCoverLetters();

      // Try to get data from different possible locations in the response
      let coverLetterData = [];
      if (
        response.data.coverLetters &&
        Array.isArray(response.data.coverLetters)
      ) {
        coverLetterData = response.data.coverLetters;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        coverLetterData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coverLetterData = response.data;
      }
      setCoverLetters(coverLetterData);
    } catch (error) {
      toast({
        title: "Error fetching cover letters",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateCoverLetter = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCoverLetterCreated = () => {
    fetchCoverLetters();
    setIsCreateDialogOpen(false);

    toast({
      title: "Cover letter created",
      description: "Your cover letter has been created successfully",
      key: "cover-letter-created-" + new Date().getTime(), // Add unique key to prevent duplicates
    });
  };

  const handleDeleteCoverLetter = async (id: string) => {
    try {
      await coverLetterAPI.deleteCoverLetter(id);
      setCoverLetters(coverLetters.filter((letter) => letter.id !== id));

      toast({
        title: "Cover letter deleted",
        description: "Your cover letter has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting cover letter",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Filter and sort cover letters
  const filteredCoverLetters = coverLetters.filter(
    (letter) =>
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((letter as any).jobTitle &&
        (letter as any).jobTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      ((letter as any).company &&
        (letter as any).company
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const sortedCoverLetters = [...filteredCoverLetters].sort((a, b) => {
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
            Loading your cover letters...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Cover Letters"
        text="Create and manage your job application cover letters"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCoverLetters}
            disabled={refreshing}
            className="h-9 w-9"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button onClick={handleCreateCoverLetter} className="gap-1">
            <PlusCircle className="mr-1 h-4 w-4" />
            New Cover Letter
          </Button>
        </div>
      </DashboardHeader>

      {/* Cover Letter Stats */}
      <div className="mt-8">
        <CoverLetterStats count={coverLetters.length} isLoading={loading} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-8">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search cover letters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <FileEdit className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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

      {/* Cover Letter List */}
      <div className="mt-8">
        <DocumentList
          type="coverLetter"
          documents={sortedCoverLetters}
          loading={loading}
          onCreateNew={handleCreateCoverLetter}
          onDelete={handleDeleteCoverLetter}
          onRefresh={fetchCoverLetters}
          hideSearch={true} // Hide the search in DocumentList since we have our own
          hideSort={true} // Hide the sort in DocumentList since we have our own
          externalSearchQuery={searchQuery} // Pass our search query to DocumentList
        />
      </div>

      <div className="mt-6">
        <CreateDocumentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          documentType="coverLetter"
          onDocumentCreated={handleCoverLetterCreated}
        />
      </div>
    </DashboardShell>
  );
}
