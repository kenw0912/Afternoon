import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook Error", { status: 400 });
  }

  // ✅ 付款成功
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userEmail = session.customer_email;

    console.log("💰 Payment success:", userEmail);

    // 👉 TODO：這裡要加 credits（下一步我幫你寫）
  }

  return new Response("ok", { status: 200 });
}