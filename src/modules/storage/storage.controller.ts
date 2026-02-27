import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { supabase } from "./storage.supabase";
import { env } from "../../config/env";

export async function dbPing(req: Request, res: Response) {
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
}

export async function testUpload(req: Request, res: Response) {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ ok: false, message: "No file uploaded. Use form-data key 'file'." });
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `tests/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(env.SUPABASE_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (uploadError) {
      return res.status(500).json({ ok: false, message: "Supabase upload failed", error: uploadError.message });
    }

    const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);

    res.json({
      ok: true,
      bucket: env.SUPABASE_BUCKET,
      path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      publicUrl: data.publicUrl,
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || "Storage upload failed" });
  }
}