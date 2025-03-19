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
 * @param details Optional additional error details or validation errors
 * @returns Formatted error response
 */
export function createErrorResponse(
  code: string | number,
  message: string,
  details?: any,
): ApiErrorResponse {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };

  // Handle validation errors specifically
  if (details && typeof details === 'object') {
    // If details is a validation error object (field -> error messages)
    if (Object.values(details).every((val) => Array.isArray(val))) {
      response.error.fields = details;
    } else {
      response.error.details = details;
    }
  }

  return response;
}
