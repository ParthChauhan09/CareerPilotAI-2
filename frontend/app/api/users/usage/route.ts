import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/middleware/auth';
import serverConfig from '@/lib/server-config';
import { handleError } from '@/lib/middleware/errorHandler';

export async function GET(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		await connectDB();
		const u = await User.findById(user._id);
		if (!u) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		const plan = serverConfig.plans[u.planType];
		return NextResponse.json({
			success: true,
			message: 'Usage retrieved',
			data: {
				usageStats: u.usageStats,
				limits: {
					resumeGenerations: plan.features.resumeGenerations,
					coverLetterGenerations: plan.features.coverLetterGenerations,
					linkedinGenerations: plan.features.linkedinGenerations,
				},
			},
		});
	} catch (error) {
		return handleError(error);
	}
}


