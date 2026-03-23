import { Router } from "express";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, status, search } = req.query as Record<string, string>;
    let txs = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt));
    if (type) txs = txs.filter(t => t.type === type);
    if (status) txs = txs.filter(t => t.status === status);
    if (search) {
      const s = search.toLowerCase();
      txs = txs.filter(t =>
        (t.userName || "").toLowerCase().includes(s) ||
        (t.userEmail || "").toLowerCase().includes(s) ||
        (t.userPhone || "").includes(s) ||
        (t.description || "").toLowerCase().includes(s)
      );
    }
    const total = txs.reduce((sum, t) => sum + (t.amount || 0), 0);
    res.json({ transactions: txs, count: txs.length, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
