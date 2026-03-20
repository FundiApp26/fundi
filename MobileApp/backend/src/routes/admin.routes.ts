// @ts-nocheck
import { Router, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { invalidateConfigCache } from "../services/config.service";

const router = Router();

// Admin middleware: check user is admin (for MVP, use env var ADMIN_PHONES)
function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  const adminPhones = (process.env.ADMIN_PHONES || "").split(",").map((p) => p.trim());
  // Will be checked after auth middleware sets userId
  prisma.user.findUnique({ where: { id: req.userId } }).then((user) => {
    if (!user || !adminPhones.includes(user.phone)) {
      return res.status(403).json({ error: "Accès admin requis" });
    }
    next();
  });
}

router.use(authMiddleware);
router.use(adminOnly);

// ============================================================
// DASHBOARD METRICS
// ============================================================

// GET /api/admin/dashboard — Overview metrics
router.get("/dashboard", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers, premiumUsers, onlineUsers,
      totalCotisations, activeCotisations, completedCotisations,
      totalPayments, successPayments, failedPayments,
      todayRegistrations, monthRegistrations, lastMonthRegistrations,
      totalMessages, todayMessages,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.user.count({ where: { isOnline: true } }),
      prisma.cotisation.count(),
      prisma.cotisation.count({ where: { status: "active" } }),
      prisma.cotisation.count({ where: { status: "completed" } }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: "paid" } }),
      prisma.payment.count({ where: { status: "failed" } }),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
      prisma.message.count(),
      prisma.message.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.premiumTransaction.aggregate({ where: { status: "completed" }, _sum: { amount: true } }),
    ]);

    const growthRate = lastMonthRegistrations > 0
      ? ((monthRegistrations - lastMonthRegistrations) / lastMonthRegistrations * 100).toFixed(1)
      : "N/A";

    res.json({
      users: { total: totalUsers, premium: premiumUsers, online: onlineUsers, todayNew: todayRegistrations, monthNew: monthRegistrations, growthRate },
      cotisations: { total: totalCotisations, active: activeCotisations, completed: completedCotisations },
      payments: { total: totalPayments, success: successPayments, failed: failedPayments, successRate: totalPayments > 0 ? ((successPayments / totalPayments) * 100).toFixed(1) : "0" },
      messages: { total: totalMessages, today: todayMessages },
      revenue: { total: totalRevenue._sum.amount || 0, currency: "XAF" },
    });
  } catch (err) { next(err); }
});

// GET /api/admin/dashboard/chart — Registration trends (last 30 days)
router.get("/dashboard/chart", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const days = 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const count = await prisma.user.count({ where: { createdAt: { gte: start, lt: end } } });
      data.push({ date: start.toISOString().split("T")[0], registrations: count });
    }
    res.json(data);
  } catch (err) { next(err); }
});

// ============================================================
// USERS MANAGEMENT
// ============================================================

// GET /api/admin/users — List users with pagination, search, filters
router.get("/users", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const filter = req.query.filter as string; // all, premium, free, online

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }
    if (filter === "premium") where.isPremium = true;
    if (filter === "free") where.isPremium = false;
    if (filter === "online") where.isOnline = true;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, phone: true, firstName: true, lastName: true, avatarUrl: true,
          isPremium: true, premiumUntil: true, isOnline: true, monthlySends: true,
          createdAt: true, lastSeenAt: true,
          _count: { select: { memberships: true, payments: true, messages: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/admin/users/:id — User detail
router.get("/users/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        memberships: { include: { cotisation: { select: { id: true, name: true, amount: true, status: true } } } },
        payments: { orderBy: { createdAt: "desc" }, take: 20, include: { tour: { include: { cotisation: { select: { name: true } } } } } },
        premiumTransactions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const failedPayments = await prisma.payment.count({ where: { payerId: user.id, status: "failed" } });
    const { pinHash, ...safeUser } = user;

    res.json({ ...safeUser, failedPayments });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id — Update user (ban, premium, etc.)
router.put("/users/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { isPremium, premiumUntil, monthlySends } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(isPremium !== undefined && { isPremium }),
        ...(premiumUntil && { premiumUntil: new Date(premiumUntil) }),
        ...(monthlySends !== undefined && { monthlySends }),
      },
      select: { id: true, firstName: true, lastName: true, isPremium: true, premiumUntil: true },
    });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE /api/admin/users/:id — Delete user
router.delete("/users/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) { next(err); }
});

