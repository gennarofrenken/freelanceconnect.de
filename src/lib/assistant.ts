export interface AssistantLink {
  label: string;
  href: string;
}

export interface AssistantRule {
  id: string;
  category: string;
  keywords: string[];
  answer: string;
  links?: AssistantLink[];
  followups?: string[];
}

const STORAGE_KEY = "freelanceconnect:assistant:rules:v1";

export const DEFAULT_RULES: AssistantRule[] = [
  {
    id: "rule-preise",
    category: "Preise",
    keywords: [
      "preis",
      "kosten",
      "gebühr",
      "gebuhr",
      "provision",
      "vermittlungsgebühr",
      "honorar",
      "abo",
    ],
    answer:
      "Die Nutzung ist sowohl für Freelancer als auch für Unternehmen kostenfrei. Wir verrechnen weder Vermittlungsgebühren noch Erfolgshonorare. Premium- und Enterprise-Optionen sind transparent ausgewiesen.",
    links: [{ label: "Preisübersicht", href: "/preise" }],
    followups: [
      "Was ist im Enterprise-Plan enthalten?",
      "Fallen versteckte Kosten an?",
    ],
  },
  {
    id: "rule-registrierung",
    category: "Anmeldung",
    keywords: [
      "registrieren",
      "registrierung",
      "konto",
      "account",
      "anmelden",
      "sign up",
      "signup",
    ],
    answer:
      "Sie können sich kostenlos registrieren — wahlweise als Freelancer oder Unternehmen. Die Verifizierung erfolgt anschließend manuell anhand der angegebenen Daten.",
    links: [
      { label: "Als Freelancer registrieren", href: "/register?role=freelancer" },
      { label: "Als Unternehmen registrieren", href: "/register?role=company" },
    ],
  },
  {
    id: "rule-passwort",
    category: "Anmeldung",
    keywords: [
      "passwort",
      "passwort vergessen",
      "login",
      "einloggen",
      "zurücksetzen",
      "zugang",
    ],
    answer:
      "Wenn Sie Ihr Passwort vergessen haben, können Sie es jederzeit über die „Passwort zurücksetzen“-Funktion neu setzen. Sie erhalten dann einen Link per E-Mail.",
    links: [{ label: "Passwort zurücksetzen", href: "/passwort-vergessen" }],
  },
  {
    id: "rule-projekt-einstellen",
    category: "Projekte",
    keywords: [
      "projekt einstellen",
      "ausschreiben",
      "ausschreibung",
      "ausschreiben",
      "auftrag",
      "projekt erstellen",
    ],
    answer:
      "Projekte einstellen ist für Unternehmen kostenfrei. Füllen Sie das Formular mit Titel, Beschreibung, Konditionen und Ansprechpartner aus — wir prüfen die Anzeige in der Regel innerhalb von 4 Stunden und schalten sie frei.",
    links: [{ label: "Projekt einstellen", href: "/projekte/erstellen" }],
  },
  {
    id: "rule-bewerbung",
    category: "Projekte",
    keywords: ["bewerben", "bewerbung", "anschreiben", "auf projekt"],
    answer:
      "Auf jedes Projekt können Sie sich direkt aus der Detailansicht bewerben. Sie verfassen ein kurzes Anschreiben, Ihre Bewerbung geht direkt an den Auftraggeber — ohne Vermittler.",
    links: [{ label: "Projekte durchsuchen", href: "/search?type=projects" }],
  },
  {
    id: "rule-freelancer-suchen",
    category: "Suche",
    keywords: [
      "freelancer suchen",
      "freelancer finden",
      "experten",
      "profile",
      "talent",
    ],
    answer:
      "Sie können alle Freelancer-Profile öffentlich durchsuchen und nach Skill, Stundensatz, Standort und Verfügbarkeit filtern. Eine Kontaktaufnahme ist jederzeit kostenfrei möglich.",
    links: [{ label: "Freelancer-Suche", href: "/search?type=freelancers" }],
  },
  {
    id: "rule-aueg",
    category: "Rechtliches",
    keywords: [
      "aüg",
      "aueg",
      "arbeitnehmerüberlassung",
      "arbeitnehmeruberlassung",
      "scheinselbstständig",
      "scheinselbststaendig",
      "statusfeststellung",
      "selbstständig",
    ],
    answer:
      "FreelanceConnect ist Plattform, nicht Personaldienstleister. Wir besitzen keine AÜG-Erlaubnis und sind nicht Vertragspartei zwischen Auftraggeber und Freelancer. Sie schließen Werk- oder Dienstverträge direkt miteinander. Für die Abgrenzung zur Scheinselbstständigkeit empfehlen wir eine Statusfeststellung nach § 7a SGB IV.",
    links: [{ label: "AGB", href: "/agb" }],
  },
  {
    id: "rule-datenschutz",
    category: "Rechtliches",
    keywords: [
      "datenschutz",
      "dsgvo",
      "daten",
      "privacy",
      "löschen",
      "loschen",
    ],
    answer:
      "Wir verarbeiten Ihre Daten ausschließlich nach DSGVO. Alle Daten werden in der EU gespeichert. Sie haben jederzeit Anspruch auf Auskunft, Berichtigung und Löschung — die Cookie-Einstellungen können Sie eigenständig anpassen.",
    links: [
      { label: "Datenschutzerklärung", href: "/datenschutz" },
      { label: "Cookie-Einstellungen", href: "/cookies" },
    ],
  },
  {
    id: "rule-kontakt",
    category: "Support",
    keywords: [
      "kontakt",
      "support",
      "hilfe",
      "ansprechpartner",
      "telefon",
      "email",
      "e-mail",
    ],
    answer:
      "Unser Team antwortet werktags innerhalb von 24 Stunden. Sie erreichen uns per Kontaktformular oder direkt per E-Mail an kontakt@freelanceconnect.de.",
    links: [{ label: "Kontakt aufnehmen", href: "/kontakt" }],
  },
  {
    id: "rule-karriere",
    category: "Unternehmen",
    keywords: ["karriere", "jobs bei", "stelle", "anstellung", "team"],
    answer:
      "Wir sind ein Remote-first-Team aus Berlin und stellen laufend in Engineering, Produkt und Operations ein. Initiativbewerbungen sind ausdrücklich willkommen.",
    links: [{ label: "Offene Stellen", href: "/karriere" }],
  },
];

