# Luo Film Site

## Overview

Serverless streaming website (YOUKU-style) built with React + Vite + Firebase. No backend server — the frontend communicates directly with Firebase Firestore for data and Firebase Auth for authentication. Deployable to Vercel as a static site.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: Wouter
- **Auth**: Firebase Auth (email/password + Google Sign-In)
- **Database**: Firebase Firestore (NoSQL)
- **Hosting**: Vercel (static SPA)
- **Monorepo tool**: pnpm workspaces

## Architecture

Fully serverless — no Express/Node backend. All data reads/writes go directly to Firestore via the Firebase SDK. Admin access is role-gated via Firestore (`users/{uid}.role === "admin"`).

## Structure

```text
artifacts/
└── youku-website/         # React + Vite SPA
    ├── src/
    │   ├── admin/         # Admin dashboard (ContentManager, EpisodesManager, etc.)
    │   ├── components/    # Header, AuthModal, etc.
    │   ├── contexts/      # AuthContext (Firebase Auth)
    │   ├── data/          # Static fallback show data
    │   ├── lib/
    │   │   ├── firebase.ts      # Firebase app init (Auth + Firestore)
    │   │   └── firebaseApi.ts   # Firestore CRUD helpers (fbApi)
    │   └── pages/         # HomePage, CategoryPage, PlayPage
    ├── vercel.json        # Vercel deploy config (SPA rewrites)
    └── vite.config.ts     # Vite config (PORT/BASE_PATH optional)
```

## Firebase Project

- Project ID: `luo-film-site`
- Auth: email/password + Google OAuth
- Firestore collections: `users`, `content`, `episodes` (subcollection), `carousel`, `featured`, `subscriptions`, `wallet`, `transactions`, `activities`, `likes`, `watchlist`
- **Note**: The `likes` and `watchlist` collections require Firestore security rules that allow public reads/writes (or at least unauthenticated reads/writes). Add this to Firebase Console → Firestore → Rules:
  ```
  match /likes/{id} { allow read, write: if true; }
  match /watchlist/{id} { allow read, write: if true; }
  ```

## Deploying to Vercel

1. Connect the repo to Vercel
2. Set Root Directory to `artifacts/youku-website`
3. Build command: `cd ../.. && pnpm --filter @workspace/youku-website run build`
4. Output directory: `dist/public`
5. No environment variables needed (Firebase config is baked into the build)

## Admin Access

Set `role: "admin"` on a user's Firestore document (`users/{uid}`) to grant admin dashboard access. The admin button only appears in the header for admin users.

## Content URLs

All media (thumbnails, covers, videos) is stored as URLs in Firestore. Admins paste URLs from any CDN (Cloudflare, Bunny, YouTube, etc.) into the admin forms — no file upload infrastructure needed.