// ============================================================
// COTISATIONS MANAGEMENT
// ============================================================

// GET /api/admin/cotisations — List all cotisations
router.get("/cotisations", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const [cotisations, total] = await Promise.all([
      prisma.cotisation.findMany({
        where,
        include: {
          createdBy: { select: { firstName: true, lastName: true, phone: true } },
          _count: { select: { members: true, tours: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cotisation.count({ where }),
    ]);

    res.json({ cotisations, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/admin/cotisations/:id — Cotisation detail
router.get("/cotisations/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cotisation = await prisma.cotisation.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, phone: true } },
        members: { include: { user: { select: { id: true, firstName: true, lastName: true, phone: true } } }, orderBy: { tourOrder: "asc" } },
        tours: { include: { beneficiary: { select: { firstName: true, lastName: true } }, _count: { select: { payments: true } } }, orderBy: { tourNumber: "asc" } },
      },
    });
    if (!cotisation) return res.status(404).json({ error: "Cotisation non trouvée" });

    const paymentStats = await prisma.payment.groupBy({
      by: ["status"],
      where: { tour: { cotisationId: req.params.id } },
      _count: true,
    });

    res.json({ ...cotisation, paymentStats });
  } catch (err) { next(err); }
});

// PUT /api/admin/cotisations/:id — Force update cotisation status
router.put("/cotisations/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const cotisation = await prisma.cotisation.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(cotisation);
  } catch (err) { next(err); }
});

// ============================================================
// PAYMENTS / TRANSACTIONS
// ============================================================

// GET /api/admin/payments — All payments with filters
router.get("/payments", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const status = req.query.status as string;

    const where: any = {};
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          payer: { select: { firstName: true, lastName: true, phone: true } },
          tour: { include: { cotisation: { select: { name: true, amount: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({ payments, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/admin/premium-transactions — Premium subscription history
router.get("/premium-transactions", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.premiumTransaction.findMany({
      include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(transactions);
  } catch (err) { next(err); }
});

// ============================================================
// NOTIFICATIONS (user-facing, moved here for convenience)
// ============================================================

// GET /api/admin/notifications — My notifications
router.get("/notifications", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch (err) { next(err); }
});

// PUT /api/admin/notifications/:id/read
router.put("/notifications/:id/read", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json({ message: "OK" });
  } catch (err) { next(err); }
});

// POST /api/admin/notifications/broadcast — Send notification to all users
router.post("/notifications/broadcast", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, body, type } = req.body;
    const users = await prisma.user.findMany({ select: { id: true } });

    const notifications = users.map((u) => ({
      userId: u.id,
      title,
      body,
      type: type || "system",
    }));

    await prisma.notification.createMany({ data: notifications });
    res.json({ message: `Notification envoyée à ${users.length} utilisateurs` });
  } catch (err) { next(err); }
});

// ============================================================
// SYSTEM CONFIGURATION
// ============================================================

// GET /api/admin/config — Get all system configs
router.get("/config", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const configs = await prisma.systemConfig.findMany({ orderBy: { category: "asc" } });
    // Group by category
    const grouped: Record<string, any[]> = {};
    configs.forEach((c) => {
      if (!grouped[c.category]) grouped[c.category] = [];
      grouped[c.category].push(c);
    });
    res.json(grouped);
  } catch (err) { next(err); }
});

