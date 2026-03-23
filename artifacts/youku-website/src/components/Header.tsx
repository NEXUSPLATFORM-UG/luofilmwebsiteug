import { useState } from "react";
import { Link, useLocation } from "wouter";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Drama", path: "/?genre=drama" },
  { label: "Movie", path: "/?genre=movie" },
  { label: "All", path: "/?genre=all" },
];

export default function Header() {
  const [location] = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 70,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 32,
      }}
    >
      <Link href="/">
        <div style={{ cursor: "pointer", userSelect: "none", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg,#e8d5a3 0%,#f5e6c0 40%,#c9a84c 70%,#e8d5a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: 1.1,
            }}
          >
            TRUE LIGHT
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.52em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg,#c9a84c 0%,#e8d5a3 50%,#c9a84c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Georgia, serif",
              marginTop: -2,
            }}
          >
            STUDIO
          </div>
        </div>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navLinks.map((link) => {
          const isActive = link.path === "/" ? location === "/" : location.startsWith(link.path);
          return (
            <Link key={link.label} href={link.path}>
              <span
                style={{
                  padding: "6px 14px",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.target as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: searchFocused ? 246 : 246,
            height: 36,
            background: "rgba(255,255,255,0.08)",
            border: searchFocused ? "1px solid rgba(0,169,245,0.6)" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: "0 12px",
            gap: 8,
            transition: "border 0.2s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search a show"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 13,
              width: "100%",
            }}
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")} style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1, cursor: "pointer", background: "none", border: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <HeaderIconBtn title="Download App">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
          </svg>
        </HeaderIconBtn>

        <HeaderIconBtn title="Watch History">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </HeaderIconBtn>

        <HeaderIconBtn title="Language">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </HeaderIconBtn>

        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 18,
            border: "1px solid rgba(255,221,154,0.5)",
            background: "transparent",
            color: "#ffdd9a",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,221,154,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffdd9a" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          VIP
        </a>

        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://img.alicdn.com/imgextra/i2/O1CN01lr1KAH1eIQrB1u9ZK_!!6000000003848-2-tps-138-138.png"
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </button>
      </div>
    </header>
  );
}

function HeaderIconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.6)",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#fff";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}
