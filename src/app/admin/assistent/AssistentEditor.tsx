"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Beaker,
  Check,
  Pencil,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import {
  DEFAULT_RULES,
  FALLBACK_ANSWER,
  loadRules,
  matchRule,
  newRuleTemplate,
  resetRules,
  saveRules,
  type AssistantLink,
  type AssistantRule,
} from "@/lib/assistant";

type Draft = AssistantRule & {
  keywordsRaw: string;
  followupsRaw: string;
};

function toDraft(rule: AssistantRule): Draft {
  return {
    ...rule,
    links: rule.links ?? [],
    followups: rule.followups ?? [],
    keywordsRaw: rule.keywords.join(", "),
    followupsRaw: (rule.followups ?? []).join("\n"),
  };
}

function fromDraft(draft: Draft): AssistantRule {
  return {
    id: draft.id,
    category: draft.category.trim() || "Allgemein",
    keywords: draft.keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    answer: draft.answer.trim(),
    links: (draft.links ?? []).filter(
      (l) => l.label.trim() && l.href.trim(),
    ),
    followups: draft.followupsRaw
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean),
  };
}

export function AssistentEditor() {
  const [rules, setRules] = useState<AssistantRule[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [testInput, setTestInput] = useState("");
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    setRules(loadRules());
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of rules) set.add(r.category);
    return Array.from(set).sort();
  }, [rules]);

  const grouped = useMemo(() => {
    const map = new Map<string, AssistantRule[]>();
    for (const r of rules) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rules]);

  const testMatch = useMemo(() => {
    if (!testInput.trim()) return null;
    return matchRule(testInput, rules);
  }, [testInput, rules]);

  function persist(next: AssistantRule[]) {
    setRules(next);
    saveRules(next);
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 1800);
  }

  function startAdd() {
    setDraft(toDraft(newRuleTemplate()));
  }

  function startEdit(rule: AssistantRule) {
    setDraft(toDraft(rule));
  }

  function cancelEdit() {
    setDraft(null);
  }

  function deleteRule(id: string) {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    const sure = window.confirm(
      `Regel „${rule.category} – ${rule.answer.slice(0, 40)}…“ wirklich löschen?`,
    );
    if (!sure) return;
    persist(rules.filter((r) => r.id !== id));
    if (draft?.id === id) cancelEdit();
  }

  function saveDraft(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;
    const final = fromDraft(draft);
    if (final.keywords.length === 0) {
      window.alert("Bitte mindestens ein Schlagwort angeben.");
      return;
    }
    if (final.answer.length < 5) {
      window.alert("Bitte eine Antwort von mindestens 5 Zeichen hinterlegen.");
      return;
    }
    const existsIdx = rules.findIndex((r) => r.id === final.id);
    const next =
      existsIdx >= 0
        ? rules.map((r, i) => (i === existsIdx ? final : r))
        : [...rules, final];
    persist(next);
    cancelEdit();
  }

  function resetToDefaults() {
    const sure = window.confirm(
      "Alle Regeln auf die Standard-Bibliothek zurücksetzen? Eigene Anpassungen gehen verloren.",
    );
    if (!sure) return;
    const defaults = resetRules();
    persist(defaults);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(rules, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assistent-regeln.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-10 space-y-8">
      <TestPanel
        value={testInput}
        onChange={setTestInput}
        match={testMatch}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">
            Regeln ({rules.length})
          </h2>
          {savedHint && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600">
              <Check className="h-3.5 w-3.5" aria-hidden />
              gespeichert
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={exportJson}>
            JSON exportieren
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RefreshCcw className="h-4 w-4" aria-hidden />
            Standard wiederherstellen
          </Button>
          <Button variant="primary" size="sm" onClick={startAdd}>
            <Plus className="h-4 w-4" aria-hidden />
            Neue Regel
          </Button>
        </div>
      </div>

      {draft && (
        <RuleForm
          draft={draft}
          categories={categories}
          onChange={setDraft}
          onSubmit={saveDraft}
          onCancel={cancelEdit}
          isNew={!rules.some((r) => r.id === draft.id)}
        />
      )}

      <div className="space-y-6">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
              {category} · {items.length}
            </h3>
            <ul className="mt-3 space-y-3">
              {items.map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  onEdit={() => startEdit(rule)}
                  onDelete={() => deleteRule(rule.id)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="rounded-xl border border-ink-100 bg-white p-4 text-xs leading-relaxed text-ink-500">
        Insgesamt {DEFAULT_RULES.length} Standard-Regeln sind ausgeliefert.
        Speicherung erfolgt unter dem LocalStorage-Key{" "}
        <code className="rounded bg-ink-100 px-1 py-0.5 text-[10px] text-ink-700">
          freelanceconnect:assistant:rules:v1
        </code>
        . Antwortet keine Regel, spielt der Assistent diesen Fallback ein:{" "}
        <span className="italic">„{FALLBACK_ANSWER}“</span>
      </p>
    </div>
  );
}

function TestPanel({
  value,
  onChange,
  match,
}: {
  value: string;
  onChange: (v: string) => void;
  match: ReturnType<typeof matchRule>;
}) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Beaker className="h-4 w-4" aria-hidden />
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold tracking-tight text-ink-900">
            Regel testen
          </h2>
          <p className="text-xs text-ink-500">
            Simulieren Sie eine Nutzereingabe und sehen Sie, welche Regel
            ausgespielt wird.
          </p>
        </div>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='z. B. "Wie viel kostet das?"'
        className="mt-4 block w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />

      {value.trim() && (
        <div className="mt-4">
          {match ? (
            <div className="rounded-lg border border-ink-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Badge tone="brand">{match.rule.category}</Badge>
                <span className="text-xs text-ink-500">
                  Score {match.score} · {match.matchedKeywords.length} Treffer
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                {match.rule.answer}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {match.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded bg-success-500/10 px-1.5 py-0.5 text-[10px] font-medium text-success-600"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-warning-100 bg-warning-50 p-4 text-sm text-warning-700">
              Keine Regel passt — der Fallback würde ausgespielt.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function RuleRow({
  rule,
  onEdit,
  onDelete,
}: {
  rule: AssistantRule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {rule.keywords.slice(0, 8).map((k) => (
              <span
                key={k}
                className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-700"
              >
                {k}
              </span>
            ))}
            {rule.keywords.length > 8 && (
              <span className="text-[11px] text-ink-500">
                +{rule.keywords.length - 8}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            {rule.answer}
          </p>
          {rule.links && rule.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {rule.links.map((l) => (
                <span
                  key={l.href}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
                >
                  {l.label}
                  <span className="text-brand-500">→</span>
                  <span className="text-ink-500">{l.href}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-brand-700"
            aria-label="Bearbeiten"
            title="Bearbeiten"
          >
            <Pencil className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-warning-50 hover:text-warning-700"
            aria-label="Löschen"
            title="Löschen"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

function RuleForm({
  draft,
  categories,
  onChange,
  onSubmit,
  onCancel,
  isNew,
}: {
  draft: Draft;
  categories: string[];
  onChange: (d: Draft) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function updateLink(idx: number, patch: Partial<AssistantLink>) {
    const links = (draft.links ?? []).map((l, i) =>
      i === idx ? { ...l, ...patch } : l,
    );
    onChange({ ...draft, links });
  }

  function addLink() {
    onChange({
      ...draft,
      links: [...(draft.links ?? []), { label: "", href: "" }],
    });
  }

  function removeLink(idx: number) {
    onChange({
      ...draft,
      links: (draft.links ?? []).filter((_, i) => i !== idx),
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-brand-200 bg-white p-6 shadow-elevated"
    >
      <header className="flex items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-base font-semibold tracking-tight text-ink-900">
            {isNew ? "Neue Regel anlegen" : "Regel bearbeiten"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
          aria-label="Abbrechen"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </header>

      <div className="mt-5 grid gap-5">
        <Field label="Kategorie" htmlFor="rule-cat" required>
          <Input
            id="rule-cat"
            list="rule-categories"
            value={draft.category}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("category", e.target.value)
            }
            placeholder="z. B. Preise"
            required
          />
          <datalist id="rule-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field
          label="Schlagwörter"
          htmlFor="rule-keywords"
          required
          hint="Kommagetrennt — z. B. „preis, kosten, gebühr“. Vergleich erfolgt case-insensitive als Substring."
        >
          <Input
            id="rule-keywords"
            value={draft.keywordsRaw}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("keywordsRaw", e.target.value)
            }
            placeholder="preis, kosten, gebühr"
            required
          />
        </Field>

        <Field label="Antwort" htmlFor="rule-answer" required>
          <Textarea
            id="rule-answer"
            value={draft.answer}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              update("answer", e.target.value)
            }
            rows={4}
            placeholder="Die Nutzung ist kostenfrei …"
            required
          />
        </Field>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-ink-800">
              Verlinkungen (optional)
            </label>
            <button
              type="button"
              onClick={addLink}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Link hinzufügen
            </button>
          </div>
          <p className="mt-1 text-xs text-ink-500">
            Erscheinen als anklickbare Pillen unter der Antwort.
          </p>

          {(draft.links ?? []).length > 0 && (
            <ul className="mt-3 space-y-2">
              {(draft.links ?? []).map((link, idx) => (
                <li
                  key={idx}
                  className="grid gap-2 rounded-lg border border-ink-200 bg-ink-50/50 p-3 sm:grid-cols-[1fr_1.4fr_auto]"
                >
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) =>
                      updateLink(idx, { label: e.target.value })
                    }
                  />
                  <Input
                    placeholder="/preise oder https://…"
                    value={link.href}
                    onChange={(e) => updateLink(idx, { href: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-warning-50 hover:text-warning-700"
                    aria-label="Link entfernen"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Field
          label="Folgefragen (optional)"
          htmlFor="rule-followups"
          hint="Eine Frage pro Zeile. Werden als Vorschlags-Chips unter der Antwort angezeigt."
        >
          <Textarea
            id="rule-followups"
            value={draft.followupsRaw}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              update("followupsRaw", e.target.value)
            }
            rows={3}
            placeholder={"Was ist im Enterprise-Plan enthalten?\nGibt es versteckte Kosten?"}
          />
        </Field>
      </div>

      <footer className="mt-6 flex flex-col-reverse items-stretch justify-end gap-2 border-t border-ink-100 pt-5 sm:flex-row sm:items-center">
        <Button variant="ghost" size="md" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary" size="md">
          <Check className="h-4 w-4" aria-hidden />
          Regel speichern
        </Button>
      </footer>
    </form>
  );
}
