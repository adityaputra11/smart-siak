import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../interfaces/api-response.interface';

/**
 * Creates a standardized success response
 * @param data The data to include in the response
 * @param message Optional success message
 * @returns Formatted success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized error response
 * @param code Error code or status code
 * @param message Error message
 * @param details Optional additional error details
 * @returns Formatted error response
 */
export function createErrorResponse(
  code: string | number,
  message: string,
  details?: any,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
