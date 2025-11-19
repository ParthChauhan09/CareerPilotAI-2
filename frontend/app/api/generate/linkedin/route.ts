import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LinkedInBio from '@/models/LinkedInBio';
import { protect, checkUsageLimit } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';
import { generateLinkedInBio, getLinkedInBioFallback } from '@/lib/services/geminiService';

/**
 * @desc    Create a new LinkedIn bio
 * @route   POST /api/generate/linkedin
 * @access  Private
 */
export async function POST(req: NextRequest) {
    try {
        const auth = await protect(req);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        const limitCheck = checkUsageLimit(user, 'linkedin');
        if (limitCheck) return limitCheck;

        await connectDB();

        const { title, promptData } = await req.json();
        if (!title || !promptData) {
            return NextResponse.json(
                { success: false, error: 'Title and prompt data are required' },
                { status: 400 }
            );
        }

        // Generate LinkedIn bio content using Gemini service
        let bioContent: string;
        try {
            bioContent = await generateLinkedInBio(promptData, user);
        } catch (geminiError) {
            console.error('Gemini generation failed, using fallback:', geminiError);
            // Use fallback generator if Gemini fails
            bioContent = getLinkedInBioFallback(promptData.profile || {});
        }

        if (!bioContent) {
            return NextResponse.json(
                { success: false, error: 'Failed to generate LinkedIn bio content' },
                { status: 500 }
            );
        }

        const doc = await LinkedInBio.create({
            user: user._id,
            title,
            promptData,
            resultText: bioContent,
        });

        await user.incrementUsage('linkedin');

        return NextResponse.json(
            {
                success: true,
                message: 'LinkedIn bio created',
                data: {
                    id: doc._id,
                    title: doc.title,
                    promptData: doc.promptData,
                    resultText: doc.resultText,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error as any);
    }
}

/**
 * @desc    Get LinkedIn bios for current user (paginated)
 * @route   GET /api/generate/linkedin
 * @access  Private
 */
export async function GET(req: NextRequest) {
    try {
        const auth = await protect(req);
        if (auth instanceof NextResponse) return auth;
        const { user } = auth;

        await connectDB();

        const { searchParams } = req.nextUrl;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const startIndex = (page - 1) * limit;

        const total = await LinkedInBio.countDocuments({ user: user._id });
        const items = await LinkedInBio.find({ user: user._id })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const mapped = items.map((d) => ({
            id: d._id,
            title: d.title,
            promptData: d.promptData,
            resultText: d.resultText,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
        }));

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            message: 'LinkedIn bios retrieved',
            data: mapped,
            linkedinBios: mapped,
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
        return handleError(error as any);
    }
}


