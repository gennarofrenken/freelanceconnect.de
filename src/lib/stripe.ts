import Stripe from "stripe";

export const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_CONNECT_PRO ?? "";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelanceconnect.de";

export const isStripeConfigured =
  STRIPE_SECRET.length > 0 && STRIPE_PRICE_PRO.length > 0;

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET) return null;
  if (cached) return cached;
  cached = new Stripe(STRIPE_SECRET, {
    apiVersion: "2026-04-22.dahlia",
  });
  return cached;
}
