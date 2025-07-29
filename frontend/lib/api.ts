import axios from "axios"
import { config } from "./config"

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.apiBaseUrl,
})

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 Unauthorized errors for token expiration
    // Check if it's a token-related error (not a password validation error)
    if (error.response && error.response.status === 401 &&
        (!error.response.data ||
         (error.response.data.message &&
          !error.response.data.message.includes("password")))) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Authentication APIs
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => api.post("/auth/register", userData),

  login: (credentials: { email: string; password: string }) => api.post("/auth/login", credentials),

  getCurrentUser: () => api.get("/auth/me"),

  logout: () => api.get("/auth/logout"),
}

// User Management APIs
export const userAPI = {
  getProfile: () => api.get("/users/profile"),

  updateProfile: (profileData: { name: string; email: string; currentPassword: string }) =>
    api.put("/users/profile", profileData),

  updatePassword: (passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.put("/users/password", passwordData),

  getUsageStats: () => api.get("/users/usage"),
}

// Resume APIs
export const resumeAPI = {
  generateResume: (resumeData: any) => api.post("/generate/resume", resumeData),

  getAllResumes: (page = 1, limit = 10) => api.get(`/generate/resume?page=${page}&limit=${limit}`),

  getResume: (id: string) => api.get(`/generate/resume/${id}`),

  updateResume: (id: string, data: any) => api.put(`/generate/resume/${id}`, data),

  deleteResume: (id: string) => api.delete(`/generate/resume/${id}`),

  exportResumeDocx: (id: string) => api.get(`/export/resume/${id}/docx`, { responseType: "blob" }),

  exportResumeTxt: (id: string) => api.get(`/export/resume/${id}/txt`, { responseType: "blob" }),

  generateResumePdf: (id: string) => api.get(`/pdf/resume/${id}`, { responseType: "blob" }),
}

// Cover Letter APIs
export const coverLetterAPI = {
  generateCoverLetter: (coverLetterData: any) => api.post("/generate/cover-letter", coverLetterData),

  getAllCoverLetters: (page = 1, limit = 10) => api.get(`/generate/cover-letter?page=${page}&limit=${limit}`),

  getCoverLetter: (id: string) => api.get(`/generate/cover-letter/${id}`),

  updateCoverLetter: (id: string, data: any) => api.put(`/generate/cover-letter/${id}`, data),

  deleteCoverLetter: (id: string) => api.delete(`/generate/cover-letter/${id}`),

  exportCoverLetterDocx: (id: string) => api.get(`/export/cover-letter/${id}/docx`, { responseType: "blob" }),

  exportCoverLetterTxt: (id: string) => api.get(`/export/cover-letter/${id}/txt`, { responseType: "blob" }),

  generateCoverLetterPdf: (id: string) => api.get(`/pdf/cover-letter/${id}`, { responseType: "blob" }),
}

// LinkedIn Bio APIs
export const linkedinAPI = {
  generateLinkedInBio: (linkedinData: any) => api.post("/generate/linkedin", linkedinData),

  getAllLinkedInBios: (page = 1, limit = 10) => api.get(`/generate/linkedin?page=${page}&limit=${limit}`),

  getLinkedInBio: (id: string) => api.get(`/generate/linkedin/${id}`),

  updateLinkedInBio: (id: string, data: any) => api.put(`/generate/linkedin/${id}`, data),

  deleteLinkedInBio: (id: string) => api.delete(`/generate/linkedin/${id}`),

  exportLinkedInBioDocx: (id: string) => api.get(`/export/linkedin/${id}/docx`, { responseType: "blob" }),

  exportLinkedInBioTxt: (id: string) => api.get(`/export/linkedin/${id}/txt`, { responseType: "blob" }),

  generateLinkedInBioPdf: (id: string) => api.get(`/pdf/linkedin/${id}`, { responseType: "blob" }),
}

// Payment APIs
export const paymentAPI = {
  getPlans: () => api.get("/payment/plans"),

  createOrder: (planData: { planType: string }) => api.post("/payment/create-order", planData),

  verifyPayment: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planType: string;
  }) => api.post("/payment/verify", paymentData),
}

export default api
