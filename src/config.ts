// API Configuration
// 
// For Production: Set VITE_API_URL environment variable to your backend URL
// Example: VITE_API_URL=https://ai-tour-guide-backend.onrender.com
//
// For Local Development: Leave VITE_API_URL unset to use http://localhost:5001
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  TOUR_PLAN: `${API_BASE_URL}/api/tour-plan`,
} as const;

