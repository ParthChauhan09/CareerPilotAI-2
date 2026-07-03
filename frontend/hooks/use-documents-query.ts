import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeAPI, coverLetterAPI, linkedinAPI } from "@/lib/api";
import type { DocumentType, Resume, CoverLetter, LinkedInBio } from "@/lib/types";

// Keys
export const queryKeys = {
  resumes: ["resumes"] as const,
  coverLetters: ["coverLetters"] as const,
  linkedinBios: ["linkedinBios"] as const,
  document: (type: string, id: string) => ["document", type, id] as const,
};

// Hook to get resumes
export function useResumes() {
  return useQuery<Resume[]>({
    queryKey: queryKeys.resumes,
    queryFn: async () => {
      const res = await resumeAPI.getAllResumes();
      return res.data.resumes || res.data.data || [];
    },
  });
}

// Hook to get cover letters
export function useCoverLetters() {
  return useQuery<CoverLetter[]>({
    queryKey: queryKeys.coverLetters,
    queryFn: async () => {
      const res = await coverLetterAPI.getAllCoverLetters();
      return res.data.coverLetters || res.data.data || [];
    },
  });
}

// Hook to get LinkedIn bios
export function useLinkedInBios() {
  return useQuery<LinkedInBio[]>({
    queryKey: queryKeys.linkedinBios,
    queryFn: async () => {
      const res = await linkedinAPI.getAllLinkedInBios();
      return res.data.linkedinBios || res.data.data || [];
    },
  });
}

// Hook to get a single document
export function useDocument(type: DocumentType, id: string) {
  return useQuery({
    queryKey: queryKeys.document(type, id),
    queryFn: async () => {
      let response;
      if (type === "resume") {
        response = await resumeAPI.getResume(id);
      } else if (type === "coverLetter") {
        response = await coverLetterAPI.getCoverLetter(id);
      } else if (type === "linkedin") {
        response = await linkedinAPI.getLinkedInBio(id);
      } else {
        throw new Error(`Unknown document type: ${type}`);
      }

      // Extract document data
      let documentData = null;
      if (response?.data?.resume) {
        documentData = response.data.resume;
      } else if (response?.data?.coverLetter) {
        documentData = response.data.coverLetter;
      } else if (response?.data?.linkedinBio) {
        documentData = response.data.linkedinBio;
      } else if (response?.data) {
        documentData = response.data;
        if (type === "coverLetter" && !documentData.resultText && !documentData.coverLetter) {
          documentData = { coverLetter: documentData };
        }
      }
      if (!documentData) {
        throw new Error("No document data found");
      }
      return documentData;
    },
    enabled: !!id && !!type,
  });
}

// Hook to create a document
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, data }: { type: DocumentType; data: any }) => {
      if (type === "resume") {
        return resumeAPI.generateResume(data);
      } else if (type === "coverLetter") {
        return coverLetterAPI.generateCoverLetter(data);
      } else if (type === "linkedin") {
        return linkedinAPI.generateLinkedInBio(data);
      }
      throw new Error(`Unknown document type: ${type}`);
    },
    onSuccess: (data, variables) => {
      // Invalidate target collections
      if (variables.type === "resume") {
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes });
      } else if (variables.type === "coverLetter") {
        queryClient.invalidateQueries({ queryKey: queryKeys.coverLetters });
      } else if (variables.type === "linkedin") {
        queryClient.invalidateQueries({ queryKey: queryKeys.linkedinBios });
      }
    },
  });
}

// Hook to update a document
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      id,
      data,
    }: {
      type: DocumentType;
      id: string;
      data: any;
    }) => {
      if (type === "resume") {
        return resumeAPI.updateResume(id, data);
      } else if (type === "coverLetter") {
        return coverLetterAPI.updateCoverLetter(id, data);
      } else if (type === "linkedin") {
        return linkedinAPI.updateLinkedInBio(id, data);
      }
      throw new Error(`Unknown document type: ${type}`);
    },
    onSuccess: (data, variables) => {
      // Invalidate target document
      queryClient.invalidateQueries({
        queryKey: queryKeys.document(variables.type, variables.id),
      });
      // Invalidate collections
      if (variables.type === "resume") {
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes });
      } else if (variables.type === "coverLetter") {
        queryClient.invalidateQueries({ queryKey: queryKeys.coverLetters });
      } else if (variables.type === "linkedin") {
        queryClient.invalidateQueries({ queryKey: queryKeys.linkedinBios });
      }
    },
  });
}

// Hook to delete a document
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, id }: { type: DocumentType; id: string }) => {
      if (type === "resume") {
        return resumeAPI.deleteResume(id);
      } else if (type === "coverLetter") {
        return coverLetterAPI.deleteCoverLetter(id);
      } else if (type === "linkedin") {
        return linkedinAPI.deleteLinkedInBio(id);
      }
      throw new Error(`Unknown document type: ${type}`);
    },
    onSuccess: (data, variables) => {
      // Invalidate target document
      queryClient.invalidateQueries({
        queryKey: queryKeys.document(variables.type, variables.id),
      });
      // Invalidate collections
      if (variables.type === "resume") {
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes });
      } else if (variables.type === "coverLetter") {
        queryClient.invalidateQueries({ queryKey: queryKeys.coverLetters });
      } else if (variables.type === "linkedin") {
        queryClient.invalidateQueries({ queryKey: queryKeys.linkedinBios });
      }
    },
  });
}
