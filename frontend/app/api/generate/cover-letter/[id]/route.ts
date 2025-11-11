import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CoverLetter from '@/models/CoverLetter';
import { protect } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

/**
 * @desc    Get a single cover letter
 * @route   GET /api/generate/cover-letter/:id
 * @access  Private
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		await connectDB();
		const doc = await CoverLetter.findOne({ _id: params.id, user: user._id });
		if (!doc) {
			return NextResponse.json({ success: false, error: 'Cover letter not found' }, { status: 404 });
		}
		return NextResponse.json({
			success: true,
			message: 'Cover letter retrieved',
			data: {
				id: doc._id,
				title: doc.title,
				promptData: doc.promptData,
				resultText: doc.resultText,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}

/**
 * @desc    Update a cover letter
 * @route   PUT /api/generate/cover-letter/:id
 * @access  Private
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		await connectDB();
		const { title, promptData, resultText } = await req.json();
		const update: any = {};
		if (title !== undefined) update.title = title;
		if (promptData !== undefined) update.promptData = promptData;
		if (resultText !== undefined) update.resultText = resultText;

		const doc = await CoverLetter.findOneAndUpdate(
			{ _id: params.id, user: user._id },
			update,
			{ new: true, runValidators: true }
		);
		if (!doc) {
			return NextResponse.json({ success: false, error: 'Cover letter not found' }, { status: 404 });
		}
		return NextResponse.json({
			success: true,
			message: 'Cover letter updated',
			data: {
				id: doc._id,
				title: doc.title,
				promptData: doc.promptData,
				resultText: doc.resultText,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}

/**
 * @desc    Delete a cover letter
 * @route   DELETE /api/generate/cover-letter/:id
 * @access  Private
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		await connectDB();
		const deleted = await CoverLetter.findOneAndDelete({ _id: params.id, user: user._id });
		if (!deleted) {
			return NextResponse.json({ success: false, error: 'Cover letter not found' }, { status: 404 });
		}
		return NextResponse.json({ success: true, message: 'Cover letter deleted' });
	} catch (error) {
		return handleError(error);
	}
}


