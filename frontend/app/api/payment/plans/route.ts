import { NextResponse } from 'next/server';
import serverConfig from '@/lib/server-config';

export async function GET() {
	return NextResponse.json({
		success: true,
		message: 'Plans retrieved',
		data: {
			plans: serverConfig.plans,
		},
	});
}


