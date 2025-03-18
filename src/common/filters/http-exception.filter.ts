import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorResponse } from '../utils/response.util';

/**
 * Global exception filter to standardize error responses
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Get the exception response
    const exceptionResponse = exception.getResponse();

    // Check if the response is already in our standard format
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'success' in exceptionResponse &&
      exceptionResponse['success'] === false
    ) {
      // Response is already formatted, return it as is
      return response.status(status).json(exceptionResponse);
    }

    // Extract message and details from the exception
    let message = 'Internal server error';
    let details = undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = exceptionResponse['message'] || exception.message;
      details = exceptionResponse['error'] || undefined;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    // Create a standardized error response
    const errorResponse = createErrorResponse(
      status,
      message,
      details
        ? details
        : {
            path: request.url,
            method: request.method,
          },
    );

    // Send the response
    response.status(status).json(errorResponse);
  }
}
