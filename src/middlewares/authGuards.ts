import { authRequired } from "./authRequired";
import { requireRole } from "./requireRole";

export const authRequiredForUser = [authRequired, requireRole("USER")];
export const authRequiredForAdmin = [authRequired, requireRole("ADMIN")];