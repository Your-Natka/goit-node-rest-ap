import express from "express";
import { validateBody } from "../../middlewares/validateBody.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { userSchemas } from "../../models/user.js";
import {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
} from "../../controllers/authController.js";

const router = express.Router();
const authRouter = express.Router();

router.post("/register", validateBody(userSchemas.registerSchema), register);

router.post("/login", validateBody(userSchemas.loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

router.patch(
  "/",
  authenticate,
  validateBody(userSchemas.updSubscriptionSchema),
  updateSubscription
);

export default authRouter;
