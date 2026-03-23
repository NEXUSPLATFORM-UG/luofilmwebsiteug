import { Router } from "express";
import { db } from "@workspace/db";
import { carouselTable, featuredTable, contentTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/carousel", async (req, res) => {
  try {
    const items = await db.select().from(carouselTable).orderBy(carouselTable.page, carouselTable.sortOrder);
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/carousel", async (req, res) => {
  try {
    const [item] = await db.insert(carouselTable).values(req.body).returning();
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/carousel/:id", async (req, res) => {
  try {
    const [item] = await db.update(carouselTable).set(req.body).where(eq(carouselTable.id, Number(req.params.id))).returning();
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/carousel/:id", async (req, res) => {
  try {
    await db.delete(carouselTable).where(eq(carouselTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const items = await db.select().from(featuredTable).orderBy(featuredTable.page);
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/featured", async (req, res) => {
  try {
    const [item] = await db.insert(featuredTable).values(req.body).returning();
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/featured/:id", async (req, res) => {
  try {
    const [item] = await db.update(featuredTable).set(req.body).where(eq(featuredTable.id, Number(req.params.id))).returning();
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/featured/:id", async (req, res) => {
  try {
    await db.delete(featuredTable).where(eq(featuredTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/content-list", async (req, res) => {
  try {
    const items = await db.select({ id: contentTable.id, title: contentTable.title, type: contentTable.type }).from(contentTable).orderBy(contentTable.title);
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
