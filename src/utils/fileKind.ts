import { FileKind } from "@prisma/client";
import { HttpError } from "./httpError";

export function detectFileKind(mime: string, filename: string): FileKind {
  const lower = filename.toLowerCase();

  if (mime.startsWith("image/")) return FileKind.IMAGE;
  if (mime.startsWith("video/")) return FileKind.VIDEO;
  if (mime.startsWith("audio/")) return FileKind.AUDIO;
  if (mime === "application/pdf" || lower.endsWith(".pdf")) return FileKind.PDF;

  throw new HttpError(400, "Unsupported file type");
}