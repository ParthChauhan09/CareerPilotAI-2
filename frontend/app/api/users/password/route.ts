import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { protect } from '@/lib/middleware/auth';
import { handleError } from '@/lib/middleware/errorHandler';

export async function PUT(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		const { currentPassword, newPassword, confirmPassword } = await req.json();

		if (!currentPassword || !newPassword || !confirmPassword) {
			return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
		}
		if (newPassword !== confirmPassword) {
			return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
		}
		await connectDB();
		const u = await User.findById(user._id).select('+password');
		if (!u) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
		const isMatch = await u.matchPassword(currentPassword);
		if (!isMatch) {
			return NextResponse.json({ success: false, error: 'Invalid current password' }, { status: 400 });
		}
		u.password = newPassword;
		await u.save();
		return NextResponse.json({ success: true, message: 'Password updated successfully' });
	} catch (error) {
		return handleError(error);
	}
}


