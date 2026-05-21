import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  SITE_URL,
  STRIPE_PRICE_PRO,
  getStripe,
  isStripeConfigured,
} from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Stripe nicht konfiguriert (STRIPE_SECRET_KEY / STRIPE_PRICE_CONNECT_PRO fehlen)." },
      { status: 500 },
    );
  }
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase nicht konfiguriert." }, { status: 500 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Auth-Client nicht verfügbar." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
  }

  // Stripe customer aus profiles laden bzw. anlegen
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, stripe_customer_id, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "freelancer") {
    return NextResponse.json(
      { error: "Connect Pro ist nur für Freelancer-Konten verfügbar." },
      { status: 403 },
    );
  }

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe-Client fehlt." }, { status: 500 });

  let customerId = profile.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? profile.email ?? undefined,
      name: profile.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    // Service-Role-Update, damit RLS nicht im Weg ist
    if (SERVICE_ROLE && SB_URL) {
      const admin = createClient(SB_URL, SERVICE_ROLE, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      await admin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_PRO, quantity: 1 }],
    success_url: `${SITE_URL}/dashboard?upgraded=1`,
    cancel_url: `${SITE_URL}/preise?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}
