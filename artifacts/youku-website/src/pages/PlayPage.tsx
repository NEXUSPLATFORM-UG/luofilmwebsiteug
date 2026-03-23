import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  Play,
  ChevronLeft,
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
} from "lucide-react";
import { shows } from "../data/shows";

export default function PlayPage() {
  const params = useParams<{ id: string }>();
  const show = shows.find((s) => s.id === params.id) || shows[0];

  const [currentEp, setCurrentEp] = useState(1);
  const [epPage, setEpPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"选集" | "推荐" | "简介">("选集");
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoverPlayer, setHoverPlayer] = useState(false);

  const episodes = Array.from({ length: show.episodeCount }, (_, i) => ({ number: i + 1 }));
  const EPS_PER_PAGE = 30;
  const totalPages = Math.ceil(episodes.length / EPS_PER_PAGE);
  const visibleEpisodes = episodes.slice(epPage * EPS_PER_PAGE, (epPage + 1) * EPS_PER_PAGE);
  const related = shows.filter((s) => s.id !== show.id).slice(0, 8);

  const isVip = show.badge === "VIP";

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", color: "#fff" }}>
      <div style={{ height: 70 }} />

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
          <span style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>首页</span>
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
            onClick={() => setIsPlaying(!isPlaying)}
          >
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
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                    第{currentEp}集
                  </p>
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
                    ★ VIP 专享内容
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
                  <CtrlBtn>
                    <SkipForward size={16} />
                  </CtrlBtn>
                  <CtrlBtn>
                    <Volume2 size={16} />
                  </CtrlBtn>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    00:00 / 45:00
                  </span>
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
                    下一集
                  </button>
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
                    倍速
                  </button>
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
                    选集
                  </button>
                  <CtrlBtn>
                    <Settings size={14} />
                  </CtrlBtn>
                  <CtrlBtn>
                    <Maximize size={14} />
                  </CtrlBtn>
                </div>
              </div>
            </div>
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
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>|</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    共{show.episodeCount}集
                  </span>
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
                  icon={<ThumbsUp size={15} fill={liked ? "#00a9f5" : "none"} color={liked ? "#00a9f5" : "rgba(255,255,255,0.6)"} />}
                  label={liked ? "已点赞" : "点赞"}
                  active={liked}
                  onClick={() => setLiked(!liked)}
                />
                <ActionBtn
                  icon={<Heart size={15} color="rgba(255,255,255,0.6)" />}
                  label="收藏"
                />
                <ActionBtn
                  icon={<Share2 size={15} color="rgba(255,255,255,0.6)" />}
                  label="分享"
                />
                <ActionBtn
                  icon={<Download size={15} color="rgba(255,255,255,0.6)" />}
                  label="下载"
                />
                <ActionBtn
                  icon={<MessageSquare size={15} color="rgba(255,255,255,0.6)" />}
                  label="弹幕"
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
              {(["选集", "推荐", "简介"] as const).map((tab) => (
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
              {activeTab === "选集" && (
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
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>排列</span>
                    {["正序", "倒序"].map((s, i) => (
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
                    {visibleEpisodes.map((ep) => (
                      <button
                        key={ep.number}
                        onClick={() => setCurrentEp(ep.number)}
                        style={{
                          padding: "8px 0",
                          fontSize: 13,
                          fontWeight: currentEp === ep.number ? 600 : 400,
                          borderRadius: 4,
                          border: currentEp === ep.number
                            ? "1px solid #00a9f5"
                            : "1px solid rgba(255,255,255,0.1)",
                          color: currentEp === ep.number ? "#00a9f5" : "rgba(255,255,255,0.55)",
                          background: currentEp === ep.number ? "rgba(0,169,245,0.08)" : "rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {ep.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "简介" && (
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
                          ["类型", show.genre],
                          ["年份", String(show.year)],
                          ["集数", `共${show.episodeCount}集`],
                          ["评分", String(show.rating)],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                            <span style={{ color: "rgba(255,255,255,0.35)", width: 40 }}>{k}</span>
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

              {activeTab === "推荐" && (
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
                          {s.episodeCount}集
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
          <div style={{ position: "sticky", top: 86 }}>
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
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      · {show.episodeCount}集
                    </span>
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
                    ★ 开通VIP · 立即观看
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
                <span style={{ fontSize: 14, fontWeight: 600 }}>相关推荐</span>
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
                          {s.episodeCount}集
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 6px",
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 10,
          color: active ? "#00a9f5" : "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </span>
    </button>
  );
}
