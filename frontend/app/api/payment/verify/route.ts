import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import serverConfig from '@/lib/server-config';
import { protect } from '@/lib/middleware/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { user } = auth;
		const body = await req.json();
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = body;

		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
			return NextResponse.json({ success: false, error: 'Missing verification fields' }, { status: 400 });
		}
		if (!serverConfig.plans[planType]) {
			return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
		}

		const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
		const expected = crypto
			.createHmac('sha256', serverConfig.razorpay.keySecret)
			.update(signatureBody)
			.digest('hex');

		if (expected !== razorpay_signature) {
			return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
		}

		// Optionally verify payment with Razorpay API
		const razorpay = new Razorpay({
			key_id: serverConfig.razorpay.keyId,
			key_secret: serverConfig.razorpay.keySecret,
		});
		await razorpay.payments.fetch(razorpay_payment_id);

		await connectDB();
		await User.findByIdAndUpdate(user._id, { planType });

		return NextResponse.json({ success: true, message: 'Payment verified and plan updated' });
	} catch (error: any) {
		return NextResponse.json({ success: false, error: error?.message || 'Verification failed' }, { status: 500 });
	}
}


