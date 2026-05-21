export const CONSENT_KEY = "freelanceconnect:cookie-consent:v1";
export const CONSENT_EVENT = "freelanceconnect:consent-changed";

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt?: string;
}

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (!parsed.decidedAt) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: parsed.decidedAt,
    };
  } catch {
    return null;
  }
}

export function writeConsent(
  partial: Pick<ConsentState, "analytics" | "marketing">,
): ConsentState {
  const next: ConsentState = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    decidedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }));
  }
  return next;
}
