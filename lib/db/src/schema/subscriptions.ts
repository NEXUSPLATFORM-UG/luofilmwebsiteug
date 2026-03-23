import { pgTable, serial, text, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const subPlanEnum = pgEnum("sub_plan", ["free", "basic", "standard", "premium"]);
export const subStatusEnum = pgEnum("sub_status", ["active", "inactive", "expired", "cancelled"]);

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  plan: subPlanEnum("plan").default("free").notNull(),
  status: subStatusEnum("status").default("inactive").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  price: real("price").default(0),
  currency: text("currency").default("USD"),
  notes: text("notes"),
  activatedBy: text("activated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;
