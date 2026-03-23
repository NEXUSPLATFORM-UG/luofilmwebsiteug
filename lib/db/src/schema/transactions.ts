import { pgTable, serial, text, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const txTypeEnum = pgEnum("tx_type", ["subscription", "withdrawal", "topup", "refund", "adjustment"]);
export const txStatusEnum = pgEnum("tx_status", ["pending", "completed", "failed", "cancelled"]);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userName: text("user_name"),
  userEmail: text("user_email"),
  userPhone: text("user_phone"),
  type: txTypeEnum("type").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  status: txStatusEnum("status").default("completed"),
  description: text("description"),
  reference: text("reference"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