export const FALLBACK_ANSWER =
  "Das kann ich Ihnen so spontan nicht beantworten. Versuchen Sie es mit einer konkreteren Frage — oder schreiben Sie unserem Team eine kurze Nachricht. Werktags antworten wir innerhalb von 24 Stunden.";

export const FALLBACK_LINKS: AssistantLink[] = [
  { label: "Kontakt aufnehmen", href: "/kontakt" },
];

export const SUGGESTED_QUESTIONS = [
  "Wie viel kostet die Plattform?",
  "Wie kann ich mich registrieren?",
  "Wie funktioniert die Bewerbung auf ein Projekt?",
  "Ist das Arbeitnehmerüberlassung?",
];

export const WELCOME_MESSAGE =
  "Hallo! Ich bin Ihr digitaler Assistent für FreelanceConnect. Ich kann Ihnen Fragen zu Anmeldung, Preisen, Projekten und Rechtlichem beantworten — fragen Sie einfach.";

export function loadRules(): AssistantRule[] {
  if (typeof window === "undefined") return DEFAULT_RULES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RULES;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_RULES;
    return parsed as AssistantRule[];
  } catch {
    return DEFAULT_RULES;
  }
}

export function saveRules(rules: AssistantRule[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function resetRules(): AssistantRule[] {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_RULES;
}

export interface MatchResult {
  rule: AssistantRule;
  score: number;
  matchedKeywords: string[];
}

export function matchRule(
  input: string,
  rules: AssistantRule[],
): MatchResult | null {
  const lower = input.toLowerCase();
  if (!lower.trim()) return null;

  const matches: MatchResult[] = [];
  for (const rule of rules) {
    const matched: string[] = [];
    let score = 0;
    for (const kw of rule.keywords) {
      const lowerKw = kw.toLowerCase().trim();
      if (!lowerKw) continue;
      if (lower.includes(lowerKw)) {
        matched.push(kw);
        score += lowerKw.length + 1;
      }
    }
    if (matched.length > 0) matches.push({ rule, score, matchedKeywords: matched });
  }

  if (matches.length === 0) return null;
  matches.sort((a, b) => b.score - a.score);
  return matches[0];
}

export function newRuleTemplate(): AssistantRule {
  return {
    id: `rule-${Math.random().toString(36).slice(2, 9)}`,
    category: "Allgemein",
    keywords: [],
    answer: "",
    links: [],
    followups: [],
  };
}
