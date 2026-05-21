import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterView } from "./RegisterView";

export const metadata: Metadata = {
  title: "Konto erstellen – Freelancer & Unternehmen",
  description:
    "Kostenlos registrieren auf FreelanceConnect — als IT-Freelancer Profile pflegen und Anfragen erhalten, oder als Unternehmen Projekte ausschreiben.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-sm text-ink-500">
          Lade Registrierung …
        </div>
      }
    >
      <RegisterView />
    </Suspense>
  );
}
