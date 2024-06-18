import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contactsControllers.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema, updateStatusContactSchema } from '../schemas/contactsSchemas.js';
import isValidateId from '../middlewares/validateId.js';
import { protect } from '../middlewares/authMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.get('/', protect, getAllContacts);

contactsRouter.get('/:id', protect, isValidateId, getOneContact);

contactsRouter.delete('/:id', protect, isValidateId, deleteContact);

contactsRouter.post('/', protect, validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', protect, isValidateId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch('/:id/favorite', protect, isValidateId, validateBody(updateStatusContactSchema), updateStatusContact);

export default contactsRouter;
