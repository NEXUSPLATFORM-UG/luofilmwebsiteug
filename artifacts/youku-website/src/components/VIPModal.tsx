import { useState } from "react";

const PLANS = [
  {
    id: "monthly",
    label: "Monthly Subscription",
    discount: "40% off",
    price: 3.59,
    original: 5.99,
    saved: 2.4,
    highlight: true,
  },
  {
    id: "quarterly",
    label: "Quarterly Subscription",
    discount: "40% off",
    price: 10.49,
    original: 17.49,
    saved: 6.99,
    highlight: false,
  },
  {
    id: "annual",
    label: "Annual Subscription",
    discount: "50% off",
    price: 28.99,
    original: 56.99,
    saved: 27.99,
    highlight: false,
  },
  {
    id: "annual2",
    label: "2-Year Subscription",
    discount: "55% off",
    price: 49.99,
    original: 113.99,
    saved: 63.99,
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

interface VIPModalProps {
  onClose: () => void;
}

export default function VIPModal({ onClose }: VIPModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];

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
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Modal */}
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

          {/* Log in / Sign up */}
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
              Log in/Sign up
              <span style={{ fontSize: 13, color: "#999" }}>&gt;</span>
            </button>
          </div>

          {/* Plan cards */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
          >
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                style={{
                  flexShrink: 0,
                  width: 140,
                  padding: "14px 12px 16px",
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
                }}
              >
                {/* Discount badge */}
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: -1,
                    background: "#ff4d4d",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "10px 0 10px 0",
                  }}
                >
                  {p.discount}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: selectedPlan === p.id ? "#c07800" : "#666",
                    marginBottom: 10,
                    marginTop: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {p.label}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 1,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: selectedPlan === p.id ? "#c07800" : "#333",
                    }}
                  >
                    $
                  </span>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: selectedPlan === p.id ? "#c07800" : "#333",
                      lineHeight: 1,
                    }}
                  >
                    {p.price.toFixed(2).split(".")[0]}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: selectedPlan === p.id ? "#c07800" : "#333",
                    }}
                  >
                    .{p.price.toFixed(2).split(".")[1]}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#bbb",
                    textDecoration: "line-through",
                  }}
                >
                  ${p.original.toFixed(2)}
                </div>
              </button>
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
            New subscribers get 40% off the first term!
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
              Pay with the<br />YOUKU APP
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
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>$</span>
              <span style={{ fontSize: 52, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>
                {plan.price.toFixed(2).split(".")[0]}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
                .{plan.price.toFixed(2).split(".")[1]}
              </span>
            </div>
            {/* Saved badge */}
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 14px",
                  borderRadius: 20,
                  background: "linear-gradient(90deg, #ff4488, #ff6b9d)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Saved ${plan.saved.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Divider */}
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
            {/* Alipay icon */}
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
              ¥
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>ALIPAY</div>
            <div style={{ fontSize: 10, color: "#999" }}>Alipay·partner</div>
            {/* Check badge */}
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
              fontSize: 16,
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
            Pay now ${plan.price.toFixed(2)}
          </button>

          {/* Legal links */}
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
              "VIP Membership Terms"
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
              "Privacy Policy"
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
