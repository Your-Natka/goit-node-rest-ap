import express from "express";
import validateBody from "../middlewares/validateBody.js";
import {
  registerUser,
  loginUser,
  getCurrent,
  logoutUser,
} from "../../controllers/userController.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import { authorize } from "../middlewares/authorize.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerUser);

authRouter.post("/login", validateBody(loginSchema), loginUser);

authRouter.post("/logout", authorize, logoutUser);

authRouter.get("/current", authorize, getCurrent);

export default authRouter;
