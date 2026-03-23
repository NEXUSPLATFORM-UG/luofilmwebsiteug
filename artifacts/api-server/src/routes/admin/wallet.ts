import { Router } from "express";
import { db } from "@workspace/db";
import { walletTable, transactionsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

const router = Router();

async function getOrCreateWallet() {
  const wallets = await db.select().from(walletTable);
  if (wallets.length === 0) {
    const [w] = await db.insert(walletTable).values({ balance: 0, totalEarned: 0, totalWithdrawn: 0 }).returning();
    return w;
  }
  return wallets[0];
}

router.get("/", async (req, res) => {
  try {
    const wallet = await getOrCreateWallet();
    res.json({ wallet });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/withdraw", async (req, res) => {
  try {
    const { amount, description, method, accountDetails } = req.body;
    const wallet = await getOrCreateWallet();
    if (wallet.balance < amount) return res.status(400).json({ error: "Insufficient balance" });
    const [updated] = await db.update(walletTable).set({
      balance: wallet.balance - amount,
      totalWithdrawn: wallet.totalWithdrawn + amount,
      updatedAt: new Date(),
    }).where(eq(walletTable.id, wallet.id)).returning();
    const [tx] = await db.insert(transactionsTable).values({
      type: "withdrawal",
      amount: -amount,
      status: "completed",
      description: description || `Withdrawal via ${method}`,
      metadata: JSON.stringify({ method, accountDetails }),
    }).returning();
    res.json({ wallet: updated, transaction: tx });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/topup", async (req, res) => {
  try {
    const { amount, description } = req.body;
    const wallet = await getOrCreateWallet();
    const [updated] = await db.update(walletTable).set({
      balance: wallet.balance + amount,
      totalEarned: wallet.totalEarned + amount,
      updatedAt: new Date(),
    }).where(eq(walletTable.id, wallet.id)).returning();
    await db.insert(transactionsTable).values({
      type: "topup",
      amount,
      status: "completed",
      description: description || "Manual topup",
    });
    res.json({ wallet: updated });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
