"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { DocumentType } from "@/lib/types"

interface EditDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentType: DocumentType
  document: any
  onDocumentUpdated: () => void
}

export function EditDocumentDialog({
  open,
  onOpenChange,
  documentType,
  document,
  onDocumentUpdated,
}: EditDocumentDialogProps) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (document) {
      setTitle(document.title || "")
    }
  }, [document])

  const getTitle = () => {
    switch (documentType) {
      case "resume":
        return "Edit Resume"
      case "coverLetter":
        return "Edit Cover Letter"
      case "linkedin":
        return "Edit LinkedIn Bio"
      default:
        return "Edit Document"
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your document",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (documentType === "resume") {
        await resumeAPI.updateResume(document.id, { title })
      } else if (documentType === "coverLetter") {
        await coverLetterAPI.updateCoverLetter(document.id, { title })
      } else if (documentType === "linkedin") {
        await linkedinAPI.updateLinkedInBio(document.id, { title })
      }

      toast({
        title: "Document updated",
        description: "Your document has been updated successfully",
      })

      onDocumentUpdated()
    } catch (error) {
      toast({
        title: "Error updating document",
        description: "There was an error updating your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>Update your document information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
