import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, usersTable, transactionsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const subs = await db.select({
      id: subscriptionsTable.id,
      userId: subscriptionsTable.userId,
      plan: subscriptionsTable.plan,
      status: subscriptionsTable.status,
      startDate: subscriptionsTable.startDate,
      endDate: subscriptionsTable.endDate,
      price: subscriptionsTable.price,
      currency: subscriptionsTable.currency,
      notes: subscriptionsTable.notes,
      activatedBy: subscriptionsTable.activatedBy,
      createdAt: subscriptionsTable.createdAt,
      updatedAt: subscriptionsTable.updatedAt,
      userName: usersTable.name,
      userEmail: usersTable.email,
      userPhone: usersTable.phone,
    }).from(subscriptionsTable)
      .leftJoin(usersTable, eq(subscriptionsTable.userId, usersTable.id))
      .orderBy(desc(subscriptionsTable.createdAt));

    const { status, plan } = req.query as Record<string, string>;
    let filtered = subs;
    if (status) filtered = filtered.filter(s => s.status === status);
    if (plan) filtered = filtered.filter(s => s.plan === plan);
    res.json({ subscriptions: filtered, total: filtered.length });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [sub] = await db.insert(subscriptionsTable).values(req.body).returning();
    res.json({ subscription: sub });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [sub] = await db.update(subscriptionsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(subscriptionsTable.id, Number(req.params.id))).returning();
    if (req.body.status === "active") {
      const user = await db.select().from(usersTable).where(eq(usersTable.id, sub.userId));
      if (user[0]) {
        await db.insert(transactionsTable).values({
          userId: sub.userId,
          userName: user[0].name,
          userEmail: user[0].email,
          userPhone: user[0].phone,
          type: "subscription",
          amount: sub.price || 0,
          status: "completed",
          description: `Subscription ${req.body.status}: ${sub.plan} plan`,
        });
      }
    }
    res.json({ subscription: sub });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
