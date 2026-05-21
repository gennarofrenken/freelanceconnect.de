/**
 * Supabase ist optional konfiguriert. Solange `NEXT_PUBLIC_SUPABASE_URL`
 * und `NEXT_PUBLIC_SUPABASE_ANON_KEY` nicht gesetzt sind, läuft die App
 * mit Mock-Auth weiter — sinnvoll für Previews und während des Setups.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
