import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resume from '@/models/Resume';
import { protect, checkPdfPermission } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';
import { compileLatexToPdf } from '@/lib/pdf/latexToPdf';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		const perm = checkPdfPermission(user);
		if (perm) return perm;

		await connectDB();
		const doc = await Resume.findOne({ _id: params.id, user: user._id });
	if (!doc) {
			return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
		}

		const pdf = await compileLatexToPdf(doc.resultText);
		if (pdf instanceof NextResponse) return pdf;

		return new NextResponse(pdf, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `inline; filename="${doc.title || 'resume'}.pdf"`,
				'Cache-Control': 'no-store',
			},
		});
	} catch (error) {
		return handleError(error);
	}
}


