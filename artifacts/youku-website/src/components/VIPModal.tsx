import { useState, useRef } from "react";

const PLANS = [
  {
    id: "day1",
    label: "1 Day Pass",
    tag: "TRY IT",
    price: 2500,
    highlight: false,
  },
  {
    id: "day3",
    label: "3 Days Pass",
    tag: "POPULAR",
    price: 5000,
    highlight: true,
  },
  {
    id: "week1",
    label: "1 Week Pass",
    tag: "GREAT VALUE",
    price: 10000,
    highlight: false,
  },
  {
    id: "month1",
    label: "1 Month Pass",
    tag: "BEST DEAL",
    price: 20000,
    highlight: false,
  },
];

const BENEFITS = [
  {
    icon: "★",
    color: "#f5c842",
    title: "Members Access",
    desc: "Enjoy VIP exclusive content/episodes",
  },
  {
    icon: "▶",
    color: "#00a9f5",
    title: "Multi-Device Access",
    desc: "One account on phone, PC, and TV",
  },
  {
    icon: "HD",
    color: "#ff4d4d",
    title: "High Resolution",
    desc: "Watch 1080P videos",
  },
  {
    icon: "⚡",
    color: "#00c48c",
    title: "Early Access",
    desc: "VIP members watch new episodes first",
  },
  {
    icon: "↓",
    color: "#f5c842",
    title: "Fast Download",
    desc: "Boost up to 5 videos at once",
  },
  {
    icon: "AD",
    color: "#00a9f5",
    title: "Pre-roll Ad Free",
    desc: "Enjoy a clean, ad-free experience",
  },
];

function formatUGX(amount: number) {
  return "UGX " + amount.toLocaleString();
}

const VISIBLE = 2;

interface VIPModalProps {
  onClose: () => void;
}

