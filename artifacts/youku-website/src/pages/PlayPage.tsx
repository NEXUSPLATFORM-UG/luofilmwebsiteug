import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Play,
  Star,
  Share2,
  Heart,
  Download,
  Settings,
  Maximize,
  Volume2,
  SkipForward,
  ThumbsUp,
  MessageSquare,
  Check,
  Film,
} from "lucide-react";
import { shows } from "../data/shows";
import type { Show } from "../data/shows";
import { fbApi } from "../lib/firebaseApi";

function toShow(d: any): Show {
  return {
    id: d.id,
    title: d.title || "",
    type: d.type || "series",
    episodeCount: d.episodeCount || 0,
    badge: d.badge || "none",
    genre: d.genre || "",
    year: d.year || 2024,
    rating: d.rating || 8.0,
    description: d.description || "",
    coverUrl: d.coverUrl || d.thumbnailUrl || "",
    thumbnailUrl: d.thumbnailUrl || d.coverUrl || "",
  };
}

export default function PlayPage() {
  const params = useParams<{ id: string }>();
  const [firestoreShow, setFirestoreShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const staticShow = shows.find((s) => s.id === params.id) || shows[0];

  useEffect(() => {
    if (!params.id) return;
    fbApi.publicContent.getById(params.id).then((d) => {
      if (d) {
        const s = toShow(d);
        setFirestoreShow(s);
        fbApi.content.episodes.list(params.id).then((r) => setEpisodes(r.episodes || [])).catch(() => {});
        fbApi.content.incrementViews(params.id).catch(() => {});
      }
    }).catch(() => {});
  }, [params.id]);

  const show = firestoreShow || staticShow;
  const isSeries = show.type === "series";

  const [currentEp, setCurrentEp] = useState(1);
  const [epPage, setEpPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"EPISODES" | "RECOMMENDED" | "SYNOPSIS">(
    isSeries ? "EPISODES" : "RECOMMENDED"
  );
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showQualityPicker, setShowQualityPicker] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState("");
  const [subtitlesOn, setSubtitlesOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverPlayer, setHoverPlayer] = useState(false);

  const displayEpisodes = episodes.length > 0
    ? episodes
    : Array.from({ length: show.episodeCount }, (_, i) => ({ number: i + 1, episodeNumber: i + 1 }));
  const EPS_PER_PAGE = 30;
  const totalPages = Math.ceil(displayEpisodes.length / EPS_PER_PAGE);
  const visibleEpisodes = displayEpisodes.slice(epPage * EPS_PER_PAGE, (epPage + 1) * EPS_PER_PAGE);
  const related = shows.filter((s) => s.id !== show.id).slice(0, 8);
  const currentEpisodeData = displayEpisodes.find((e: any) => (e.episodeNumber || e.number) === currentEp);
  const videoSrc = (currentEpisodeData as any)?.videoUrl || (show as any).videoUrl || "";

  const isVip = show.badge === "VIP";

  const tabs = isSeries
    ? (["EPISODES", "RECOMMENDED", "SYNOPSIS"] as const)
    : (["RECOMMENDED", "SYNOPSIS"] as const);

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", color: "#fff" }}>
      <div style={{ height: 60 }} />

      {/* Breadcrumb */}
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        <Link href="/">
          <span style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>HOME</span>
        </Link>
        <span>&gt;</span>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>{show.genre.split(" · ")[0]}</span>
        <span>&gt;</span>
        <span style={{ color: "rgba(255,255,255,0.75)" }}>{show.title}</span>
      </div>

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 16px 40px",
          display: "flex",
          gap: 16,
        }}
      >
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Video player */}
          <div
            style={{
              position: "relative",
              width: "100%",
              background: "#000",
              borderRadius: 6,
              overflow: "hidden",
              aspectRatio: "16/9",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoverPlayer(true)}
            onMouseLeave={() => setHoverPlayer(false)}
            onClick={() => { if (!videoSrc) setIsPlaying(!isPlaying); }}
          >
            {videoSrc && isPlaying ? (
              <video
                src={videoSrc}
                autoPlay
                controls
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
            ) : (
            <>
            <img
              src={show.coverUrl}
              alt={show.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.35,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
            />

            {/* Center play button */}
            {!isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(0,169,245,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(0,169,245,0.5)",
                    transition: "transform 0.2s",
                  }}
                >
                  <Play size={28} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
                    {show.title}
                  </p>
                  {isSeries && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                      EPISODE {currentEp}
                    </p>
                  )}
                </div>
                {isVip && (
                  <div
                    style={{
                      padding: "6px 20px",
                      borderRadius: 20,
                      background: "linear-gradient(90deg,#ffc552,#ffdd9a)",
                      color: "#4e2d03",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    ★ VIP EXCLUSIVE
                  </div>
                )}
              </div>
            )}

            {/* Control bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "24px 16px 10px",
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                opacity: hoverPlayer ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              {/* Progress bar */}
              <div
                style={{
                  height: 3,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "0%",
                    background: "#00a9f5",
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CtrlBtn onClick={() => setIsPlaying(!isPlaying)}>
                    <Play size={16} fill="white" color="white" />
                  </CtrlBtn>
                  {isSeries && (
                    <CtrlBtn>
                      <SkipForward size={16} />
                    </CtrlBtn>
                  )}
                  <CtrlBtn>
                    <Volume2 size={16} />
                  </CtrlBtn>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    00:00 / {isSeries ? "45:00" : "1:52:00"}
                  </span>
                  {isSeries && (
                    <button
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.7)",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: 3,
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      NEXT EP
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.7)",
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      borderRadius: 3,
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                  >
                    SPEED
                  </button>
                  {isSeries && (
                    <button
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.7)",
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: 3,
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      EPISODES
                    </button>
                  )}
                  <CtrlBtn>
                    <Settings size={14} />
                  </CtrlBtn>
                  <CtrlBtn>
                    <Maximize size={14} />
                  </CtrlBtn>
                </div>
              </div>
            </div>
            </>
            )}
          </div>

          {/* Show title + meta */}
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {isVip && (
                    <span
                      style={{
                        padding: "1px 8px",
                        borderRadius: 2,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "linear-gradient(90deg,#ffc552,#ffdd9a)",
                        color: "#4e2d03",
                      }}
                    >
                      VIP
                    </span>
                  )}
                  {!isSeries && (
                    <span
                      style={{
                        padding: "1px 8px",
                        borderRadius: 2,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.7)",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Film size={10} />
                      MOVIE
                    </span>
                  )}
                  <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
                    {show.title}
                  </h1>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={13} fill="#ffc552" color="#ffc552" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#ffc552" }}>
                      {show.rating}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    {show.year}
                  </span>
                  {isSeries && (
                    <>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        {show.episodeCount} EPS
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                  {show.genre.split(" · ").map((g) => (
                    <span
                      key={g}
                      style={{
                        fontSize: 11,
                        color: "#00a9f5",
                        cursor: "pointer",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <ActionBtn
                  icon={<ThumbsUp size={14} fill={liked ? "#fff" : "none"} color={liked ? "#fff" : "#60a5fa"} />}
                  label={liked ? "LIKED" : "LIKE"}
                  active={liked}
                  color={{
                    bg: "rgba(59,130,246,0.08)",
                    border: "#3b82f6",
                    glow: "rgba(59,130,246,0.4)",
                    activeBg: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  }}
                  onClick={() => setLiked(!liked)}
                />
                <ActionBtn
                  icon={<Heart size={14} fill={saved ? "#fff" : "none"} color={saved ? "#fff" : "#f472b6"} />}
                  label={saved ? "SAVED" : "SAVE"}
                  active={saved}
                  color={{
                    bg: "rgba(244,114,182,0.08)",
                    border: "#f472b6",
                    glow: "rgba(244,114,182,0.4)",
                    activeBg: "linear-gradient(135deg,#db2777,#f472b6)",
                  }}
                  onClick={() => setSaved(!saved)}
                />
                <ActionBtn
                  icon={<Share2 size={14} color={shared ? "#fff" : "#34d399"} />}
                  label={shared ? "SHARED" : "SHARE"}
                  active={shared}
                  color={{
                    bg: "rgba(52,211,153,0.08)",
                    border: "#34d399",
                    glow: "rgba(52,211,153,0.4)",
                    activeBg: "linear-gradient(135deg,#059669,#34d399)",
                  }}
                  onClick={() => setShared(!shared)}
                />
                <div style={{ position: "relative" }}>
                  <ActionBtn
                    icon={<Download size={14} color={downloaded ? "#fff" : "#fb923c"} />}
                    label={downloaded ? `${downloadQuality}` : "DOWNLOAD"}
                    active={downloaded}
                    color={{
                      bg: "rgba(251,146,60,0.08)",
                      border: "#fb923c",
                      glow: "rgba(251,146,60,0.4)",
                      activeBg: "linear-gradient(135deg,#ea580c,#fb923c)",
                    }}
                    onClick={() => {
                      if (downloaded) { setDownloaded(false); setDownloadQuality(""); }
                      else setShowQualityPicker(!showQualityPicker);
                    }}
                  />
                  {showQualityPicker && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setShowQualityPicker(false)} />
                      <div style={{
                        position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                        transform: "translateX(-50%)", zIndex: 50,
                        background: "#1a1a2a", border: "1px solid rgba(251,146,60,0.3)",
                        borderRadius: 10, padding: "8px 6px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,146,60,0.1)",
                        minWidth: 110, animation: "qualityPop 0.15s ease",
                      }}>
                        <style>{`@keyframes qualityPop { from { opacity:0; transform:translateX(-50%) translateY(6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
                        <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(251,146,60,0.8)", textAlign: "center", paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                          Select Quality
                        </div>
                        {[
                          { label: "480p", sub: "SD · ~300MB" },
                          { label: "720p", sub: "HD · ~700MB" },
                          { label: "1080p", sub: "FHD · ~1.5GB" },
                          { label: "4K", sub: "UHD · ~4GB" },
                        ].map((q) => (
                          <button key={q.label} onClick={() => {
                            setDownloadQuality(q.label);
                            setDownloaded(true);
                            setShowQualityPicker(false);
                          }} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", padding: "7px 10px", borderRadius: 6,
                            background: "transparent", border: "none", cursor: "pointer",
                            transition: "background 0.15s", gap: 10,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(251,146,60,0.12)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <span style={{ fontSize: 13, fontWeight: 400, color: "#fff" }}>{q.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>{q.sub}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <ActionBtn
                  icon={subtitlesOn
                    ? <Check size={14} color="#fff" />
                    : <MessageSquare size={14} color="#c084fc" />}
                  label={subtitlesOn ? "SUB ON" : "SUBTITLES"}
                  active={subtitlesOn}
                  color={{
                    bg: "rgba(192,132,252,0.08)",
                    border: "#c084fc",
                    glow: "rgba(192,132,252,0.4)",
                    activeBg: "linear-gradient(135deg,#7c3aed,#c084fc)",
                  }}
                  onClick={() => setSubtitlesOn(!subtitlesOn)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                gap: 0,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? "#00a9f5" : "rgba(255,255,255,0.5)",
                    background: "transparent",
                    border: "none",
                    borderBottom: activeTab === tab ? "2px solid #00a9f5" : "2px solid transparent",
                    cursor: "pointer",
                    marginBottom: -1,
                    transition: "all 0.2s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              {activeTab === "EPISODES" && isSeries && (
                <div>
                  {/* Episode range selectors */}
                  {totalPages > 1 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setEpPage(i)}
                          style={{
                            padding: "3px 12px",
                            fontSize: 12,
                            borderRadius: 3,
                            border: epPage === i ? "1px solid #00a9f5" : "1px solid rgba(255,255,255,0.12)",
                            color: epPage === i ? "#00a9f5" : "rgba(255,255,255,0.45)",
                            background: epPage === i ? "rgba(0,169,245,0.1)" : "transparent",
                            cursor: "pointer",
                          }}
                        >
                          {i * EPS_PER_PAGE + 1}–{Math.min((i + 1) * EPS_PER_PAGE, episodes.length)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sort row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>SORT</span>
                    {["ASC", "DESC"].map((s, i) => (
                      <button
                        key={s}
                        style={{
                          fontSize: 12,
                          color: i === 0 ? "#00a9f5" : "rgba(255,255,255,0.4)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {visibleEpisodes.map((ep: any) => {
                      const epNum = ep.episodeNumber || ep.number;
                      return (
                        <button
                          key={ep.id || epNum}
                          onClick={() => setCurrentEp(epNum)}
                          style={{
                            padding: "8px 0",
                            fontSize: 13,
                            fontWeight: currentEp === epNum ? 600 : 400,
                            borderRadius: 4,
                            border: currentEp === epNum
                              ? "1px solid #00a9f5"
                              : "1px solid rgba(255,255,255,0.1)",
                            color: currentEp === epNum ? "#00a9f5" : "rgba(255,255,255,0.55)",
                            background: currentEp === epNum ? "rgba(0,169,245,0.08)" : "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {epNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "SYNOPSIS" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <img
                      src={show.coverUrl}
                      alt={show.title}
                      style={{
                        width: 90,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                        {show.title}
                      </h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {[
                          ["TYPE", isSeries ? "Series" : "Movie"],
                          ["GENRE", show.genre],
                          ["YEAR", String(show.year)],
                          ...(isSeries ? [["EPISODES", `${show.episodeCount} EPS`]] : []),
                          ["RATING", String(show.rating)],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                            <span style={{ color: "rgba(255,255,255,0.35)", width: 70 }}>{k}</span>
                            <span style={{ color: "rgba(255,255,255,0.75)" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.8,
                      maxWidth: 680,
                    }}
                  >
                    {show.description}
                  </p>
                </div>
              )}

              {activeTab === "RECOMMENDED" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 12,
                  }}
                >
                  {related.map((s) => (
                    <Link key={s.id} href={`/play/${s.id}`}>
                      <div style={{ cursor: "pointer" }}>
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
                            src={s.thumbnailUrl}
                            alt={s.title}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {s.badge && s.badge !== "none" && (
                            <span
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "1px 6px",
                                borderRadius: "0 6px 0 6px",
                                background:
                                  s.badge === "VIP"
                                    ? "linear-gradient(45deg,#ffc552,#ffdd9a)"
                                    : "linear-gradient(45deg,#00a3f5,#00c9fd)",
                                color: s.badge === "VIP" ? "#4e2d03" : "#fff",
                              }}
                            >
                              {s.badge}
                            </span>
                          )}
                          {s.type === "movie" && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: 4,
                                left: 4,
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "1px 5px",
                                borderRadius: 3,
                                background: "rgba(0,0,0,0.7)",
                                color: "rgba(255,255,255,0.8)",
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              MOVIE
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.8)",
                            marginTop: 6,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {s.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            marginTop: 2,
                          }}
                        >
                          {s.type === "series" ? `${s.episodeCount} EPS` : "Movie"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "sticky", top: 72 }}>
            {/* Show summary card */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <img
                  src={show.coverUrl}
                  alt={show.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{show.title}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <Star size={11} fill="#ffc552" color="#ffc552" />
                    <span style={{ fontSize: 12, color: "#ffc552", fontWeight: 600 }}>
                      {show.rating}
                    </span>
                    {isSeries && (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        · {show.episodeCount} EPS
                      </span>
                    )}
                    {!isSeries && (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        · Movie
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isVip && (
                <div style={{ padding: "10px 12px" }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: 4,
                      background: "linear-gradient(90deg,#ffc552,#ffdd9a)",
                      color: "#4e2d03",
                      fontSize: 13,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ★ JOIN VIP · WATCH NOW
                  </button>
                </div>
              )}
            </div>

            {/* Related shows */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 14,
                    borderRadius: 2,
                    background: "#00a9f5",
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>RELATED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {related.slice(0, 6).map((s) => (
                  <Link key={s.id} href={`/play/${s.id}`}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        cursor: "pointer",
                        borderRadius: 4,
                        padding: "4px",
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
                          width: 70,
                          height: 90,
                          borderRadius: 4,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#1a1a1a",
                          position: "relative",
                        }}
                      >
                        <img
                          src={s.thumbnailUrl}
                          alt={s.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {s.badge && s.badge !== "none" && (
                          <span
                            style={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 4px",
                              borderRadius: "0 4px 0 4px",
                              background:
                                s.badge === "VIP"
                                  ? "linear-gradient(45deg,#ffc552,#ffdd9a)"
                                  : "linear-gradient(45deg,#00a3f5,#00c9fd)",
                              color: s.badge === "VIP" ? "#4e2d03" : "#fff",
                            }}
                          >
                            {s.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.85)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.5,
                          }}
                        >
                          {s.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            marginTop: 4,
                          }}
                        >
                          {s.genre.split(" · ")[0]}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            marginTop: 2,
                          }}
                        >
                          {s.type === "series" ? `${s.episodeCount} EPS` : "Movie"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            marginTop: 4,
                          }}
                        >
                          <Star size={10} fill="#ffc552" color="#ffc552" />
                          <span style={{ fontSize: 11, color: "#ffc552" }}>{s.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        color: "rgba(255,255,255,0.85)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  icon,
  label,
  active,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  color: { bg: string; border: string; glow: string; activeBg: string };
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        background: active ? color.activeBg : color.bg,
        border: `1px solid ${active ? color.border : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8,
        cursor: "pointer",
        padding: "7px 10px",
        minWidth: 54,
        transition: "all 0.2s",
        boxShadow: active ? `0 3px 12px ${color.glow}` : "0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {icon}
      <span style={{
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: "0.07em",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
    </button>
  );
}
