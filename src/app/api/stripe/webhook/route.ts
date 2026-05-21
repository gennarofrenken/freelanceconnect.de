import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import {
  STRIPE_WEBHOOK_SECRET,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripe";

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = new Set<string>(["trialing", "active"]);

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe nicht konfiguriert." }, { status: 500 });
  }
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe-Client fehlt." }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Signatur fehlt." }, { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: `Webhook-Signatur ungültig: ${message}` }, { status: 400 });
  }

  if (!SERVICE_ROLE || !SB_URL) {
    return NextResponse.json({ error: "Supabase Service-Role fehlt." }, { status: 500 });
  }

  const admin = createClient(SB_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        (session.metadata?.supabase_user_id as string | undefined) ?? null;
      const customerId = (session.customer as string | null) ?? null;
      const subscriptionId = (session.subscription as string | null) ?? null;
      if (userId) {
        await admin
          .from("profiles")
          .update({
            has_freelancer_premium: true,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("id", userId);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId =
        (sub.metadata?.supabase_user_id as string | undefined) ??
        null;
      const isActive = ACTIVE_STATUSES.has(sub.status);
      const target = userId
        ? admin.from("profiles").update({
            has_freelancer_premium: isActive,
            stripe_subscription_id: sub.id,
          }).eq("id", userId)
        : admin.from("profiles").update({
            has_freelancer_premium: isActive,
            stripe_subscription_id: sub.id,
          }).eq("stripe_customer_id", sub.customer as string);
      await target;
      break;
    }
    default:
      // Ignore other event types
      break;
  }

  return NextResponse.json({ received: true });
}
