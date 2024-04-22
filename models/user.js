import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";
import { constRoles } from "../constants/userRoles.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: constRoles.STARTER,
    },
    token: String,
    default: null,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);
