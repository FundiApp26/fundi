import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";
import { Router, Response, NextFunction } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

// Store files locally (MVP). Switch to S3/Cloudinary in production.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomBytes(16).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|mp4|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non supporté"));
    }
  },
});

const router = Router();
router.use(authMiddleware);

// POST /api/upload — Upload a file (avatar, proof, media)
router.post("/", upload.single("file"), (req: AuthRequest, res: Response, _next: NextFunction) => {
  if (!req.file) {
    res.status(400).json({ error: "Aucun fichier envoyé" });
    return;
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename, size: req.file.size });
});

export default router;
export { upload };
