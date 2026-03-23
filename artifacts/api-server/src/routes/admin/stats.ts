import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, contentTable, subscriptionsTable, transactionsTable, activitiesTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [{ count: totalUsers }] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
    const [{ count: totalContent }] = await db.select({ count: sql<number>`count(*)` }).from(contentTable);
    const [{ count: activeSubscriptions }] = await db.select({ count: sql<number>`count(*)` }).from(subscriptionsTable).where(sql`status = 'active'`);
    const [{ count: totalActivities }] = await db.select({ count: sql<number>`count(*)` }).from(activitiesTable);
    const recentTxs = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt)).limit(5);
    const recentUsers = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(5);
    const recentActivities = await db.select().from(activitiesTable).orderBy(desc(activitiesTable.createdAt)).limit(10);
    const [{ total: totalRevenue }] = await db.select({ total: sql<number>`coalesce(sum(amount), 0)` }).from(transactionsTable).where(sql`type = 'subscription' and status = 'completed'`);

    res.json({
      stats: {
        totalUsers: Number(totalUsers),
        totalContent: Number(totalContent),
        activeSubscriptions: Number(activeSubscriptions),
        totalActivities: Number(totalActivities),
        totalRevenue: Number(totalRevenue) || 0,
      },
      recentTxs,
      recentUsers,
      recentActivities,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
