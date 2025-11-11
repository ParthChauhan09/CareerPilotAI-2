import { NextResponse } from 'next/server';

function cleanLatexContent(latexContent: string): string {
	let cleaned = latexContent || '';
	cleaned = cleaned.replace(/```latex\s*/g, '');
	cleaned = cleaned.replace(/```\s*/g, '');
	const start = cleaned.indexOf('\\documentclass');
	if (start > 0) cleaned = cleaned.substring(start);
	const end = cleaned.indexOf('\\end{document}');
	if (end !== -1) cleaned = cleaned.substring(0, end + '\\end{document}'.length);
	return cleaned.trim();
}

export async function compileLatexToPdf(latexContent: string): Promise<Buffer | NextResponse> {
	try {
		const cleaned = cleanLatexContent(latexContent);
		if (!cleaned.includes('\\documentclass')) {
			return NextResponse.json({ success: false, error: 'Invalid LaTeX content' }, { status: 400 });
		}

		const payload = {
			compiler: 'xelatex',
			resources: [{ main: true, content: cleaned }],
		};

		const res = await fetch('https://latex.ytotech.com/builds/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			// 30s timeout via AbortController could be added if necessary
		});

		if (!res.ok) {
			return NextResponse.json(
				{ success: false, error: `LaTeX compilation failed (${res.status})` },
				{ status: 502 }
			);
		}

		const arrayBuffer = await res.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (err: any) {
		return NextResponse.json({ success: false, error: err?.message || 'PDF generation error' }, { status: 500 });
	}
}


