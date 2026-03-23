import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, subscriptionsTable } from "@workspace/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, status, role } = req.query as Record<string, string>;
    let query = db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    const users = await query;
    let filtered = users;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        (u.phone || "").includes(s)
      );
    }
    if (status) filtered = filtered.filter(u => u.status === status);
    if (role) filtered = filtered.filter(u => u.role === role);
    res.json({ users: filtered, total: filtered.length });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    if (!user[0]) return res.status(404).json({ error: "User not found" });
    const subs = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.userId, Number(req.params.id))).orderBy(desc(subscriptionsTable.createdAt));
    res.json({ user: user[0], subscriptions: subs });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, role, status, country } = req.body;
    const [user] = await db.insert(usersTable).values({ name, email, phone, role: role || "user", status: status || "active", country }).returning();
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, role, status, country } = req.body;
    const [user] = await db.update(usersTable).set({ name, email, phone, role, status, country, updatedAt: new Date() }).where(eq(usersTable.id, Number(req.params.id))).returning();
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
