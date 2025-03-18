import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  createSuccessResponse,
  createErrorResponse,
} from '../utils/response.util';

/**
 * Global interceptor to standardize API responses
 * Wraps successful responses in a standard format
 * Transforms errors into a standard error response format
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // Transform successful responses
      map((data) => {
        // If the response is already formatted, return it as is
        if (data && (data.success === true || data.success === false)) {
          return data;
        }

        // Format the response
        return createSuccessResponse(data);
      }),

      // Transform errors
      catchError((error) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details = undefined;

        // Handle HttpExceptions
        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();

          if (typeof response === 'object' && response !== null) {
            message = response['message'] || error.message;
            details = response['error'] || undefined;
          } else {
            message = error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
          details = error.stack;
        }

        // Create standardized error response
        const errorResponse = createErrorResponse(status, message, details);

        // Return the error response
        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}
