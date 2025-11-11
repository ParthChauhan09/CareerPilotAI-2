import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import serverConfig from '@/lib/server-config';
import { protect } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
	try {
		const auth = await protect(req);
		if (auth instanceof NextResponse) return auth;
		const { planType } = await req.json();
		if (!planType || !serverConfig.plans[planType]) {
			return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
		}
		const plan = serverConfig.plans[planType];

		const razorpay = new Razorpay({
			key_id: serverConfig.razorpay.keyId,
			key_secret: serverConfig.razorpay.keySecret,
		});

		const order = await razorpay.orders.create({
			amount: plan.price * 100,
			currency: plan.currency.toUpperCase(),
			receipt: `rcpt_${Date.now()}`,
			notes: { planType },
		});

		return NextResponse.json({ success: true, message: 'Order created', data: { order } });
	} catch (error: any) {
		return NextResponse.json({ success: false, error: error?.message || 'Order creation failed' }, { status: 500 });
	}
}


