"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileDown, Loader2 } from "lucide-react"
import { useExport } from "@/hooks/use-export"
import type { DocumentType } from "@/lib/types"

interface ExportDropdownProps {
  documentId: string
  documentType: DocumentType
  documentTitle: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showLabel?: boolean
}

export function ExportDropdown({
  documentId,
  documentType,
  documentTitle,
  variant = "outline",
  size = "sm",
  className = "",
  showLabel = true
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { exportToPDF, exportToDOCX, exportToTXT, isExporting } = useExport()

  const isPdfExporting = isExporting(documentId, "PDF")
  const isDocxExporting = isExporting(documentId, "DOCX")
  const isTxtExporting = isExporting(documentId, "TXT")
  const isAnyFormatExporting = isPdfExporting || isDocxExporting || isTxtExporting

  const handleExportPDF = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    
    await exportToPDF({
      documentId,
      documentType,
      documentTitle
    })
  }

  const handleExportDOCX = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    
    await exportToDOCX({
      documentId,
      documentType,
      documentTitle
    })
  }

  const handleExportTXT = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    
    await exportToTXT({
      documentId,
      documentType,
      documentTitle
    })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`gap-2 ${className}`}
          disabled={isAnyFormatExporting}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {isAnyFormatExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {showLabel && (
            <span>{isAnyFormatExporting ? "Exporting..." : "Export"}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem
          onClick={handleExportPDF}
          disabled={isPdfExporting}
          className="cursor-pointer"
        >
          {isPdfExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
          ) : (
            <FileText className="mr-2 h-4 w-4 text-red-600" />
          )}
          {isPdfExporting ? "Exporting PDF..." : "Export as PDF"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportDOCX}
          disabled={isDocxExporting}
          className="cursor-pointer"
        >
          {isDocxExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
          ) : (
            <FileDown className="mr-2 h-4 w-4 text-blue-600" />
          )}
          {isDocxExporting ? "Exporting DOCX..." : "Export as DOCX"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleExportTXT}
          disabled={isTxtExporting}
          className="cursor-pointer"
        >
          {isTxtExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-600" />
          ) : (
            <FileDown className="mr-2 h-4 w-4 text-gray-600" />
          )}
          {isTxtExporting ? "Exporting TXT..." : "Export as TXT"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}