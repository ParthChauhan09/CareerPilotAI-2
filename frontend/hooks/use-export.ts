"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api"
import { downloadPdf, downloadTxt } from "@/lib/download-utils"
import { useToast } from "@/hooks/use-toast"
import type { DocumentType } from "@/lib/types"

interface ExportOptions {
  documentId: string
  documentType: DocumentType
  documentTitle: string
}

export function useExport() {
  const [exportingStates, setExportingStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const router = useRouter()

  const getExportKey = (documentId: string, format: string) => `${documentId}-${format}`

  const isExporting = (documentId: string, format: string) => {
    return exportingStates[getExportKey(documentId, format)] || false
  }

  const setExportingState = (documentId: string, format: string, isExporting: boolean) => {
    const key = getExportKey(documentId, format)
    setExportingStates(prev => ({
      ...prev,
      [key]: isExporting
    }))
  }

  const isAnyExporting = Object.values(exportingStates).some(state => state)

  const getAPIForDocumentType = (documentType: DocumentType) => {
    switch (documentType) {
      case "resume":
        return resumeAPI
      case "coverLetter":
        return coverLetterAPI
      case "linkedin":
        return linkedinAPI
      default:
        throw new Error(`Unknown document type: ${documentType}`)
    }
  }

  const getDocumentTypeName = (documentType: DocumentType) => {
    switch (documentType) {
      case "resume":
        return "Resume"
      case "coverLetter":
        return "Cover Letter"
      case "linkedin":
        return "LinkedIn Bio"
      default:
        return "Document"
    }
  }

  const handleExportError = (error: any, format: string) => {
    if (error.response?.status === 403) {
      toast({
        title: "Export not available",
        description: `${format} export is only available for paid plans. Please upgrade your plan.`,
        variant: "destructive",
      })
      setTimeout(() => router.push("/subscription"), 3000)
    } else if (error.response?.status === 401) {
      toast({
        title: "Authentication required",
        description: "Please log in to export documents.",
        variant: "destructive",
      })
      setTimeout(() => router.push("/auth/login"), 2000)
    } else {
      toast({
        title: "Export failed",
        description: `Could not export the document to ${format}: ${error?.message || "Unknown error"}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const exportToPDF = async ({ documentId, documentType, documentTitle }: ExportOptions) => {
    try {
      setExportingState(documentId, "PDF", true)
      const api = getAPIForDocumentType(documentType)

      let response
      if (documentType === "resume") {
        response = await api.generateResumePdf(documentId)
      } else if (documentType === "coverLetter") {
        response = await (api as typeof coverLetterAPI).generateCoverLetterPdf(documentId)
      } else if (documentType === "linkedin") {
        response = await (api as typeof linkedinAPI).generateLinkedInBioPdf(documentId)
      }

      if (!response) throw new Error("No response from server")

      const success = downloadPdf(response.data, documentTitle)
      if (success) {
        toast({
          title: "PDF downloaded",
          description: `Your ${getDocumentTypeName(documentType).toLowerCase()} has been downloaded as PDF`,
        })
      } else {
        throw new Error("Failed to download PDF")
      }
    } catch (error: any) {
      handleExportError(error, "PDF")
    } finally {
      setExportingState(documentId, "PDF", false)
    }
  }

  const exportToTXT = async ({ documentId, documentType, documentTitle }: ExportOptions) => {
    try {
      setExportingState(documentId, "TXT", true)
      const api = getAPIForDocumentType(documentType)

      let response
      if (documentType === "resume") {
        response = await (api as typeof resumeAPI).exportResumeTxt(documentId)
      } else if (documentType === "coverLetter") {
        response = await (api as typeof coverLetterAPI).exportCoverLetterTxt(documentId)
      } else if (documentType === "linkedin") {
        response = await (api as typeof linkedinAPI).exportLinkedInBioTxt(documentId)
      }

      if (!response) throw new Error("No response from server")

      const success = downloadTxt(response.data, documentTitle)
      if (success) {
        toast({
          title: "TXT downloaded",
          description: `Your ${getDocumentTypeName(documentType).toLowerCase()} has been downloaded as TXT`,
        })
      } else {
        throw new Error("Failed to download TXT")
      }
    } catch (error: any) {
      handleExportError(error, "TXT")
    } finally {
      setExportingState(documentId, "TXT", false)
    }
  }

  return {
    exportToPDF,
    exportToTXT,
    isExporting,
    isAnyExporting,
  }
}