// PUT /api/admin/config/:key — Update a config value
router.put("/config/:key", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { value } = req.body;
    const config = await prisma.systemConfig.upsert({
      where: { key: req.params.key },
      update: { value: String(value) },
      create: { key: req.params.key, value: String(value), label: req.body.label || req.params.key, type: req.body.type || "string", category: req.body.category || "general" },
    });

    // Invalidate cache so services pick up new values
    invalidateConfigCache();

    // Log audit
    await prisma.auditLog.create({
      data: { userId: req.userId, action: "config_update", entity: "system_config", entityId: config.id, details: JSON.stringify({ key: req.params.key, value: config.type === "secret" ? "***" : value }), ip: req.ip },
    });

    res.json(config);
  } catch (err) { next(err); }
});

// POST /api/admin/config/seed — Seed default configs
router.post("/config/seed", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const defaults = [
      // General
      { key: "app_name", value: "Fundi", type: "string", label: "Nom de l'application", category: "general" },
      { key: "app_version", value: "1.0.0", type: "string", label: "Version de l'application", category: "general" },
      { key: "maintenance_mode", value: "false", type: "boolean", label: "Mode maintenance", category: "general" },
      // Limites
      { key: "max_free_cotisations", value: "3", type: "number", label: "Max cotisations (compte gratuit)", category: "limits" },
      { key: "max_free_sends", value: "15", type: "number", label: "Max envois/mois (compte gratuit)", category: "limits" },
      { key: "premium_price", value: "10000", type: "number", label: "Prix premium (FCFA/mois)", category: "premium" },
      // Auth
      { key: "otp_expiry_minutes", value: "5", type: "number", label: "Durée de validité OTP (minutes)", category: "auth" },
      { key: "pin_length", value: "5", type: "number", label: "Longueur du code PIN", category: "auth" },
      // Scoring
      { key: "failure_penalty_score", value: "2", type: "number", label: "Points de pénalité par échec", category: "scoring" },
      { key: "max_credit_score", value: "20", type: "number", label: "Score de crédibilité max", category: "scoring" },
      { key: "reminder_hours_before", value: "1", type: "number", label: "Heures avant rappel cotisation", category: "notifications" },
      // Fichiers
      { key: "max_file_size_mb", value: "10", type: "number", label: "Taille max fichier (MB)", category: "files" },
      // --- Camoo SMS ---
      { key: "camoo_api_key", value: "", type: "secret", label: "Camoo - API Key", category: "sms_camoo" },
      { key: "camoo_api_secret", value: "", type: "secret", label: "Camoo - API Secret", category: "sms_camoo" },
      { key: "camoo_sender_id", value: "Fundi", type: "string", label: "Camoo - Nom expéditeur (max 11 chars)", category: "sms_camoo" },
      { key: "camoo_route", value: "premium", type: "string", label: "Camoo - Route (classic/premium)", category: "sms_camoo" },
      // --- Dohone Paiements ---
      { key: "dohone_merchant_key", value: "", type: "secret", label: "Dohone - Clé marchande", category: "payment_dohone" },
      { key: "dohone_app_name", value: "Fundi", type: "string", label: "Dohone - Nom de l'application", category: "payment_dohone" },
      { key: "dohone_hash_code", value: "", type: "secret", label: "Dohone - Code de hachage (callback)", category: "payment_dohone" },
      { key: "dohone_callback_url", value: "", type: "string", label: "Dohone - URL de callback", category: "payment_dohone" },
      { key: "dohone_use_sandbox", value: "true", type: "boolean", label: "Dohone - Mode sandbox (test)", category: "payment_dohone" },
      // --- Brevo Email ---
      { key: "brevo_api_key", value: "", type: "secret", label: "Brevo - Clé API", category: "email_brevo" },
      { key: "brevo_sender_email", value: "noreply@fundi-app.com", type: "string", label: "Brevo - Email expéditeur", category: "email_brevo" },
      { key: "brevo_sender_name", value: "Fundi", type: "string", label: "Brevo - Nom expéditeur", category: "email_brevo" },
      // --- Firebase FCM ---
      { key: "firebase_project_id", value: "", type: "string", label: "Firebase - Project ID", category: "push_firebase" },
      { key: "firebase_client_email", value: "", type: "string", label: "Firebase - Client Email (service account)", category: "push_firebase" },
      { key: "firebase_private_key", value: "", type: "secret", label: "Firebase - Private Key (du JSON service account)", category: "push_firebase" },
    ];

    for (const d of defaults) {
      await prisma.systemConfig.upsert({
        where: { key: d.key },
        update: {},
        create: d,
      });
    }

    res.json({ message: `${defaults.length} configurations initialisées` });
  } catch (err) { next(err); }
});

