import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleError } from '@/lib/middleware/errorHandler';

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Generate token
    const token = user.getSignedJwtToken();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          planType: user.planType,
        },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
