import { Link } from "wouter";
import { Star } from "lucide-react";
import { shows } from "../data/shows";
import type { Show } from "../data/shows";

interface CategoryPageProps {
  genre: string;
  title: string;
  description: string;
}

const GENRE_MAP: Record<string, string[]> = {
  drama: ["romance", "drama", "campus", "modern", "period", "medical", "thriller", "comedy"],
  movie: ["action", "thriller", "historical", "wuxia", "fantasy", "mystery"],
  variety: ["comedy", "variety", "campus", "modern"],
  sports: ["action", "wuxia", "sports"],
  documentary: ["historical", "mystery", "documentary"],
  anime: ["fantasy", "xianxia", "anime"],
};

const GENRE_COLORS: Record<string, string> = {
  drama: "#e05a7a",
  movie: "#e06a20",
  variety: "#7c3aed",
  sports: "#059669",
  documentary: "#2563eb",
  anime: "#db2777",
};

function ShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/play/${show.id}`}>
      <div
        style={{
          cursor: "pointer",
          borderRadius: 6,
          overflow: "hidden",
          background: "#1a1a1a",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.transform = "translateY(-3px)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
        }
      >
        <div style={{ position: "relative", paddingBottom: "140%" }}>
          <img
            src={show.thumbnailUrl}
            alt={show.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {show.badge !== "none" && (
            <span
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                padding: "2px 6px",
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 700,
                background:
                  show.badge === "VIP"
                    ? "linear-gradient(90deg,#ffc552,#ffdd9a)"
                    : show.badge === "Express"
                    ? "linear-gradient(90deg,#00a9f5,#00c8ff)"
                    : "linear-gradient(90deg,#ff4d4d,#ff6b6b)",
                color: show.badge === "VIP" ? "#4e2d03" : "#fff",
              }}
            >
              {show.badge}
            </span>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px 8px 8px",
              background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Star size={10} fill="#ffc552" color="#ffc552" />
              <span style={{ fontSize: 11, color: "#ffc552", fontWeight: 600 }}>
                {show.rating}
              </span>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 8px 10px" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#eee",
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {show.title}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {show.episodeCount} EPS · {show.genre.split(" · ")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage({ genre, title, description }: CategoryPageProps) {
  const keywords = GENRE_MAP[genre] || [];
  const accentColor = GENRE_COLORS[genre] || "#00a9f5";

  const filtered = shows.filter((s) =>
    keywords.some((kw) => s.genre.toLowerCase().includes(kw))
  );

  const displayed = filtered.length > 0 ? filtered : shows.slice(0, 12);
  const featured = displayed[0];
  const rest = displayed.slice(1);

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", color: "#fff" }}>
      <div style={{ height: 60 }} />

      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: 220,
          background: `linear-gradient(135deg, ${accentColor}33 0%, #141414 100%)`,
          borderBottom: `2px solid ${accentColor}44`,
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 400,
            height: "100%",
            background: `radial-gradient(ellipse at right, ${accentColor}22 0%, transparent 70%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 20,
              background: accentColor,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            {title}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8, maxWidth: 500 }}>
            {description}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Featured show */}
        {featured && (
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 18,
                  borderRadius: 2,
                  background: accentColor,
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 700 }}>FEATURED</span>
            </div>
            <Link href={`/play/${featured.id}`}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                  height: 280,
                  background: "#1a1a1a",
                }}
              >
                <img
                  src={featured.coverUrl}
                  alt={featured.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 28,
                    left: 28,
                    maxWidth: 480,
                  }}
                >
                  {featured.badge !== "none" && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 3,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "linear-gradient(90deg,#ffc552,#ffdd9a)",
                        color: "#4e2d03",
                        marginBottom: 8,
                      }}
                    >
                      {featured.badge}
                    </span>
                  )}
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
                    {featured.title}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={13} fill="#ffc552" color="#ffc552" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#ffc552" }}>
                        {featured.rating}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      {featured.year}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                      {featured.episodeCount} EPS
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      margin: 0,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {featured.description}
                  </p>
                  <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                    <button
                      style={{
                        padding: "8px 22px",
                        borderRadius: 20,
                        background: accentColor,
                        color: "#fff",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ▶ PLAY NOW
                    </button>
                    <button
                      style={{
                        padding: "8px 18px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.2)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      DETAILS
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All shows grid */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 3,
                height: 18,
                borderRadius: 2,
                background: accentColor,
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 700 }}>ALL {title}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>
              {displayed.length} TITLES
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 14,
            }}
          >
            {displayed.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
