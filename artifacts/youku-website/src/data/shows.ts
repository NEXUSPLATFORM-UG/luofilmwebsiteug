export interface Show {
  id: string;
  title: string;
  episodeCount: number;
  isVip: boolean;
  badge?: "VIP" | "Exclusive" | "Express";
  genre: string;
  year: number;
  rating: number;
  description: string;
  coverUrl: string;
  thumbnailUrl: string;
  episodes: Episode[];
}

export interface Episode {
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
}

const BASE = "?x-oss-process=image/resize,w_385/interlace,1/quality,Q_80";

export const shows: Show[] = [
  {
    id: "love-is-panacea",
    title: "Love is Panacea",
    episodeCount: 34,
    isVip: true,
    badge: "VIP",
    genre: "Romance · Medical Drama",
    year: 2023,
    rating: 8.7,
    description:
      "When Gu Yunzheng, an associate professor of neurosurgery, goes on a medical aid mission in Lacaya, he meets Su Wei'an, a local doctor. United by their passion for medicine and a shared mission, their professional bond gradually blossoms into a deep and tender love. Together they face challenges that test their courage, conviction, and the strength of their connection.",
    coverUrl:
      "https://m.ykimg.com/0542010165434D4EF8E973F1F64B42A2",
    thumbnailUrl:
      "https://m.ykimg.com/05840000654A09E913EBC61B39CE297A" + BASE,
    episodes: Array.from({ length: 34 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail: "https://m.ykimg.com/0542010165434D4EF8E973F1F64B42A2",
      duration: "45:00",
    })),
  },
  {
    id: "princess-werewolf",
    title: "The Princess and the Werewolf",
    episodeCount: 24,
    isVip: true,
    badge: "VIP",
    genre: "Fantasy · Romance",
    year: 2023,
    rating: 8.4,
    description:
      "A headstrong princess discovers the man she's been arranged to marry is hiding a powerful secret. As ancient prophecies unfold, they must choose between duty and destiny — and the love growing between them.",
    coverUrl:
      "https://m.ykimg.com/0584000064BA54931427220BD94687F1" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/0584000064BA54931427220BD94687F1" + BASE,
    episodes: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/0584000064BA54931427220BD94687F1" + BASE,
      duration: "42:00",
    })),
  },
  {
    id: "everyone-loves-me",
    title: "Everyone Loves Me",
    episodeCount: 30,
    isVip: true,
    badge: "VIP",
    genre: "Romance · Comedy",
    year: 2024,
    rating: 8.9,
    description:
      "A cheerful and optimistic young woman navigates the complexities of modern love when three very different men fall for her at the same time. A witty, heartwarming story about finding real connection in an age of endless choices.",
    coverUrl:
      "https://m.ykimg.com/0584000065E0849D2027901CB107BD2F" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/0584000065E0849D2027901CB107BD2F" + BASE,
    episodes: Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/0584000065E0849D2027901CB107BD2F" + BASE,
      duration: "44:00",
    })),
  },
  {
    id: "snow-moon",
    title: "The Snow Moon",
    episodeCount: 36,
    isVip: true,
    badge: "Exclusive",
    genre: "Historical · Romance",
    year: 2023,
    rating: 8.6,
    description:
      "In a kingdom ruled by snow and silence, a young court musician falls for a general who has sworn to never love again. Their forbidden romance unfolds across battlefields and palace halls, where every moment together could be their last.",
    coverUrl:
      "https://m.ykimg.com/05840000636109B813EBC6095DF70CE8" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/05840000636109B813EBC6095DF70CE8" + BASE,
    episodes: Array.from({ length: 36 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/05840000636109B813EBC6095DF70CE8" + BASE,
      duration: "46:00",
    })),
  },
  {
    id: "back-from-brink",
    title: "Back From The Brink",
    episodeCount: 40,
    isVip: false,
    badge: "Express",
    genre: "Fantasy · Adventure",
    year: 2023,
    rating: 9.1,
    description:
      "A young man inherits a forbidden power that marks him for death — until he is saved by a dragon in human form. Bound by fate and chased by enemies, they embark on a legendary journey that rewrites the laws of heaven and earth.",
    coverUrl:
      "https://m.ykimg.com/0584000062C7F2301FD8520912A229F2" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/0584000062C7F2301FD8520912A229F2" + BASE,
    episodes: Array.from({ length: 40 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/0584000062C7F2301FD8520912A229F2" + BASE,
      duration: "47:00",
    })),
  },
  {
    id: "my-destiny",
    title: "My Destiny",
    episodeCount: 28,
    isVip: true,
    badge: "VIP",
    genre: "Romance · Drama",
    year: 2024,
    rating: 8.3,
    description:
      "Two strangers find themselves inexplicably drawn together by a series of seemingly coincidental meetings. As they slowly uncover the invisible threads that have linked their lives for years, they must decide if destiny is something to be followed — or rewritten.",
    coverUrl:
      "https://m.ykimg.com/0584000068D0C04513EFA312E2C35926" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/0584000068D0C04513EFA312E2C35926" + BASE,
    episodes: Array.from({ length: 28 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/0584000068D0C04513EFA312E2C35926" + BASE,
      duration: "43:00",
    })),
  },
  {
    id: "beyond-times-gaze",
    title: "Beyond Time's Gaze",
    episodeCount: 32,
    isVip: true,
    badge: "VIP",
    genre: "Sci-Fi · Romance",
    year: 2024,
    rating: 8.8,
    description:
      "A historian with the ability to glimpse the past meets an enigmatic man who seems to exist outside of time. Their impossible love story spans centuries, forcing them to question what is real, what is memory, and whether love can survive across ages.",
    coverUrl:
      "https://m.ykimg.com/05840000677C8A4113FAB41397BDC48E" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/05840000677C8A4113FAB41397BDC48E" + BASE,
    episodes: Array.from({ length: 32 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/05840000677C8A4113FAB41397BDC48E" + BASE,
      duration: "44:00",
    })),
  },
  {
    id: "threads-of-fate",
    title: "Threads of Fate",
    episodeCount: 38,
    isVip: true,
    badge: "Exclusive",
    genre: "Wuxia · Historical",
    year: 2023,
    rating: 8.5,
    description:
      "Set against the backdrop of a turbulent war era, a skilled female warrior and a mysterious strategist fight on opposite sides of a conflict — yet find themselves falling for each other. Their love is forged in fire and tested by war, sacrifice, and betrayal.",
    coverUrl:
      "https://m.ykimg.com/0584000064B7AC3C13EBC60C0FD4FC43" + BASE,
    thumbnailUrl:
      "https://m.ykimg.com/0584000064B7AC3C13EBC60C0FD4FC43" + BASE,
    episodes: Array.from({ length: 38 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      thumbnail:
        "https://m.ykimg.com/0584000064B7AC3C13EBC60C0FD4FC43" + BASE,
      duration: "46:00",
    })),
  },
];

export const bannerShows = shows.slice(0, 6);
export const trendingShows = shows;
export const dramaShows = shows.filter((s) =>
  s.genre.toLowerCase().includes("romance")
);
export const movieShows = shows.filter((s) =>
  s.genre.toLowerCase().includes("fantasy") ||
  s.genre.toLowerCase().includes("historical")
);
