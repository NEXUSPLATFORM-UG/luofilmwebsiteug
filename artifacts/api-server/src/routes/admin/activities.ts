import { Router } from "express";
import { db } from "@workspace/db";
import { activitiesTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { actionType, search, page = "1", limit = "100" } = req.query as Record<string, string>;
    let acts = await db.select().from(activitiesTable).orderBy(desc(activitiesTable.createdAt)).limit(Number(limit)).offset((Number(page) - 1) * Number(limit));
    if (actionType) acts = acts.filter(a => a.actionType === actionType);
    if (search) {
      const s = search.toLowerCase();
      acts = acts.filter(a =>
        (a.userName || "").toLowerCase().includes(s) ||
        (a.userEmail || "").toLowerCase().includes(s) ||
        (a.userPhone || "").includes(s) ||
        (a.contentTitle || "").toLowerCase().includes(s) ||
        (a.page || "").toLowerCase().includes(s)
      );
    }
    res.json({ activities: acts, count: acts.length });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [act] = await db.insert(activitiesTable).values(req.body).returning();
    res.json({ activity: act });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
