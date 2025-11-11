import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LinkedInBio from '@/models/LinkedInBio';
import { protect, checkDocxExportPermission } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		const perm = checkDocxExportPermission(user);
		if (perm) return perm;

		await connectDB();
		const model = await LinkedInBio.findOne({ _id: params.id, user: user._id });
		if (!model) {
			return NextResponse.json({ success: false, error: 'LinkedIn bio not found' }, { status: 404 });
		}

		const doc = new Document({
			sections: [
				{
					children: [
						new Paragraph({ children: [new TextRun({ text: model.title || 'LinkedIn Bio', bold: true })] }),
						new Paragraph({}),
						new Paragraph({ children: [new TextRun(model.resultText || '')] }),
					],
				},
			],
		});
		const buffer = await Packer.toBuffer(doc);
		return new NextResponse(buffer, {
			status: 200,
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'Content-Disposition': `attachment; filename="${model.title || 'linkedin-bio'}.docx"`,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}


