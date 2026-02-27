import { HttpError } from "./httpError";

export function paramId(value: any, name = "id"): string {
  if (!value) throw new HttpError(400, `Missing param: ${name}`);
  if (Array.isArray(value)) return value[0].toString();
  return value.toString();
}