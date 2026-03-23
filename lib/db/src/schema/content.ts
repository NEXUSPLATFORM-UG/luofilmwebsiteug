import { pgTable, serial, text, timestamp, pgEnum, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentTypeEnum = pgEnum("content_type", ["movie", "series"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "published", "archived"]);
export const badgeEnum = pgEnum("badge_type", ["none", "VIP", "Express", "New"]);

export const contentTable = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: contentTypeEnum("type").notNull(),
  genre: text("genre").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  coverUrl: text("cover_url"),
  videoUrl: text("video_url"),
  trailerUrl: text("trailer_url"),
  year: integer("year"),
  rating: real("rating").default(0),
  badge: badgeEnum("badge").default("none"),
  episodeCount: integer("episode_count").default(0),
  duration: integer("duration"),
  views: integer("views").default(0),
  status: contentStatusEnum("status").default("published"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contentTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contentTable.$inferSelect;
