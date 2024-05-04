import { catchAsync } from '../helpers/catchAsync.js';
import { changeStatus, deleteChooseContact, getContacts, makeUser, updateChooseContact } from '../services/contactServises.js';

export const getAllContacts = catchAsync(async (req, res) => {
  const list = await getContacts(req.user.id);

  res.status(200).json(list);
});

export const getOneContact = catchAsync(async (req, res) => {
  const contact = await req.contact;

  res.json(contact).status(200);
});

export const deleteContact = catchAsync(async (req, res) => {
  const contactId = req.contact.id;

  const delContact = await deleteChooseContact(contactId, req.user.id);

  res.json(delContact).status(200);
});

export const createContact = catchAsync(async (req, res) => {
  const newUser = await makeUser(req.body, req.user.id);

  if (!newUser) {
    return res.status(400).json({ message: 'Contact not created' });
  }

  res.status(201).json(newUser);
});

export const updateContact = catchAsync(async (req, res) => {
  const contactId = await req.contact.id;

  const update = await updateChooseContact(contactId, req.body, req.user.id);

  res.json(update).status(200);
});

export const updateStatus = catchAsync(async (req, res) => {
  const contactId = await req.contact.id;

  const update = await changeStatus(contactId, req.body, req.user.id);

  res.status(200).json(update);
});
