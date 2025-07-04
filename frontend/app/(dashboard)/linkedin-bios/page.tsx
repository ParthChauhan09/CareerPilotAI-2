"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DocumentList } from "@/components/document-list"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2, RefreshCw, FileText as LinkedinIcon } from "lucide-react"
import { CreateDocumentDialog } from "@/components/create-document-dialog"
import { linkedinAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LinkedInBio } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

// LinkedIn Bio Stats Component
function LinkedInBioStats({ count, isLoading }: { count: number, isLoading: boolean }) {
  return (
    <Card className="overflow-hidden border-muted-foreground/20">
      <CardHeader className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 pb-2">
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <LinkedinIcon className="h-5 w-5" />
          LinkedIn Bios
        </CardTitle>
        <CardDescription>Your professional profiles</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">{count}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default function LinkedInBiosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [linkedinBios, setLinkedinBios] = useState<LinkedInBio[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "a-z" | "z-a">("newest")
  const { toast } = useToast()

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchLinkedInBios()
    }
  }, [authLoading, isAuthenticated])

  const fetchLinkedInBios = async () => {
    setLoading(true)
    setRefreshing(true)
    try {
      const response = await linkedinAPI.getAllLinkedInBios()
      const linkedinData = response.data.linkedinBios || response.data.data || []
      setLinkedinBios(linkedinData)
    } catch (error) {
      console.error("Error fetching LinkedIn bios:", error)
      toast({
        title: "Error fetching LinkedIn bios",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCreateLinkedInBio = () => {
    setIsCreateDialogOpen(true)
  }

  const handleLinkedInBioCreated = () => {
    fetchLinkedInBios()
    setIsCreateDialogOpen(false)

    toast({
      title: "LinkedIn bio created",
      description: "Your LinkedIn bio has been created successfully",
      key: "linkedin-bio-created-" + new Date().getTime() // Add unique key to prevent duplicates
    })
  }

  const handleDeleteLinkedInBio = async (id: string) => {
    try {
      await linkedinAPI.deleteLinkedInBio(id)
      setLinkedinBios(linkedinBios.filter((bio) => bio.id !== id))

      toast({
        title: "LinkedIn bio deleted",
        description: "Your LinkedIn bio has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error deleting LinkedIn bio",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  // Filter and sort LinkedIn bios
  const filteredLinkedInBios = linkedinBios.filter(bio =>
    bio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((bio as any).headline && (bio as any).headline.toLowerCase().includes(searchQuery.toLowerCase())) ||
    ((bio as any).industry && (bio as any).industry.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedLinkedInBios = [...filteredLinkedInBios].sort((a, b) => {
    try {
      switch (sortOrder) {
        case "newest":
          // Safely parse dates with fallback
          const dateA1 = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
          const dateB1 = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
          return dateB1 - dateA1; // Newest first
        case "oldest":
          const dateA2 = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
          const dateB2 = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
          return dateA2 - dateB2; // Oldest first
        case "a-z":
          return (a.title || "").localeCompare(b.title || "");
        case "z-a":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    } catch (error) {
      console.error("Error sorting LinkedIn bios:", error);
      return 0; // Keep original order if there's an error
    }
  })

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading your LinkedIn bios...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="LinkedIn Bios"
        text="Create and manage your professional LinkedIn profiles"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchLinkedInBios}
            disabled={refreshing}
            className="h-9 w-9"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button onClick={handleCreateLinkedInBio} className="gap-1">
            <PlusCircle className="mr-1 h-4 w-4" />
            New LinkedIn Bio
          </Button>
        </div>
      </DashboardHeader>

      {/* LinkedIn Bio Stats */}
      <div className="mt-8">
        <LinkedInBioStats count={linkedinBios.length} isLoading={loading} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-8">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search LinkedIn bios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <LinkedinIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              console.log("Changing sort order to:", value);
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

      {/* LinkedIn Bio List */}
      <div className="mt-8">
        <DocumentList
          type="linkedin"
          documents={sortedLinkedInBios}
          loading={loading}
          onCreateNew={handleCreateLinkedInBio}
          onDelete={handleDeleteLinkedInBio}
          onRefresh={fetchLinkedInBios}
          hideSearch={true} // Hide the search in DocumentList since we have our own
          hideSort={true} // Hide the sort in DocumentList since we have our own
          externalSearchQuery={searchQuery} // Pass our search query to DocumentList
        />
      </div>

      <div className="mt-6">
        <CreateDocumentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          documentType="linkedin"
          onDocumentCreated={handleLinkedInBioCreated}
        />
      </div>
    </DashboardShell>
  )
}
