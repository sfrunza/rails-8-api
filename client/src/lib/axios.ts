
import axios from 'axios'
// import { toast } from 'sonner'

// Interface for a generic API error (for non-validation cases)
// interface ApiError {
//   error: string;
// }

interface ApiError {
  error?: string;
  errors?: string[];
  base?: string[];
}

// Interface for Rails validation errors
// interface ValidationError {
//   [field: string]: string[]; // e.g., { name: ["can't be blank"], email: ["is invalid"] }
// }

// declare module 'axios' {
//   export interface AxiosRequestConfig {
//     silent?: boolean;
//   }
// }

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// api.interceptors.response.use(
//   (res) => res,
//   (error: AxiosError) => {
//     if (!error.response) {
//       toast.error('Network error')
//       return Promise.reject(error)
//     }
//     return Promise.reject(error)
//   }
// )

// api.interceptors.response.use(
//   (res) => res,
//   (error: unknown) => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       // localStorage.removeItem('auth-store');
//       // window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   },
// );

// Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   (error) => {
//     const config = error.config;

//     if (axios.isAxiosError(error) && error.response) {
//       const status = error.response.status;
//       const data = error.response.data;

//       // ✅ Skip toast if the request was marked as silent
//       if (config?.silent) {
//         return Promise.reject(error);
//       }

//       if (status === 422 && data) {
//         // Handle validation errors
//         const validationErrors = data as ValidationError;
//         const errorMessage = Object.entries(validationErrors)
//           .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
//           .join('; ');

//         toast.error(errorMessage)
//         return Promise.reject(new Error(errorMessage));
//       } else if (data.error) {
//         // Handle generic API errors
//         const apiError = data as ApiError;
//         toast.error(apiError.error)
//         return Promise.reject(new Error(apiError.error));
//       }
//     }
//     toast.error('Network or unexpected error')
//     return Promise.reject(new Error('Network or unexpected error'));
//   }
// );

// export default api



export function extractError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.error) return data.error;
    if (data?.errors?.length) return data.errors.join(', ');
    if (data?.base?.length) return data.base.join(', ');
    return error.message;
  }
  return 'An unexpected error occurred';
}
