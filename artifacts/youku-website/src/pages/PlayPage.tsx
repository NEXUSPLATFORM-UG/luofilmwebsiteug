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
  Subtitles,
} from "lucide-react";
import { shows } from "../data/shows";
import ShowCard from "../components/ShowCard";

export default function PlayPage() {
  const params = useParams<{ id: string }>();
  const show = shows.find((s) => s.id === params.id) || shows[0];

  const [currentEp, setCurrentEp] = useState(1);
  const [epPage, setEpPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"Episodes" | "Highlights" | "Synopsis">("Episodes");
  const [liked, setLiked] = useState(false);

  const EPS_PER_PAGE = 10;
  const totalPages = Math.ceil(show.episodes.length / EPS_PER_PAGE);
  const visibleEpisodes = show.episodes.slice(epPage * EPS_PER_PAGE, (epPage + 1) * EPS_PER_PAGE);
  const related = shows.filter((s) => s.id !== show.id).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="pt-[70px]" />

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-4">
        <Link href="/">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} />
            Back to Home
          </button>
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div
              className="relative w-full bg-black rounded-xl overflow-hidden group"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src={show.coverUrl}
                alt={show.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm mb-4 cursor-pointer hover:bg-white/20 hover:scale-110 transition-all">
                  <Play size={32} fill="white" className="ml-1" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">{show.title}</p>
                  <p className="text-gray-400 text-sm mt-1">Episode {currentEp}</p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 pb-3 pt-10">
                <div className="flex items-center gap-1 mb-2">
                  <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full w-0 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <Play size={18} fill="white" />
                    </button>
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <SkipForward size={18} />
                    </button>
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <Volume2 size={18} />
                    </button>
                    <span className="text-gray-400 text-xs">00:00 / 45:00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <Subtitles size={16} />
                    </button>
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <Settings size={16} />
                    </button>
                    <button className="text-white hover:text-yellow-300 transition-colors">
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-white">{show.title}</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Ep{currentEp} · {show.genre} · {show.year} · {show.episodeCount} Episodes
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${
                      liked
                        ? "border-red-500 text-red-400 bg-red-500/10"
                        : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <Heart size={14} fill={liked ? "currentColor" : "none"} />
                    {liked ? "Liked" : "Like"}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/40 text-sm transition-all">
                    <Share2 size={14} />
                    Share
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 text-sm transition-all">
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-semibold">{show.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {show.genre.split(" · ").map((g) => (
                    <span key={g} className="px-2 py-0.5 bg-white/8 text-gray-400 text-xs rounded border border-white/10">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex gap-1 border-b border-white/10 mb-4">
                {(["Episodes", "Highlights", "Synopsis"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                      activeTab === tab
                        ? "border-yellow-400 text-yellow-400"
                        : "border-transparent text-gray-500 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Episodes" && (
                <div>
                  {totalPages > 1 && (
                    <div className="flex gap-1.5 mb-4">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setEpPage(i)}
                          className={`px-3 py-1 text-xs rounded border transition-all ${
                            epPage === i
                              ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                              : "border-white/15 text-gray-500 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {i * EPS_PER_PAGE + 1}–{Math.min((i + 1) * EPS_PER_PAGE, show.episodes.length)}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {visibleEpisodes.map((ep) => (
                      <button
                        key={ep.number}
                        onClick={() => setCurrentEp(ep.number)}
                        className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                          currentEp === ep.number
                            ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                            : "border-white/10 text-gray-400 hover:border-white/25 hover:text-white bg-white/3"
                        }`}
                      >
                        {ep.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Synopsis" && (
                <div className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                  <p>{show.description}</p>
                </div>
              )}

              {activeTab === "Highlights" && (
                <div className="text-gray-500 text-sm py-4">
                  No highlights available yet.
                </div>
              )}
            </div>
          </div>

          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-[86px] space-y-6">
              <div className="bg-white/4 border border-white/8 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={show.coverUrl}
                    alt={show.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-sm">{show.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{show.genre}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} fill="#eab308" className="text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">{show.rating}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {show.episodeCount} Episodes · {show.year}
                    </p>
                  </div>
                </div>
                {show.badge && (
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-bold rounded ${
                        show.badge === "VIP"
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {show.badge === "VIP"
                        ? "VIP Members Only"
                        : show.badge}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-yellow-500 rounded-full" />
                  More Like This
                </h4>
                <div className="space-y-3">
                  {related.map((s) => (
                    <Link key={s.id} href={`/play/${s.id}`}>
                      <div className="flex gap-3 group cursor-pointer rounded-lg hover:bg-white/5 p-1.5 transition-colors">
                        <img
                          src={s.thumbnailUrl}
                          alt={s.title}
                          className="w-16 h-20 object-cover rounded-md shrink-0"
                        />
                        <div className="min-w-0 py-1">
                          <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-yellow-300 transition-colors">
                            {s.title}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">{s.genre}</p>
                          <p className="text-gray-600 text-xs mt-0.5">
                            {s.episodeCount} Eps
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={10} fill="#eab308" className="text-yellow-400" />
                            <span className="text-yellow-400 text-xs">{s.rating}</span>
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
    </div>
  );
}
