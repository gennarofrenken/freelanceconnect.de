import type { Metadata } from "next";
import { ForgotPasswordView } from "./ForgotPasswordView";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  description:
    "Setzen Sie Ihr Passwort für FreelanceConnect zurück. Wir senden Ihnen einen Link an Ihre hinterlegte E-Mail-Adresse.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
