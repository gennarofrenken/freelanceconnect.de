"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#0f172a",
          padding: "2rem",
        }}
      >
        <main
          style={{
            maxWidth: "32rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Die Anwendung ist unerwartet abgestürzt
          </h1>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.95rem",
              color: "#475569",
            }}
          >
            Bitte laden Sie die Seite neu. Wenn das Problem bestehen bleibt,
            erreichen Sie uns unter{" "}
            <a
              href="mailto:support@freelanceconnect.de"
              style={{ color: "#0556a3" }}
            >
              support@freelanceconnect.de
            </a>
            .
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "0.5rem",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.7rem",
                color: "#94a3b8",
              }}
            >
              Referenz: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.75rem",
              border: "none",
              borderRadius: "0.5rem",
              background: "#0556a3",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "0.625rem 1.25rem",
              cursor: "pointer",
            }}
          >
            Seite neu laden
          </button>
        </main>
      </body>
    </html>
  );
}
