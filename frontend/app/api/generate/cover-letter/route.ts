import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CoverLetter from '@/models/CoverLetter';
import { protect, checkUsageLimit } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';
import { generateCoverLetter, getCoverLetterFallback } from '@/lib/services/geminiService';

/**
 * @desc    Create a new cover letter
 * @route   POST /api/generate/cover-letter
 * @access  Private
 */
export async function POST(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		const limitCheck = checkUsageLimit(user, 'coverLetter');
		if (limitCheck) return limitCheck;

		await connectDB();

		const { title, promptData } = await req.json();
		if (!title || !promptData) {
			return NextResponse.json(
				{ success: false, error: 'Title and prompt data are required' },
				{ status: 400 }
			);
		}

		// Generate cover letter LaTeX content using Gemini service
		let resultText: string;
		try {
			resultText = await generateCoverLetter(promptData, user);
		} catch (geminiError) {
			console.error('Gemini generation failed, using fallback:', geminiError);
			// Use fallback generator if Gemini fails
			resultText = getCoverLetterFallback(promptData);
		}

		if (!resultText || !resultText.includes('\\documentclass')) {
			return NextResponse.json(
				{ success: false, error: 'Failed to generate valid LaTeX content' },
				{ status: 500 }
			);
		}

		const coverLetter = await CoverLetter.create({
			user: user._id,
			title,
			promptData,
			resultText,
		});

		await user.incrementUsage('coverLetter');

		return NextResponse.json(
			{
				success: true,
				message: 'Cover letter created',
				data: {
					id: coverLetter._id,
					title: coverLetter.title,
					promptData: coverLetter.promptData,
					resultText: coverLetter.resultText,
					createdAt: coverLetter.createdAt,
					updatedAt: coverLetter.updatedAt,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleError(error);
	}
}

/**
 * @desc    Get cover letters for current user (paginated)
 * @route   GET /api/generate/cover-letter
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

		const total = await CoverLetter.countDocuments({ user: user._id });
		const items = await CoverLetter.find({ user: user._id })
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
			message: 'Cover letters retrieved',
			data: mapped,
			coverLetters: mapped,
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


