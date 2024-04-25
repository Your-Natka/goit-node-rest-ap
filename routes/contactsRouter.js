import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { addSchema, updFavoriteSchema } from "../models/contactModals.js";
import {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsController.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, listContacts);

contactsRouter.get("/:contactId", authenticate, isValidId, getById);

contactsRouter.delete("/:contactId", authenticate, isValidId, removeContact);

contactsRouter.post("/", authenticate, validateBody(addSchema), addContact);

contactsRouter.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(addSchema),
  updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updFavoriteSchema),
  updateFavorite
);

export default contactsRouter;
