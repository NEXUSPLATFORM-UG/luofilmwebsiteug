import { pgTable, serial, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const walletTable = pgTable("wallet", {
  id: serial("id").primaryKey(),
  balance: real("balance").default(0).notNull(),
  currency: text("currency").default("USD").notNull(),
  totalEarned: real("total_earned").default(0).notNull(),
  totalWithdrawn: real("total_withdrawn").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(walletTable).omit({ id: true, updatedAt: true });
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof walletTable.$inferSelect;
