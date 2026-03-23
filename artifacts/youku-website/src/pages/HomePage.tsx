import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shows, bannerShows, trendingShows } from "../data/shows";
import type { Show } from "../data/shows";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveSlide(index);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % bannerShows.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + bannerShows.length) % bannerShows.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide]);

  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 5000);
  };

  const handleGoToSlide = (i: number) => {
    goToSlide(i);
    restartTimer();
  };

  const handlePrev = () => {
    prevSlide();
    restartTimer();
  };

  const handleNext = () => {
    nextSlide();
    restartTimer();
  };

  const currentShow = bannerShows[activeSlide];
  const sideShows = bannerShows.filter((_, i) => i !== activeSlide).slice(0, 2);
  const miniShows = shows.slice(bannerShows.length, bannerShows.length + 4);

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", color: "#fff" }}>
      <div style={{ height: 60 }} />


      {/* Hero intswiper section */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px",
          maxWidth: 1440,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Left: large focus content */}
        <div style={{ flex: "0 0 auto", position: "relative" }}>
          <div
            style={{
              width: "calc(56vw - 20px)",
              minWidth: 480,
              maxWidth: 760,
              position: "relative",
              overflow: "hidden",
              borderRadius: 6,
              background: "#1a1a1a",
            }}
          >
            <div style={{ paddingTop: "56.25%" }} />
            <img
              key={currentShow.id}
              src={currentShow.thumbnailUrl}
              alt={currentShow.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isTransitioning ? 0.7 : 1,
                transition: "opacity 0.4s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
              }}
            />

            {/* Text overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 20px 20px",
              }}
            >
              {currentShow.badge && currentShow.badge !== "none" && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "1px 8px",
                    borderRadius: 2,
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 8,
                    background:
                      currentShow.badge === "VIP"
                        ? "linear-gradient(90deg,#ffc552,#ffdd9a)"
                        : currentShow.badge === "Express"
                        ? "linear-gradient(90deg,#00a3f5,#00c9fd)"
                        : "linear-gradient(90deg,#8819ff,#ad61ff)",
                    color: currentShow.badge === "VIP" ? "#4e2d03" : "#fff",
                  }}
                >
                  {currentShow.badge}
                </span>
              )}
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  marginBottom: 6,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {currentShow.title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: 12,
                  maxWidth: 380,
                }}
              >
                {currentShow.description}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/play/${currentShow.id}`}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 18px",
                      borderRadius: 20,
                      background: "#00a9f5",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ▶ PLAY NOW
                  </button>
                </Link>
                <Link href={`/play/${currentShow.id}`}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 18px",
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    DETAILS
                  </button>
                </Link>
              </div>
            </div>

            {/* Prev/Next arrows */}
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div
              style={{
                position: "absolute",
                bottom: 8,
                right: 12,
                display: "flex",
                gap: 4,
              }}
            >
              {bannerShows.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleGoToSlide(i)}
                  style={{
                    height: 3,
                    width: i === activeSlide ? 20 : 6,
                    borderRadius: 2,
                    background: i === activeSlide ? "#fff" : "rgba(255,255,255,0.35)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: VIP featured + mini grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 0,
          }}
        >
          {/* Top: 2 side show cards stacked */}
          <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
            {sideShows.map((show) => (
              <SideShowCard key={show.id} show={show} />
            ))}
          </div>

          {/* Bottom: 4 mini horizontal cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {miniShows.map((show) => (
              <MiniShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </div>

      {/* Content rows */}
      <div style={{ padding: "8px 12px 40px", maxWidth: 1440, margin: "0 auto" }}>
        <ContentRow title="HOT SERIES" subtitle="RECOMMENDED" shows={trendingShows.slice(0, 10)} />
        <ContentRow
          title="ROMANCE"
          shows={shows.filter((s) => s.genre.toLowerCase().includes("romance")).slice(0, 10)}
        />
        <ContentRow
          title="FANTASY & WUXIA"
          shows={shows
            .filter(
              (s) =>
                s.genre.toLowerCase().includes("xianxia") ||
                s.genre.toLowerCase().includes("fantasy")
            )
            .slice(0, 10)}
        />
        <ContentRow
          title="HISTORICAL"
          shows={shows
            .filter(
              (s) =>
                s.genre.toLowerCase().includes("historical") ||
                s.genre.toLowerCase().includes("wuxia")
            )
            .slice(0, 10)}
        />
      </div>
    </div>
  );
}

function SideShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/play/${show.id}`}>
      <div
        style={{
          flex: 1,
          position: "relative",
          borderRadius: 6,
          overflow: "hidden",
          background: "#1a1a1a",
          cursor: "pointer",
        }}
      >
        <div style={{ paddingTop: "56.25%" }} />
        <img
          src={show.thumbnailUrl}
          alt={show.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)",
          }}
        />
        {show.badge && show.badge !== "none" && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "2px 7px",
              borderRadius: "0 6px 0 6px",
              fontSize: 11,
              fontWeight: 700,
              background:
                show.badge === "VIP"
                  ? "linear-gradient(90deg,#ffc552,#ffdd9a)"
                  : show.badge === "Express"
                  ? "linear-gradient(90deg,#00a3f5,#00c9fd)"
                  : "linear-gradient(90deg,#8819ff,#ad61ff)",
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
            padding: "6px 8px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            {show.title}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            {show.episodeCount} EPS
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/play/${show.id}`}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "4px 6px",
          borderRadius: 4,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 64,
            height: 42,
            borderRadius: 3,
            overflow: "hidden",
            background: "#1a1a1a",
          }}
        >
          <img
            src={show.thumbnailUrl}
            alt={show.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {show.title}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            {show.genre} · {show.episodeCount} EPS
          </div>
        </div>
        {show.badge && show.badge !== "none" && (
          <span
            style={{
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 5px",
              borderRadius: 2,
              background:
                show.badge === "VIP"
                  ? "linear-gradient(90deg,#ffc552,#ffdd9a)"
                  : "linear-gradient(90deg,#00a3f5,#00c9fd)",
              color: show.badge === "VIP" ? "#4e2d03" : "#fff",
            }}
          >
            {show.badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function ContentRow({ title, subtitle, shows }: { title: string; subtitle?: string; shows: Show[] }) {
  if (!shows.length) return null;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
    }
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 16,
              borderRadius: 2,
              background: "#00a9f5",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{title}</span>
          {subtitle && (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>
              {subtitle}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => scroll("left")}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll("right")}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={14} />
          </button>
          <button
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: 4,
            }}
          >
            ALL &gt;
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 4,
        }}
      >
        {shows.map((show, idx) => (
          <ContentCard key={show.id} show={show} rank={idx + 1} />
        ))}
      </div>
    </section>
  );
}

function ContentCard({ show, rank }: { show: Show; rank: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/play/${show.id}`}>
      <div
        style={{ flexShrink: 0, width: 136, cursor: "pointer" }}
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
          {rank <= 3 && (
            <span
              style={{
                position: "absolute",
                bottom: 6,
                left: 6,
                fontSize: 22,
                fontWeight: 900,
                color: rank === 1 ? "#ffc552" : rank === 2 ? "#c0c0c0" : "#cd7f32",
                lineHeight: 1,
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              {rank}
            </span>
          )}
        </div>
        <div
          style={{
            paddingTop: 7,
            paddingBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: hovered ? "#00a9f5" : "rgba(255,255,255,0.9)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "20px",
              transition: "color 0.2s",
            }}
            title={show.title}
          >
            {show.title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              marginTop: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {show.episodeCount} EPS · {show.genre.split(" · ")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </Link>
  );
}
