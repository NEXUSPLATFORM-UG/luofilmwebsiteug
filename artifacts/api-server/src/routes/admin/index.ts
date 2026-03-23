import { Router } from "express";
import usersRouter from "./users";
import contentRouter from "./content";
import carouselRouter from "./carousel";
import subscriptionsRouter from "./subscriptions";
import walletRouter from "./wallet";
import transactionsRouter from "./transactions";
import activitiesRouter from "./activities";
import statsRouter from "./stats";

const router = Router();

router.use("/stats", statsRouter);
router.use("/users", usersRouter);
router.use("/content", contentRouter);
router.use("/carousel", carouselRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/wallet", walletRouter);
router.use("/transactions", transactionsRouter);
router.use("/activities", activitiesRouter);

export default router;
