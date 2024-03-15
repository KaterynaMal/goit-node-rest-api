import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignupSchema, userSigninSchema } from "../schemas/usersSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();


authRouter.post("/register", validateBody(userSignupSchema), authController.signup);

authRouter.post("/login", validateBody(userSigninSchema), authController.login);

authRouter.get("/current", authMiddleware, authController.getCurrent);

authRouter.post("/logout", authMiddleware, authController.logout);

export default authRouter;