import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Global interceptor to standardize API responses
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
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),

      // Transform errors
      catchError((error) => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorResponse;

        // Handle validation errors specifically
        if (
          error instanceof BadRequestException &&
          error.getResponse() &&
          typeof error.getResponse() === 'object'
        ) {
          const response = error.getResponse() as any;
          
          if (response.errors && typeof response.errors === 'object') {
            // This is a validation error with field details
            errorResponse = {
              success: false,
              error: {
                code: 400,
                message: response.message || 'Validation failed',
                fields: response.errors
              },
              timestamp: new Date().toISOString()
            };
            
            return throwError(() => new HttpException(errorResponse, 400));
          }
        }
        
        // Handle other HttpExceptions
        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();

          if (typeof response === 'object' && response !== null) {
            // Check if it's already our format
            if (response['success'] === false && response['error']) {
              return throwError(() => error);
            }
            
            message = response['message'] || error.message;
          } else {
            message = response as string || error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }

        // Create standardized error response for non-validation errors
        errorResponse = {
          success: false,
          error: {
            code: status,
            message: message
          },
          timestamp: new Date().toISOString()
        };

        // Return the error response
        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}
