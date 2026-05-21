"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

/**
 * Browser-Supabase-Client (Singleton). Liefert null, wenn Supabase nicht
 * konfiguriert ist — Aufrufer müssen damit umgehen (z. B. Fallback auf
 * Mock-Auth).
 */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}
