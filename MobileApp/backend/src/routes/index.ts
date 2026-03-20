import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import cotisationRoutes from "./cotisation.routes";
import discussionRoutes from "./discussion.routes";
import messageRoutes from "./message.routes";
import invitationRoutes from "./invitation.routes";
import premiumRoutes from "./premium.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "../services/upload.service";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cotisations", cotisationRoutes);
router.use("/discussions", discussionRoutes);
router.use("/messages", messageRoutes);
router.use("/invitations", invitationRoutes);
router.use("/premium", premiumRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

export default router;
