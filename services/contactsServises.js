import { Contact } from "../models/contactsModel.js";

export const makeUser = (userData, owner) =>
  Contacts.create({ ...userData, owner });

export const getContacts = (id) => Contact.find({ owner: id });

export const deleteChooseContact = (id) => Contact.findByIdAndDelete(id);

export const updateChooseContact = (id, params) =>
  Contact.findOneAndUpdate(id, params, { new: true });

export const changeStatus = (id, value) =>
  Contact.findOneAndUpdate(id, value, { new: true });
