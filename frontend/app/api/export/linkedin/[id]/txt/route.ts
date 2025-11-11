import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LinkedInBio from '@/models/LinkedInBio';
import { protect, checkTxtExportPermission } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		const perm = checkTxtExportPermission(user);
		if (perm) return perm;

		await connectDB();
		const doc = await LinkedInBio.findOne({ _id: params.id, user: user._id });
		if (!doc) {
			return NextResponse.json({ success: false, error: 'LinkedIn bio not found' }, { status: 404 });
		}
		const text = doc.resultText || '';
		return new NextResponse(text, {
			status: 200,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Content-Disposition': `attachment; filename="${doc.title || 'linkedin-bio'}.txt"`,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}


