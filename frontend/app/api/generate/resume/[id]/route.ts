import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resume from '@/models/Resume';
import { protect } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

/**
 * @desc    Get a single resume
 * @route   GET /api/generate/resume/:id
 * @access  Private
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Connect to database
    await connectDB();

    const resume = await Resume.findById(params.id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      );
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authorized to access this resume',
        },
        { status: 401 }
      );
    }

    // Transform resume data
    const transformedResume = {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Resume retrieved successfully',
      data: { resume: transformedResume },
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * @desc    Update a resume
 * @route   PUT /api/generate/resume/:id
 * @access  Private
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Connect to database
    await connectDB();

    let resume = await Resume.findById(params.id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      );
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authorized to update this resume',
        },
        { status: 401 }
      );
    }

    const { title, resultText } = await req.json();

    // Update resume
    resume = await Resume.findByIdAndUpdate(
      params.id,
      { title, resultText },
      { new: true, runValidators: true }
    );

    // Transform resume data
    const transformedResume = {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Resume updated successfully',
      data: { resume: transformedResume },
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * @desc    Delete a resume
 * @route   DELETE /api/generate/resume/:id
 * @access  Private
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Connect to database
    await connectDB();

    const resume = await Resume.findById(params.id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      );
    }

    // Check if the resume belongs to the user
    if (resume.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authorized to delete this resume',
        },
        { status: 401 }
      );
    }

    await Resume.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
      data: {},
    });
  } catch (error) {
    return handleError(error);
  }
}
