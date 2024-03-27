import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post("/login", validateBody(userSigninSchema), authController.login);

authRouter.get("/current", authMiddleware, authController.getCurrent);

authRouter.post("/logout", authMiddleware, authController.logout);

authRouter.patch("/avatars", upload.single("avatarURL"), authMiddleware, authController.updateAvatar);

export default authRouter;
