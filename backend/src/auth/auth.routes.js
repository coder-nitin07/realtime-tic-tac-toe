import express from "express";
import { loginValidation, registerValidation, validateBody } from "./auth.validation.js";
import { createUser, loginUser, logoutUser } from "./auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const authRouter = express.Router();

authRouter.post('/register', validateBody(registerValidation), createUser);
authRouter.post('/login', validateBody(loginValidation), loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);

export default authRouter;