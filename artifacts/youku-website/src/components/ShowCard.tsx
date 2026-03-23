import { Link } from "wouter";
import type { Show } from "../data/shows";

interface ShowCardProps {
  show: Show;
  size?: "sm" | "md" | "lg";
}

const badgeColors: Record<string, string> = {
  VIP: "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black",
  Exclusive: "bg-gradient-to-r from-blue-600 to-blue-400 text-white",
  Express: "bg-gradient-to-r from-red-600 to-red-400 text-white",
};

export default function ShowCard({ show, size = "md" }: ShowCardProps) {
  return (
    <Link href={`/play/${show.id}`}>
      <div className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-900 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/60 hover:z-10">
        <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
          <img
            src={show.thumbnailUrl}
            alt={show.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {show.badge && (
            <div className={`absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold rounded ${badgeColors[show.badge]}`}>
              {show.badge}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full py-1.5 rounded-md bg-white/90 hover:bg-white text-black text-xs font-semibold transition-colors">
              ▶ Play Now
            </button>
          </div>
        </div>

        <div className="p-2 pb-3">
          <h3 className="text-white text-sm font-medium leading-tight line-clamp-1 group-hover:text-yellow-300 transition-colors">
            {show.title}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{show.genre}</p>
        </div>
      </div>
    </Link>
  );
}
