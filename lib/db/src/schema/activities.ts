import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const actionTypeEnum = pgEnum("action_type", [
  "page_view", "content_play", "content_click", "search", "login", "logout",
  "signup", "subscription_view", "subscription_purchase", "profile_update",
  "watchlist_add", "watchlist_remove", "episode_play", "trailer_play"
]);

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email"),
  userPhone: text("user_phone"),
  actionType: actionTypeEnum("action_type").notNull(),
  contentId: integer("content_id"),
  contentTitle: text("content_title"),
  page: text("page"),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;
