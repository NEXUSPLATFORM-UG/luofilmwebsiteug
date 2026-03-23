import { Router } from "express";
import { db } from "@workspace/db";
import { contentTable, episodesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, status, search } = req.query as Record<string, string>;
    let items = await db.select().from(contentTable).orderBy(desc(contentTable.createdAt));
    if (type) items = items.filter(c => c.type === type);
    if (status) items = items.filter(c => c.status === status);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(c => c.title.toLowerCase().includes(s) || (c.genre || "").toLowerCase().includes(s));
    }
    res.json({ content: items, total: items.length });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [item] = await db.select().from(contentTable).where(eq(contentTable.id, Number(req.params.id)));
    if (!item) return res.status(404).json({ error: "Not found" });
    const eps = item.type === "series"
      ? await db.select().from(episodesTable).where(eq(episodesTable.seriesId, item.id)).orderBy(episodesTable.seasonNumber, episodesTable.episodeNumber)
      : [];
    res.json({ content: item, episodes: eps });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const [item] = await db.insert(contentTable).values(data).returning();
    res.json({ content: item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body, updatedAt: new Date() };
    const [item] = await db.update(contentTable).set(data).where(eq(contentTable.id, Number(req.params.id))).returning();
    res.json({ content: item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(contentTable).where(eq(contentTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id/episodes", async (req, res) => {
  try {
    const eps = await db.select().from(episodesTable).where(eq(episodesTable.seriesId, Number(req.params.id))).orderBy(episodesTable.seasonNumber, episodesTable.episodeNumber);
    res.json({ episodes: eps });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/:id/episodes", async (req, res) => {
  try {
    const data = { ...req.body, seriesId: Number(req.params.id) };
    const [ep] = await db.insert(episodesTable).values(data).returning();
    await db.update(contentTable).set({ episodeCount: (await db.select().from(episodesTable).where(eq(episodesTable.seriesId, Number(req.params.id)))).length }).where(eq(contentTable.id, Number(req.params.id)));
    res.json({ episode: ep });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id/episodes/:epId", async (req, res) => {
  try {
    const [ep] = await db.update(episodesTable).set({ ...req.body, updatedAt: new Date() }).where(eq(episodesTable.id, Number(req.params.epId))).returning();
    res.json({ episode: ep });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id/episodes/:epId", async (req, res) => {
  try {
    await db.delete(episodesTable).where(eq(episodesTable.id, Number(req.params.epId)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
