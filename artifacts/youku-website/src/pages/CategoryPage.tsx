import { useState } from "react";
import { Link } from "wouter";
import { shows } from "../data/shows";
import type { Show } from "../data/shows";
import { Star } from "lucide-react";

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
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/play/${show.id}`}>
      <div
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "relative",
            paddingTop: "133.33%",
            borderRadius: 6,
            overflow: "hidden",
            background: "#1a1a1a",
          }}
        >
          <img
            src={show.thumbnailUrl}
            alt={show.title}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.35s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
              backgroundImage:
                "linear-gradient(180deg, transparent, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55))",
            }}
          />
          {show.badge && show.badge !== "none" && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: 18,
                lineHeight: "18px",
                padding: "0 6px",
                borderRadius: "0 6px 0 6px",
                fontSize: 11,
                fontWeight: 700,
                background:
                  show.badge === "VIP"
                    ? "linear-gradient(45deg,#ffc552,#ffdd9a)"
                    : show.badge === "Express"
                    ? "linear-gradient(45deg,#00a3f5,#00c9fd)"
                    : "linear-gradient(45deg,#8819ff,#ad61ff)",
                color: show.badge === "VIP" ? "#4e2d03" : "#fff",
              }}
            >
              {show.badge}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage({ genre, title, description: _description }: CategoryPageProps) {
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
              gridTemplateColumns: "repeat(auto-fill, minmax(136px, 1fr))",
              gap: 10,
            }}
          >
            {rest.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