export default function VIPModal({ onClose }: VIPModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("day3");
  const [startIdx, setStartIdx] = useState(0);
  const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[1];

  const canPrev = startIdx > 0;
  const canNext = startIdx + VISIBLE < PLANS.length;

  const visiblePlans = PLANS.slice(startIdx, startIdx + VISIBLE);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 820,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 16,
          background: "#fff",
          display: "flex",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          color: "#1a1a1a",
        }}
      >
        {/* Left panel */}
        <div
          style={{
            flex: 1,
            padding: "24px 24px 28px",
            minWidth: 0,
            borderRight: "1px solid #f0f0f0",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.08)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#666",
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
              paddingLeft: 4,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffe0a3, #ffc552)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              🐱
            </div>
            <button
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#1a1a1a",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Log in / Sign up
              <span style={{ fontSize: 13, color: "#999" }}>&gt;</span>
            </button>
          </div>

          {/* Plan carousel */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {/* Left arrow */}
            <button
              onClick={() => setStartIdx((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              style={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1.5px solid",
                borderColor: canPrev ? "#f5a623" : "#e0e0e0",
                background: canPrev ? "#fff9ee" : "#f5f5f5",
                color: canPrev ? "#c07800" : "#ccc",
                fontSize: 16,
                fontWeight: 700,
                cursor: canPrev ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              ‹
            </button>

            {/* Visible plan cards */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flex: 1,
              }}
            >
              {visiblePlans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    flex: 1,
                    padding: "16px 12px 18px",
                    borderRadius: 12,
                    border: selectedPlan === p.id ? "2px solid #f5a623" : "2px solid #eee",
                    background:
                      selectedPlan === p.id
                        ? "linear-gradient(160deg, #fff9ee 0%, #fff3d0 100%)"
                        : "#fafafa",
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.15s",
                    minWidth: 0,
                  }}
                >
                  {/* Tag badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: -1,
                      background: p.highlight ? "#f5a623" : "#666",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "10px 0 10px 0",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {p.tag}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: selectedPlan === p.id ? "#c07800" : "#666",
                      marginBottom: 12,
                      marginTop: 10,
                      lineHeight: 1.4,
                    }}
                  >
                    {p.label}
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color: selectedPlan === p.id ? "#c07800" : "#333",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {(p.price / 1000).toFixed(0)}K
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: selectedPlan === p.id ? "#c07800" : "#999",
                      fontWeight: 600,
                    }}
                  >
                    UGX
                  </div>
                </button>
              ))}

              {/* Placeholder if fewer than VISIBLE plans are visible (shouldn't happen normally) */}
              {visiblePlans.length < VISIBLE && (
                <div style={{ flex: 1 }} />
              )}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setStartIdx((i) => Math.min(PLANS.length - VISIBLE, i + 1))}
              disabled={!canNext}
              style={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1.5px solid",
                borderColor: canNext ? "#f5a623" : "#e0e0e0",
                background: canNext ? "#fff9ee" : "#f5f5f5",
                color: canNext ? "#c07800" : "#ccc",
                fontSize: 16,
                fontWeight: 700,
                cursor: canNext ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              ›
            </button>
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
              marginBottom: 18,
            }}
          >
            {PLANS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i >= startIdx && i < startIdx + VISIBLE ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i >= startIdx && i < startIdx + VISIBLE ? "#f5a623" : "#ddd",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>

          {/* Promo note */}
          <div
            style={{
              fontSize: 12,
              color: "#f5a623",
              marginBottom: 22,
              paddingLeft: 2,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ fontSize: 14 }}>•</span>
            Affordable access — start watching in seconds!
          </div>

          {/* Benefits */}
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>
            VIP Membership Benefits
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 20px",
            }}
          >
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: b.color + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: b.icon.length > 1 ? 10 : 16,
                    fontWeight: 900,
                    color: b.color,
                    flexShrink: 0,
                  }}
                >
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2, lineHeight: 1.4 }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            padding: "20px 20px 24px",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRadius: "0 16px 16px 0",
          }}
        >
          {/* Pay with app button + QR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 22,
              paddingBottom: 18,
              borderBottom: "1px dashed #e8e8e8",
            }}
          >
            <button
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1.5px solid #ff6b35",
                background: "#fff",
                color: "#ff6b35",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                lineHeight: 1.3,
                textAlign: "center",
              }}
            >
              Pay with the<br />LUO FILM APP
            </button>
            <div
              style={{
                width: 44,
                height: 44,
                background: "#f5f5f5",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <QRPattern />
            </div>
          </div>

          {/* Price display */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#999",
                marginBottom: 4,
                letterSpacing: "0.05em",
              }}
            >
              {plan.label.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>UGX</span>
              <span style={{ fontSize: 48, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>
                {plan.price.toLocaleString()}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 14px",
                  borderRadius: 20,
                  background: "linear-gradient(90deg, #f5a623, #ffc552)",
                  color: "#3d2200",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {plan.tag}
              </span>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed #e8e8e8", margin: "14px 0" }} />

          {/* Payment method */}
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#1a1a1a" }}>
            Choose Payment Method
          </div>

          <div
            style={{
              border: "2px solid #1677ff",
              borderRadius: 10,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              marginBottom: 8,
              position: "relative",
              background: "#f8fbff",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "linear-gradient(135deg, #1677ff, #00a3f5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              M
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>MOBILE MONEY</div>
            <div style={{ fontSize: 10, color: "#999" }}>MTN · Airtel</div>
            <div
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#1677ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              ✓
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Pay now button */}
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 30,
              background: "linear-gradient(90deg, #f5c842 0%, #ffdd9a 50%, #e8a800 100%)",
              border: "none",
              color: "#3d2200",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              marginTop: 18,
              boxShadow: "0 4px 16px rgba(245,200,66,0.45)",
              transition: "filter 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
            }}
          >
            Pay {formatUGX(plan.price)}
          </button>

          <div
            style={{
              marginTop: 12,
              textAlign: "center",
              fontSize: 10,
              color: "#1677ff",
              lineHeight: 1.6,
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "#1677ff",
                fontSize: 10,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              VIP Membership Terms
            </button>
            {" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#1677ff",
                fontSize: 10,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRPattern() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="14" height="14" rx="1" fill="#1a1a1a" />
      <rect x="4" y="4" width="10" height="10" rx="0.5" fill="#fff" />
      <rect x="6" y="6" width="6" height="6" rx="0.5" fill="#1a1a1a" />
      <rect x="24" y="2" width="14" height="14" rx="1" fill="#1a1a1a" />
      <rect x="26" y="4" width="10" height="10" rx="0.5" fill="#fff" />
      <rect x="28" y="6" width="6" height="6" rx="0.5" fill="#1a1a1a" />
      <rect x="2" y="24" width="14" height="14" rx="1" fill="#1a1a1a" />
      <rect x="4" y="26" width="10" height="10" rx="0.5" fill="#fff" />
      <rect x="6" y="28" width="6" height="6" rx="0.5" fill="#1a1a1a" />
      <rect x="20" y="20" width="3" height="3" fill="#1a1a1a" />
      <rect x="24" y="20" width="3" height="3" fill="#1a1a1a" />
      <rect x="28" y="20" width="3" height="3" fill="#1a1a1a" />
      <rect x="32" y="20" width="3" height="3" fill="#1a1a1a" />
      <rect x="20" y="24" width="3" height="3" fill="#1a1a1a" />
      <rect x="28" y="24" width="3" height="3" fill="#1a1a1a" />
      <rect x="32" y="24" width="3" height="3" fill="#1a1a1a" />
      <rect x="24" y="28" width="3" height="3" fill="#1a1a1a" />
      <rect x="28" y="28" width="3" height="3" fill="#1a1a1a" />
      <rect x="20" y="32" width="3" height="3" fill="#1a1a1a" />
      <rect x="24" y="32" width="3" height="3" fill="#1a1a1a" />
      <rect x="32" y="32" width="3" height="3" fill="#1a1a1a" />
    </svg>
  );
}
