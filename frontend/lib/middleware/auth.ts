import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import serverConfig from '@/lib/server-config';
import connectDB from '@/lib/db';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

/**
 * Protect routes - Middleware to verify JWT token and attach user to request
 */
export async function protect(req: NextRequest): Promise<{ user: any } | NextResponse> {
  let token: string | undefined;

  // Check if token exists in headers
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = authHeader.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: 'Not authorized to access this route',
      },
      { status: 401 }
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, serverConfig.jwt.secret) as { id: string };

    // Connect to DB
    await connectDB();

    // Attach user to request
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 401 }
      );
    }

    return { user };
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Not authorized to access this route',
      },
      { status: 401 }
    );
  }
}

/**
 * Check if user has reached usage limits for a specific generation type
 * @param {any} user - User object
 * @param {string} generationType - Type of generation (resume, coverLetter, linkedin)
 */
export function checkUsageLimit(user: any, generationType: string): NextResponse | null {
  try {
    // Skip check for premium users
    if (user.planType === 'premium') {
      return null;
    }

    // Check if user has reached their limit
    if (user.hasReachedLimit(generationType)) {
      return NextResponse.json(
        {
          success: false,
          error: `You have reached your ${generationType} generation limit. Please upgrade your plan.`,
        },
        { status: 403 }
      );
    }

    return null;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error checking usage limits',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if user's plan allows DOCX exports
 */
export function checkDocxExportPermission(user: any): NextResponse | null {
  try {
    // Check if user's plan allows DOCX export
    if (!user.canUseExportFormat('docx')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'DOCX export is only available for Basic and Premium plans. Please upgrade your plan.',
        },
        { status: 403 }
      );
    }

    return null;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error checking export permissions',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if user's plan allows PDF generation
 */
export function checkPdfPermission(user: any): NextResponse | null {
  try {
    // Check if user's plan allows PDF export
    if (!user.canUseExportFormat('pdf')) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF export is only available for paid plans. Please upgrade your plan.',
        },
        { status: 403 }
      );
    }

    return null;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error checking PDF permissions',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if user's plan allows TXT exports
 */
export function checkTxtExportPermission(user: any): NextResponse | null {
  try {
    // Check if user's plan allows TXT export
    if (!user.canUseExportFormat('txt')) {
      return NextResponse.json(
        {
          success: false,
          error: 'TXT export is only available for paid plans. Please upgrade your plan.',
        },
        { status: 403 }
      );
    }

    return null;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error checking export permissions',
      },
      { status: 500 }
    );
  }
}
