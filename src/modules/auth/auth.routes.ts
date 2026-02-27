import { Router } from "express";
import { authController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import { authRequired } from "../../middlewares/authRequired";

export const authRouter = Router();

authRouter.post("/auth/register", validateBody(registerSchema), authController.register);
authRouter.post("/auth/login", validateBody(loginSchema), authController.login);

authRouter.get("/auth/me", authRequired, authController.me);
authRouter.post("/auth/logout", authRequired, authController.logout);

// email verification (mock)
authRouter.post("/auth/request-email-verification", authRequired, authController.requestEmailVerification);
authRouter.post("/auth/verify-email", validateBody(verifyEmailSchema), authController.verifyEmail);

// password reset (mock)
authRouter.post("/auth/forgot-password", validateBody(forgotPasswordSchema), authController.forgotPassword);
authRouter.post("/auth/reset-password", validateBody(resetPasswordSchema), authController.resetPassword);