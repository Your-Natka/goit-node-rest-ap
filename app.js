import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { globalErrorHandler } from "./controllers/errorController.js";
import contactsRouter from "./routes/api/contactsRouter.js";
import authRouter from "./routes/api/authRouter.js";
import { DEV } from "./constants/constRoles.js";

dotenv.config();

const app = express();

const { NODE_MONGOOSE, PORT } = process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect(NODE_MONGOOSE)
  .then(() => {
    console.log("Database connection successful.");
    console.log(`port: ${PORT}`);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

process.env.EXPIRES_IN = DEV ? app.use(morgan("dev")) : app.use(morgan("tiny"));

app.use(cors());
app.use(express.json());

const pathPrefix = "/api";

app.use("/users", authRouter);

app.use(`${pathPrefix}/contacts`, contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.use(globalErrorHandler);

const port = +process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running. Use our API on port: ${port}`);
});
