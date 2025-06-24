import { NextResponse } from 'next/server';

export interface APIError {
  success: false;
  error: string;
  message?: string;
  details?: any;
  status?: number;
}

export class APIErrorResponse extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.name = 'APIErrorResponse';
    this.status = status;
    this.details = details;
  }
}

/**
 * Wraps an API route handler with error handling to ensure JSON responses
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Route Error:', error);
      
      // Handle different error types
      if (error instanceof APIErrorResponse) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            details: error.details,
          } as APIError,
          { status: error.status }
        );
      }
      
      if (error instanceof Error) {
        return NextResponse.json(
          {
            success: false,
            error: 'Internal Server Error',
            message: error.message,
          } as APIError,
          { status: 500 }
        );
      }
      
      // Unknown error type
      return NextResponse.json(
        {
          success: false,
          error: 'An unexpected error occurred',
        } as APIError,
        { status: 500 }
      );
    }
  }) as T;
}

/**
 * Standard API success response
 */
export function successResponse<T = any>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

/**
 * Standard API error response
 */
export function errorResponse(error: string, status: number = 500, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    } as APIError,
    { status }
  );
}