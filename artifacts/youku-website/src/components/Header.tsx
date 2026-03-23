import { useState } from "react";
import { Link, useLocation } from "wouter";
import VIPModal from "./VIPModal";
import AuthModal from "./AuthModal";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "DRAMA", path: "/drama" },
  { label: "MOVIE", path: "/movie" },
  { label: "VARIETY", path: "/variety" },
  { label: "SPORTS", path: "/sports" },
  { label: "DOCUMENTARY", path: "/documentary" },
  { label: "ANIME", path: "/anime" },
];

interface User {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export default function Header() {
  const [location] = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showVIP, setShowVIP] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  function handleAuth(u: User) {
    setUser(u);
    setShowAuth(false);
  }

  function handleLogout() {
    setUser(null);
    setShowUserMenu(false);
  }


  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 60,
          background: "#0e0e0e",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 0,
        }}
      >
        {/* Logo */}
        <Link href="/">
          <div
            style={{
              cursor: "pointer",
              userSelect: "none",
              flexShrink: 0,
              marginRight: 20,
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #00a9f5 0%, #0076d6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polygon points="5,3 19,12 5,21" fill="white" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(135deg,#e8d5a3 0%,#f5e6c0 40%,#c9a84c 70%,#e8d5a3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: 1.1,
                }}
              >
                LUO FILM
              </div>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(135deg,#c9a84c 0%,#e8d5a3 50%,#c9a84c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "Georgia, serif",
                  marginTop: -1,
                }}
              >
                .SITE
              </div>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 0, marginRight: 16 }}>
          {navLinks.map((link) => {
            const isActive =
              link.path === "/" ? location === "/" : location.startsWith(link.path);
            return (
              <Link key={link.label} href={link.path}>
                <span
                  style={{
                    display: "block",
                    padding: "0 12px",
                    height: 60,
                    lineHeight: "60px",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                    borderBottom: isActive ? "2px solid #00a9f5" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    }
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: 220,
              height: 34,
              background: "rgba(255,255,255,0.07)",
              border: searchFocused
                ? "1px solid rgba(0,169,245,0.7)"
                : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 17,
              padding: "0 10px",
              gap: 7,
              transition: "border 0.2s",
              boxSizing: "border-box",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={searchFocused ? "rgba(0,169,245,0.8)" : "rgba(255,255,255,0.35)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, transition: "stroke 0.2s" }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="SEARCH SHOWS, MOVIES, VARIETY..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 12,
                width: "100%",
              }}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                style={{
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* App download */}
          <HeaderIconBtn title="DOWNLOAD APP">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </HeaderIconBtn>

          {/* Watch history */}
          <HeaderIconBtn title="WATCH HISTORY">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </HeaderIconBtn>

          {/* VIP Badge */}
          <button
            onClick={() => setShowVIP(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "0 14px",
              height: 32,
              borderRadius: 16,
              background: "linear-gradient(90deg, #f5c842 0%, #ffdd9a 45%, #e8a800 100%)",
              color: "#3d2200",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(245,200,66,0.35)",
              transition: "filter 0.2s, box-shadow 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1.08)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 3px 12px rgba(245,200,66,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(245,200,66,0.35)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 19h20M3 19L5 9l4.5 4L12 4l2.5 9L19 9l2 10"
                stroke="#3d2200"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            JOIN VIP
          </button>

          {/* Admin Panel */}
          <Link href="/admin">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "0 12px",
                height: 32,
                borderRadius: 6,
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#818cf8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.28)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.7)";
                (e.currentTarget as HTMLDivElement).style.color = "#a5b4fc";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.15)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.4)";
                (e.currentTarget as HTMLDivElement).style.color = "#818cf8";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              ADMIN
            </div>
          </Link>

          {/* Avatar / Login */}
          {user ? (
            <div style={{ position: "relative", marginLeft: 4 }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.06)",
                  border: "2px solid rgba(0,169,245,0.45)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  flexShrink: 0,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: "0 0 0 0 rgba(0,169,245,0)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,169,245,0.8)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(0,169,245,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,169,245,0.45)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(0,169,245,0)";
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>

              {showUserMenu && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 150 }}
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      width: 200,
                      zIndex: 160,
                      overflow: "hidden",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      animation: "slideDown 0.15s ease",
                    }}
                  >
                    <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(0,169,245,0.35)", flexShrink: 0, objectFit: "cover", background: "#1a1a1a" }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.email || user.phone}
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
                    {[
                      { label: "My Profile", icon: "👤" },
                      { label: "Watch History", icon: "🕐" },
                      { label: "My Watchlist", icon: "❤️" },
                      { label: "Downloads", icon: "⬇️" },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.65)",
                          fontSize: 13,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <span>{icon}</span>
                        {label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "transparent",
                        border: "none",
                        color: "#ff6b6b",
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,107,107,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <span>🚪</span>
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "0 16px",
                height: 32,
                borderRadius: 16,
                background: "linear-gradient(135deg, #c0c0c0 0%, #d4af37 40%, #f5e27a 55%, #d4af37 70%, #a87c20 100%)",
                border: "none",
                color: "#1a1200",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                flexShrink: 0,
                letterSpacing: "0.08em",
                transition: "filter 0.2s, box-shadow 0.2s",
                marginLeft: 4,
                boxShadow: "0 2px 10px rgba(212,175,55,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "brightness(1.12)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(212,175,55,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(212,175,55,0.35)";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              LOG IN
            </button>
          )}
        </div>
      </header>

      {showVIP && <VIPModal onClose={() => setShowVIP(false)} />}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={handleAuth}
        />
      )}
    </>
  );
}

function HeaderIconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      title={title}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.5)",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#fff";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}
