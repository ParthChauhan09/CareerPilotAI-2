import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resume from '@/models/Resume';
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
		const docModel = await Resume.findOne({ _id: params.id, user: user._id });
		if (!docModel) {
			return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
		}

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [new TextRun({ text: docModel.title || 'Resume', bold: true })],
						}),
						new Paragraph({}),
						new Paragraph({ children: [new TextRun('Content (LaTeX stored):')] }),
						new Paragraph({ children: [new TextRun(docModel.resultText || '')] }),
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
				'Content-Disposition': `attachment; filename="${docModel.title || 'resume'}.docx"`,
			},
		});
	} catch (error) {
		return handleError(error);
	}
}


