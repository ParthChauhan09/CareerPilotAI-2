"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { ExportDropdown } from "@/components/export-dropdown";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DocumentType } from "@/lib/types";

interface DocumentListProps {
  type: DocumentType;
  documents: any[];
  loading: boolean;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  hideSearch?: boolean;
  hideSort?: boolean;
  externalSearchQuery?: string;
}

export function DocumentList({
  type,
  documents,
  loading,
  onCreateNew,
  onDelete,
  onRefresh,
  hideSearch = false,
  hideSort = false,
  externalSearchQuery = "",
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  // Use external search query if provided
  const effectiveSearchQuery = externalSearchQuery || searchQuery;

  const getDocumentIcon = (forCard = false) => {
    const baseClass = forCard ? "h-10 w-10" : "h-8 w-8";

    // Add a subtle animation to the icon
    const animationClass = forCard
      ? "group-hover:scale-110 transition-transform duration-300"
      : "";

    switch (type) {
      case "resume":
        return (
          <div
            className={`relative flex items-center justify-center rounded-full bg-blue-100 p-2 dark:bg-blue-900/30 ${
              forCard ? "h-12 w-12" : "h-10 w-10"
            } ${animationClass}`}
          >
            <FileText
              className={`${baseClass} text-blue-600 dark:text-blue-400`}
            />
          </div>
        );
      case "coverLetter":
        return (
          <div
            className={`relative flex items-center justify-center rounded-full bg-purple-100 p-2 dark:bg-purple-900/30 ${
              forCard ? "h-12 w-12" : "h-10 w-10"
            } ${animationClass}`}
          >
            <FileText
              className={`${baseClass} text-purple-600 dark:text-purple-400`}
            />
          </div>
        );
      case "linkedin":
        return (
          <div
            className={`relative flex items-center justify-center rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30 ${
              forCard ? "h-12 w-12" : "h-10 w-10"
            } ${animationClass}`}
          >
            <FileText
              className={`${baseClass} text-indigo-600 dark:text-indigo-400`}
            />
          </div>
        );
      default:
        return (
          <div
            className={`relative flex items-center justify-center rounded-full bg-primary/10 p-2 ${
              forCard ? "h-12 w-12" : "h-10 w-10"
            } ${animationClass}`}
          >
            <FileText className={`${baseClass} text-primary`} />
          </div>
        );
    }
  };

  const getDocumentTypeName = () => {
    switch (type) {
      case "resume":
        return "Resume";
      case "coverLetter":
        return "Cover Letter";
      case "linkedin":
        return "LinkedIn Bio";
      default:
        return "Document";
    }
  };

  const getDocumentTypeUrl = () => {
    switch (type) {
      case "resume":
        return "resume";
      case "coverLetter":
        return "cover-letter";
      case "linkedin":
        return "linkedin";
      default:
        return "document";
    }
  };

  const getDocumentContent = (doc: any): string => {
    // Handle different document structures
    if (doc?.content) {
      return doc.content;
    }

    // Check for resultText
    if (typeof doc.resultText === "string") {
      return doc.resultText;
    }

    // Check for nested coverLetter structure
    if (doc.coverLetter && typeof doc.coverLetter.resultText === "string") {
      return doc.coverLetter.resultText;
    }

    // Check for nested content as string
    if (doc.coverLetter && typeof doc.coverLetter.content === "string") {
      return doc.coverLetter.content;
    }

    // Check for promptData.jobDescription (for cover letters)
    if (doc.promptData && typeof doc.promptData.jobDescription === "string") {
      return doc.promptData.jobDescription;
    }

    // Special handling for LinkedIn bios
    if (type === "linkedin") {
      // Direct approach for the structure we've seen in the debug tab
      if (doc.profile && doc.content && typeof doc.content === "object") {
        // Format LinkedIn content into a readable string
        let linkedInContent = "";

        // Add name and headline if available
        if (doc.profile.firstName && doc.profile.lastName) {
          linkedInContent += `${doc.profile.firstName} ${doc.profile.lastName}`;

          if (doc.profile.currentPosition) {
            linkedInContent += ` | ${doc.profile.currentPosition}`;
          }

          linkedInContent += "\n\n";
        }

        // Add headline from content if available
        if (doc.content.headline && typeof doc.content.headline === "string") {
          linkedInContent += doc.content.headline + "\n\n";
        }

        // Add about section if available
        if (doc.content.about && typeof doc.content.about === "string") {
          linkedInContent += "About: " + doc.content.about + "\n\n";
        }

        // Add experience if available
        if (
          doc.content.experience &&
          typeof doc.content.experience === "string"
        ) {
          linkedInContent += "Experience: " + doc.content.experience + "\n\n";
        } else if (doc.experience && doc.experience.professionalExperience) {
          linkedInContent +=
            "Experience: " + doc.experience.professionalExperience + "\n\n";
        }

        // Add skills if available
        if (doc.experience && doc.experience.skills) {
          linkedInContent += "Skills: " + doc.experience.skills;
        }

        const trimmedContent = linkedInContent.trim();
        if (trimmedContent) {
          return trimmedContent;
        }
      }

      // Fallback: If we have a profile object, create a summary from it
      if (doc.profile) {
        const profile = doc.profile;
        let profileSummary = "";

        if (profile.firstName && profile.lastName) {
          profileSummary += `${profile.firstName} ${profile.lastName}`;
        }

        if (profile.headline) {
          profileSummary += ` | ${profile.headline}`;
        } else if (profile.currentPosition) {
          profileSummary += ` | ${profile.currentPosition}`;
        }

        if (profile.location && profile.industry) {
          profileSummary += `\n${profile.location} | ${profile.industry}`;
        }

        if (doc.experience && doc.experience.skills) {
          profileSummary += `\n\nSkills: ${doc.experience.skills}`;
        }

        if (doc.experience && doc.experience.professionalExperience) {
          profileSummary += `\n\nExperience: ${doc.experience.professionalExperience}`;
        }

        if (profileSummary) {
          return profileSummary;
        }
      }

      // Last resort: stringify the content object if it exists
      if (doc.content && typeof doc.content === "object") {
        try {
          // Extract just the most important fields to avoid [object Object]
          const contentSummary = {
            headline: doc.content.headline || "",
            about: doc.content.about || "",
            experience: doc.content.experience || "",
          };

          // Only include non-empty fields
          const filteredSummary = Object.entries(contentSummary)
            .filter(([_, value]) => value)
            .reduce<Record<string, string>>((obj, [key, value]) => {
              obj[key] = value as string;
              return obj;
            }, {});

          // If we have any content, format it as a string
          if (Object.keys(filteredSummary).length > 0) {
            return Object.entries(filteredSummary)
              .map(
                ([key, value]) =>
                  `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
              )
              .join("\n\n");
          }

          // If all else fails, return a simple string representation
          return "LinkedIn Profile";
        } catch (e) {
          return "LinkedIn Profile";
        }
      }
    }

    // Return empty string as fallback
    return "";
  };

  // Function to safely get document ID
  const getDocumentId = (doc: any): string => {
    // Try different properties that might contain the ID
    if (doc?.id) {
      return doc.id;
    }

    if (doc?.coverLetter?.id) {
      return doc.coverLetter.id;
    }

    if (doc?._id) {
      return doc._id;
    }

    if (doc?.coverLetter?._id) {
      return doc.coverLetter._id;
    }

    // If doc is just an ID string
    if (typeof doc === "string") {
      return doc;
    }
    return "unknown-id";
  };

  // Function to safely get document title
  const getDocumentTitle = (doc: any): string => {
    // Check for direct title
    if (doc && typeof doc.title === "string") {
      return doc.title;
    }

    // Check for nested title in coverLetter
    if (doc && doc.coverLetter && typeof doc.coverLetter.title === "string") {
      return doc.coverLetter.title;
    }

    // Check for name as fallback
    if (doc && typeof doc.name === "string") {
      return doc.name;
    }

    // Check for nested name in coverLetter
    if (doc && doc.coverLetter && typeof doc.coverLetter.name === "string") {
      return doc.coverLetter.name;
    }

    return "Untitled Document";
  };

  // Function to safely get document date
  const getDocumentDate = (doc: any): string => {
    // Default to current date if nothing is found
    const defaultDate = new Date().toISOString();

    try {
      // Check for direct updatedAt
      if (doc && doc.updatedAt) {
        return doc.updatedAt;
      }

      // Check for nested updatedAt in document properties
      if (doc && doc.coverLetter && doc.coverLetter.updatedAt) {
        return doc.coverLetter.updatedAt;
      }

      if (doc && doc.resume && doc.resume.updatedAt) {
        return doc.resume.updatedAt;
      }

      if (doc && doc.linkedinBio && doc.linkedinBio.updatedAt) {
        return doc.linkedinBio.updatedAt;
      }

      // Check for direct createdAt as fallback
      if (doc && doc.createdAt) {
        return doc.createdAt;
      }

      // Check for nested createdAt in document properties
      if (doc && doc.coverLetter && doc.coverLetter.createdAt) {
        return doc.coverLetter.createdAt;
      }

      if (doc && doc.resume && doc.resume.createdAt) {
        return doc.resume.createdAt;
      }

      if (doc && doc.linkedinBio && doc.linkedinBio.createdAt) {
        return doc.linkedinBio.createdAt;
      }

      // If we have a date string in any format, try to parse it
      if (doc && typeof doc.date === "string") {
        return new Date(doc.date).toISOString();
      }

      return defaultDate;
    } catch (error) {
      return defaultDate;
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const title = getDocumentTitle(doc).toLowerCase();
    return title.includes(effectiveSearchQuery.toLowerCase());
  });

  // Only sort internally if we're not using external sorting (hideSort is false)
  const sortedDocuments = hideSort
    ? filteredDocuments // Use the documents as they were passed (already sorted by parent)
    : [...filteredDocuments].sort((a, b) => {
        try {
          if (sortBy === "updatedAt") {
            const dateA = new Date(getDocumentDate(a)).getTime();
            const dateB = new Date(getDocumentDate(b)).getTime();
            return dateB - dateA; // Newest first
          } else if (sortBy === "createdAt") {
            const dateA = new Date(getDocumentDate(a)).getTime();
            const dateB = new Date(getDocumentDate(b)).getTime();
            return dateB - dateA; // Newest first
          } else {
            return getDocumentTitle(a).localeCompare(getDocumentTitle(b));
          }
        } catch (error) {
          return 0; // Keep original order if there's an error
        }
      });

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Only show search and sort controls if not hidden */}
      {(!hideSearch || !hideSort) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search input - only show if not hidden */}
          {!hideSearch && (
            <div className="relative flex w-full max-w-sm items-center">
              <div className="absolute left-3 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Input
                placeholder={`Search ${getDocumentTypeName()}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-full border-muted-foreground/20"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Sort dropdown - only show if not hidden */}
            {!hideSort && (
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-[180px] rounded-full border-muted-foreground/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              title="Refresh"
              className="h-10 w-10 rounded-full border-muted-foreground/20"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              onClick={onCreateNew}
              className="rounded-full h-10 px-4 gap-2 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New</span>
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden border-muted-foreground/10 transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-[180px]" />
              </CardContent>
              <CardFooter className="border-t p-4 flex justify-between items-center">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-8 w-[80px] rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : sortedDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center bg-muted/20 animate-fade-in">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              {getDocumentIcon(true)}
            </div>
          </div>
          <h3 className="mt-4 text-xl font-semibold">
            No {getDocumentTypeName()}s Found
          </h3>
          <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-md">
            {effectiveSearchQuery
              ? `No ${getDocumentTypeName().toLowerCase()}s match your search criteria.`
              : `You haven't created any ${getDocumentTypeName().toLowerCase()}s yet. Create your first one to get started!`}
          </p>

          {effectiveSearchQuery && !hideSearch ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="rounded-full px-4"
              >
                Clear Search
              </Button>
              <Button
                onClick={onCreateNew}
                className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="h-5 w-5" />
                Create New
              </Button>
            </div>
          ) : (
            <Button
              onClick={onCreateNew}
              size="lg"
              className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="h-5 w-5" />
              Create {getDocumentTypeName()}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedDocuments.map((doc, index) => (
            <Card
              key={getDocumentId(doc)}
              className="group overflow-hidden border-muted-foreground/10 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Removed the full-card link that was causing issues */}

              {/* Card header with icon and title */}
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2 relative z-20">
                <Link
                  href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                    doc
                  )}`}
                  className="cursor-pointer"
                >
                  {getDocumentIcon(true)}
                </Link>
                <div className="space-y-1 flex-1">
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    <Link
                      href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                        doc
                      )}`}
                      className="hover:underline cursor-pointer"
                    >
                      {getDocumentTitle(doc)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span>Updated</span>
                    <time
                      dateTime={getDocumentDate(doc)}
                      className="font-medium text-muted-foreground"
                    >
                      {new Date(getDocumentDate(doc)).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </CardDescription>
                </div>

                {/* Actions dropdown menu */}
                <div className="ml-auto relative z-30">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                            doc
                          )}`}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          View & Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                            doc
                          )}?tab=export`}
                          className="cursor-pointer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteClick(getDocumentId(doc));
                        }}
                        className="text-red-600 focus:bg-red-100 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {/* Card content with preview */}
              <CardContent className="pb-2 relative z-20">
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span>Created</span>
                    <time
                      dateTime={getDocumentDate(doc)}
                      className="font-medium"
                    >
                      {new Date(getDocumentDate(doc)).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>

                  {/* Content preview */}
                  {(() => {
                    const content = getDocumentContent(doc);
                    return content ? (
                      <Link
                        href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                          doc
                        )}`}
                        className="block mt-2 hover:bg-muted/50 transition-colors rounded"
                      >
                        <div className="line-clamp-2 text-xs p-2 rounded bg-muted/30 border border-muted/50 italic">
                          {typeof content === "string"
                            ? content.length > 150
                              ? content.substring(0, 150).replace(/\n/g, " ") +
                                "..."
                              : content.replace(/\n/g, " ")
                            : null}
                        </div>
                      </Link>
                    ) : null;
                  })()}
                </div>
              </CardContent>

              {/* Card footer with badge and action buttons */}
              <CardFooter className="border-t p-4 flex justify-between items-center bg-muted/5 relative z-20">
                <Badge
                  variant="outline"
                  className={`
                    ${
                      type === "resume"
                        ? "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                        : ""
                    }
                    ${
                      type === "coverLetter"
                        ? "border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                        : ""
                    }
                    ${
                      type === "linkedin"
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800"
                        : ""
                    }
                  `}
                >
                  {getDocumentTypeName()}
                </Badge>
                <div className="flex items-center gap-2 relative z-30">
                  <ExportDropdown
                    documentId={getDocumentId(doc)}
                    documentType={type}
                    documentTitle={getDocumentTitle(doc)}
                    variant="ghost"
                    size="sm"
                    showLabel={false}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <Link
                      href={`/document/${getDocumentTypeUrl()}/${getDocumentId(
                        doc
                      )}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="mr-2 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-none shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl">
              Delete {getDocumentTypeName()}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center max-w-[400px] mx-auto">
              Are you sure you want to delete this{" "}
              {getDocumentTypeName().toLowerCase()}? This action cannot be
              undone and all data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <AlertDialogCancel className="rounded-full border-muted-foreground/20 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors mt-0"
            >
              Delete {getDocumentTypeName()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
