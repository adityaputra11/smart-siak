import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter to standardize error responses
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // If the response is already in our standard format, return it as is
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'success' in exceptionResponse &&
      exceptionResponse['success'] === false &&
      'error' in exceptionResponse
    ) {
      return response.status(status).json(exceptionResponse);
    }

    // Handle validation errors from class-validator
    if (exception instanceof BadRequestException) {
      const badRequestResponse = exceptionResponse as any;
      
      if (
        typeof badRequestResponse === 'object' &&
        badRequestResponse !== null &&
        'errors' in badRequestResponse
      ) {
        const errorResponse = {
          success: false,
          error: {
            code: status,
            message: badRequestResponse.message || 'Validation failed',
            fields: badRequestResponse.errors
          },
          timestamp: new Date().toISOString()
        };
        
        return response.status(status).json(errorResponse);
      }
    }

    // For other types of errors, create a standard response
    let message = 'Internal server error';
    
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = exceptionResponse['message'] || exception.message;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const errorResponse = {
      success: false,
      error: {
        code: status,
        message: message
      },
      timestamp: new Date().toISOString()
    };

    response.status(status).json(errorResponse);
  }
}
