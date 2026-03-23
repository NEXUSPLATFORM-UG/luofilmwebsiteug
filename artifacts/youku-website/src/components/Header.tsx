import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Tv, Clock, Globe, Star, User, X } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Drama", path: "/?genre=drama" },
  { label: "Movie", path: "/?genre=movie" },
  { label: "All", path: "/?genre=all" },
];

export default function Header() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-0" style={{ height: 70 }}>
        <div className="flex items-center gap-10">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer select-none group">
              <div className="relative">
                <div
                  className="text-xl font-black tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, #e8d5a3 0%, #f5e6c0 40%, #c9a84c 70%, #e8d5a3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "0.15em",
                    textShadow: "none",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                >
                  TRUE LIGHT
                </div>
                <div
                  className="text-xs font-semibold tracking-[0.5em] uppercase mt-[-4px]"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c 0%, #e8d5a3 50%, #c9a84c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "0.55em",
                  }}
                >
                  STUDIO
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-yellow-600/50 to-transparent mx-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_2px_rgba(234,179,8,0.6)] animate-pulse" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.path || (link.path === "/" && location === "/");
              return (
                <Link key={link.label} href={link.path}>
                  <span
                    className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 w-56 transition-all">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search a show"
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
              />
              <button onClick={() => { setSearchOpen(false); setSearchValue(""); }}>
                <X size={14} className="text-gray-400 hover:text-white ml-1" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <Search size={18} />
            </button>
          )}

          <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <Tv size={18} />
          </button>
          <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <Clock size={18} />
          </button>
          <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <Globe size={18} />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/60 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 text-xs font-semibold transition-all hover:bg-yellow-500/10">
            <Star size={12} fill="currentColor" />
            VIP
          </button>

          <button className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-white/10 hover:bg-white/20 transition-colors">
            <User size={16} className="text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
