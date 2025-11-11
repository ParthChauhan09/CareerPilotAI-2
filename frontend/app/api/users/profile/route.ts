import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

export async function GET(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		await connectDB();
		const u = await User.findById(user._id);
		if (!u) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		return NextResponse.json({
			success: true,
			message: 'User profile retrieved',
			data: { user: { id: u._id, name: u.name, email: u.email, planType: u.planType, createdAt: u.createdAt } },
		});
	} catch (error) {
		return handleError(error);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;

		await connectDB();
		const { name, email } = await req.json();
		const update: any = {};
		if (name) update.name = name;
		if (email) {
			const existing = await User.findOne({ email });
			if (existing && String(existing._id) !== String(user._id)) {
				return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
			}
			update.email = email;
		}
		const updated = await User.findByIdAndUpdate(user._id, update, { new: true, runValidators: true });
		if (!updated) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		return NextResponse.json({
			success: true,
			message: 'User profile updated',
			data: { user: { id: updated._id, name: updated.name, email: updated.email, planType: updated.planType } },
		});
	} catch (error) {
		return handleError(error);
	}
}


