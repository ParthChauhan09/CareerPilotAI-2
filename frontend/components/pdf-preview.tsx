"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Download, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DocumentType } from "@/lib/types";

interface PDFPreviewProps {
  documentId: string;
  documentType: DocumentType;
  documentTitle?: string;
  className?: string;
}

export function PDFPreview({ 
  documentId, 
  documentType, 
  documentTitle = "Document",
  className = "" 
}: PDFPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const getPreviewUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    
    let endpoint = "";
    switch (documentType) {
      case "resume":
        endpoint = `/api/pdf/resume/${documentId}/preview`;
        break;
      case "coverLetter":
        endpoint = `/api/pdf/cover-letter/${documentId}/preview`;
        break;
      case "linkedin":
        endpoint = `/api/pdf/linkedin/${documentId}/preview`;
        break;
      default:
        throw new Error(`Unknown document type: ${documentType}`);
    }

    return `${baseUrl}${endpoint}?token=${token}`;
  };

  const loadPdfPreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      let endpoint = "";
      
      switch (documentType) {
        case "resume":
          endpoint = `/api/pdf/resume/${documentId}/preview`;
          break;
        case "coverLetter":
          endpoint = `/api/pdf/cover-letter/${documentId}/preview`;
          break;
        case "linkedin":
          endpoint = `/api/pdf/linkedin/${documentId}/preview`;
          break;
        default:
          throw new Error(`Unknown document type: ${documentType}`);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else if (response.status === 404) {
          throw new Error("Document not found");
        } else {
          const errorData = await response.text();
          throw new Error(`Failed to load PDF preview: ${errorData}`);
        }
      }

      // Create blob URL for PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error("PDF preview error:", err);
      setError(err.message || "Failed to load PDF preview");
      toast({
        title: "Preview Error",
        description: err.message || "Failed to load PDF preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdfPreview();
    
    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [documentId, documentType]);

  const handleRetry = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    loadPdfPreview();
  };

  const handleFullscreen = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${documentTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Preview Unavailable</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">PDF Preview</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                title="Open in new tab"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                title="Refresh preview"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {pdfUrl && (
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px]"
                title={`${documentTitle} Preview`}
                style={{ border: 'none' }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
