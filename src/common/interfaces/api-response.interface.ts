/**
 * Standard API response interface for success responses
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Standard API response interface for error responses
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string | number;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Combined type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
