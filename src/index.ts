import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// Multer: store uploaded file in memory for quick forwarding to Supabase
const upload = multer({ storage: multer.memoryStorage() });

// Supabase client (backend-only)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseBucket = process.env.SUPABASE_BUCKET || "uploads";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "backend", time: new Date().toISOString() });
});

// DB test: counts users, and optionally creates one dummy user if none exists
app.get("/db/ping", async (req, res) => {
  try {
    const count = await prisma.user.count();

    if (count === 0) {
      await prisma.user.create({
        data: {
          email: `test_${Date.now()}@example.com`,
          role: "USER",
        },
      });
    }

    const newCount = await prisma.user.count();
    res.json({ ok: true, usersCount: newCount });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || "DB ping failed" });
  }
});

// Storage test: upload a file to Supabase bucket and return public URL
app.post("/storage/test-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded. Use form-data key 'file'." });
    }

    const fileExt = req.file.originalname.split(".").pop() || "bin";
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `tests/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(supabaseBucket)
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ ok: false, message: "Supabase upload failed", error: uploadError.message });
    }

    // Public URL (works if bucket is public)
    const { data } = supabase.storage.from(supabaseBucket).getPublicUrl(path);

    res.json({
      ok: true,
      bucket: supabaseBucket,
      path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      publicUrl: data.publicUrl,
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || "Storage upload failed" });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});