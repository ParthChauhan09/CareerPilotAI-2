import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resume from '@/models/Resume';
import { protect, checkUsageLimit } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';
import { generateResume, getResumeFallback } from '@/lib/services/geminiService';

/**
 * @desc    Generate a new resume
 * @route   POST /api/generate/resume
 * @access  Private
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Check usage limits
    const limitCheck = checkUsageLimit(user, 'resume');
    if (limitCheck) return limitCheck;

    // Connect to database
    await connectDB();

    const { title, promptData } = await req.json();

    // Validate required fields
    if (!title || !promptData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and prompt data are required',
        },
        { status: 400 }
      );
    }

    // Generate resume LaTeX content using Gemini service
    let resultText: string;
    try {
      resultText = await generateResume(promptData, user);
    } catch (geminiError) {
      console.error('Gemini generation failed, using fallback:', geminiError);
      // Use fallback generator if Gemini fails
      resultText = getResumeFallback(promptData);
    }

    // Validate LaTeX content
    if (!resultText || !resultText.includes('\\documentclass')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate valid LaTeX content',
        },
        { status: 500 }
      );
    }

    // Create resume in database
    const resume = await Resume.create({
      user: user._id,
      title,
      promptData,
      resultText,
    });

    // Increment user's usage counter
    await user.incrementUsage('resume');

    // Transform resume data
    const transformedResume = {
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Resume generated successfully',
        data: { resume: transformedResume },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

/**
 * @desc    Get all resumes for a user
 * @route   GET /api/generate/resume
 * @access  Private
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await protect(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Connect to database
    await connectDB();

    // Get pagination params
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const startIndex = (page - 1) * limit;

    // Get total count
    const total = await Resume.countDocuments({ user: user._id });

    // Get resumes with pagination
    const resumes = await Resume.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Transform resume data
    const transformedResumes = resumes.map((resume) => ({
      id: resume._id,
      title: resume.title,
      promptData: resume.promptData,
      resultText: resume.resultText,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'Resumes retrieved successfully',
      data: transformedResumes,
      resumes: transformedResumes,
      pagination: {
        total,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