// ============================================================
// FILE MANAGEMENT
// ============================================================

// GET /api/admin/files — List uploaded files
router.get("/files", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const context = req.query.context as string;

    const where: any = {};
    if (context) where.context = context;

    const [files, total] = await Promise.all([
      prisma.uploadedFile.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.uploadedFile.count({ where }),
    ]);

    // Total storage used
    const totalSize = await prisma.uploadedFile.aggregate({ _sum: { size: true } });

    res.json({ files, total, page, totalPages: Math.ceil(total / limit), totalStorageBytes: totalSize._sum.size || 0 });
  } catch (err) { next(err); }
});

// DELETE /api/admin/files/:id — Delete a file
router.delete("/files/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = await prisma.uploadedFile.findUnique({ where: { id: req.params.id } });
    if (!file) return res.status(404).json({ error: "Fichier non trouvé" });

    // Delete from disk
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), file.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.uploadedFile.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: { userId: req.userId, action: "file_delete", entity: "uploaded_file", entityId: req.params.id, details: JSON.stringify({ filename: file.filename }), ip: req.ip },
    });

    res.json({ message: "Fichier supprimé" });
  } catch (err) { next(err); }
});

// ============================================================
// AUDIT LOGS
// ============================================================

// GET /api/admin/audit-logs — View audit logs
router.get("/audit-logs", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const entity = req.query.entity as string;
    const action = req.query.action as string;

    const where: any = {};
    if (entity) where.entity = entity;
    if (action) where.action = { contains: action };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// ============================================================
// USER MODERATION
// ============================================================

// PUT /api/admin/users/:id/ban — Ban a user
router.put("/users/:id/ban", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    await prisma.user.update({ where: { id: req.params.id }, data: { isBanned: true, banReason: reason || "Non spécifié" } });

    await prisma.auditLog.create({
      data: { userId: req.userId, action: "user_ban", entity: "user", entityId: req.params.id, details: JSON.stringify({ reason }), ip: req.ip },
    });

    res.json({ message: "Utilisateur banni" });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/unban — Unban a user
router.put("/users/:id/unban", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isBanned: false, banReason: null } });

    await prisma.auditLog.create({
      data: { userId: req.userId, action: "user_unban", entity: "user", entityId: req.params.id, ip: req.ip },
    });

    res.json({ message: "Utilisateur débanni" });
  } catch (err) { next(err); }
});

// PUT /api/admin/users/:id/grant-premium — Give premium manually
router.put("/users/:id/grant-premium", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { months } = req.body;
    const premiumUntil = new Date();
    premiumUntil.setMonth(premiumUntil.getMonth() + (months || 1));

    await prisma.user.update({ where: { id: req.params.id }, data: { isPremium: true, premiumUntil } });

    await prisma.auditLog.create({
      data: { userId: req.userId, action: "grant_premium", entity: "user", entityId: req.params.id, details: JSON.stringify({ months, premiumUntil }), ip: req.ip },
    });

    res.json({ message: `Premium accordé jusqu'au ${premiumUntil.toISOString().split("T")[0]}` });
  } catch (err) { next(err); }
});

export default router;
