import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "FreelanceConnect – IT-Freelancer & Projekte in der DACH-Region";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #082649 0%, #0556A3 60%, #0069C9 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.92) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
              <circle cx="18" cy="32" r="7" fill="#0556A3" />
              <rect x="24" y="30" width="14" height="4" rx="2" fill="#0556A3" />
              <circle
                cx="46"
                cy="32"
                r="7"
                fill="none"
                stroke="#0556A3"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Freelance<span style={{ color: "#7CC2FD" }}>Connect</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.16em",
              color: "#7CC2FD",
              textTransform: "uppercase",
            }}
          >
            Die Projektbörse für IT-Freelancer
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "white",
            }}
          >
            Projekte und Experten.
            <br />
            <span style={{ color: "#FEC84B" }}>Direkt verbunden.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 22,
            color: "#DCEEFE",
            fontWeight: 500,
          }}
        >
          <span>0 % Vermittlungsgebühr</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>DSGVO-konform · EU-Hosting</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Verifizierte Profile</span>
        </div>
      </div>
    ),
    size,
  );
}
