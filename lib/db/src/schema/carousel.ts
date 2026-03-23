import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contentTable } from "./content";

export const carouselPageEnum = pgEnum("carousel_page", ["home", "drama", "movie", "variety", "sports", "documentary", "anime"]);

export const carouselTable = pgTable("carousel_items", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentTable.id, { onDelete: "cascade" }),
  page: carouselPageEnum("page").default("home").notNull(),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  customTitle: text("custom_title"),
  customDescription: text("custom_description"),
  customImageUrl: text("custom_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const featuredTable = pgTable("featured_items", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentTable.id, { onDelete: "cascade" }),
  page: carouselPageEnum("page").default("home").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCarouselSchema = createInsertSchema(carouselTable).omit({ id: true, createdAt: true });
export const insertFeaturedSchema = createInsertSchema(featuredTable).omit({ id: true, createdAt: true });
export type InsertCarousel = z.infer<typeof insertCarouselSchema>;
export type InsertFeatured = z.infer<typeof insertFeaturedSchema>;
export type Carousel = typeof carouselTable.$inferSelect;
export type Featured = typeof featuredTable.$inferSelect;
