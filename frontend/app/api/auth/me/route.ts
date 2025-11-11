import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    const { user } = authResult;

    // Connect to database
    await connectDB();

    // Get user data
    const userData = await User.findById(user._id);

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User data retrieved',
      data: {
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          planType: userData.planType,
          usageStats: userData.usageStats,
          createdAt: userData.createdAt,
        },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
