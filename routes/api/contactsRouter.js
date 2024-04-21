import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../../controllers/contactsControllers.js";
import isValidId from "../../middlewares/isValidId.js";
import validateBody from "../../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  patchContactSchema,
} from "../../schemas/contactsSchemas.js";
import { authorize } from "../../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authorize, getAllContacts);

contactsRouter.get("/:id", authorize, isValidId, getOneContact);

contactsRouter.delete("/:id", authorize, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authorize,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authorize,
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authorize,
  isValidId,
  validateBody(patchContactSchema),
  updateStatusContact
);

export default contactsRouter;
