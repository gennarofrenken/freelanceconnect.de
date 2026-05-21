import type { Metadata } from "next";
import { LoginView } from "./LoginView";

export const metadata: Metadata = {
  title: "Anmelden",
  description:
    "Melden Sie sich bei FreelanceConnect an, um Ihre Projekte, Anfragen und Profilaktivitäten zu verwalten.",
};

export default function LoginPage() {
  return <LoginView />;
}
