import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShowCard from "../components/ShowCard";
import { shows, bannerShows, trendingShows } from "../data/shows";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % bannerShows.length);
  }, [activeSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + bannerShows.length) % bannerShows.length);
  }, [activeSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentShow = bannerShows[activeSlide];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="pt-[70px]" />

      <section className="relative w-full overflow-hidden" style={{ height: "calc(56.25vw * 0.6)", minHeight: 300, maxHeight: 520 }}>
        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        >
          <img
            key={currentShow.id}
            src={currentShow.thumbnailUrl}
            alt={currentShow.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center px-10 md:px-16">
          <div className="max-w-md">
            <div className="inline-block px-2 py-0.5 mb-3 text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded">
              {currentShow.badge || "TRENDING"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
              {currentShow.title}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5 max-w-sm">
              {currentShow.description}
            </p>
            <div className="flex gap-3">
              <Link href={`/play/${currentShow.id}`}>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  ▶ Play Now
                </button>
              </Link>
              <Link href={`/play/${currentShow.id}`}>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white text-sm font-medium rounded-full hover:bg-white/25 transition-colors border border-white/20">
                  More Info
                </button>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all border border-white/10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all border border-white/10"
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-4 right-6 flex gap-1.5">
          {bannerShows.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      <div className="px-6 md:px-10 pb-16 space-y-10 mt-2">
        <ShowSection title="Trending" shows={trendingShows} />
        <ShowSection
          title="Drama · Romance"
          shows={shows.filter((s) =>
            s.genre.toLowerCase().includes("romance")
          )}
        />
        <ShowSection
          title="Fantasy · Adventure"
          shows={shows.filter((s) =>
            s.genre.toLowerCase().includes("fantasy") ||
            s.genre.toLowerCase().includes("wuxia")
          )}
        />
      </div>
    </div>
  );
}

function ShowSection({ title, shows }: { title: string; shows: typeof trendingShows }) {
  if (!shows.length) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-500 rounded-full inline-block" />
          {title}
        </h2>
        <button className="text-xs text-gray-500 hover:text-yellow-400 transition-colors font-medium">
          See All →
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
