import { NextResponse } from 'next/server';

interface ErrorWithCode extends Error {
  code?: number;
  statusCode?: number;
  errors?: any;
}

/**
 * Error handling utility for Next.js API routes
 */
export function handleError(err: ErrorWithCode) {
  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 500;

  // Log error for development
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors || {}).map((val: any) => val.message).join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // OpenAI/Gemini API errors
  if (err.name === 'OpenAIError' || err.name === 'GoogleGenerativeAIError') {
    message = err.message || 'Error with AI generation';
    statusCode = err.statusCode || 500;
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: statusCode }
  );
}

/**
 * Async error handler wrapper for API routes
 */
export function asyncHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error as ErrorWithCode);
    }
  };
}
