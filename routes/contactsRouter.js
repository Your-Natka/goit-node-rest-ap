import express from 'express';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateContact,
  updateStatus,
} from '../controllers/contactsControllers.js';

import {
  checkCreateUserData,
  checkFavorite,
  checkUpdateUserData,
  checkUserId,
} from '../middlewares/userMiddlewares.js';

import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.use(protect);
router.get('/', getAllContacts);

router.use('/:id', checkUserId);
router
  .route('/:id')
  .get(getOneContact)
  .delete(deleteContact)
  .put(checkUpdateUserData, updateContact);

router.post('/', checkCreateUserData, createContact);

router.patch('/:id/favorite', checkFavorite, updateStatus);

export { router };
