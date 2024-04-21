import { Contacts } from "../models/contactsModel.js";

export const makeUser = (userData, owner) =>
  Contacts.create({ ...userData, owner });

export const getContacts = (id) => Contacts.find({ owner: id });

export const deleteChooseContact = (id) => Contacts.findByIdAndDelete(id);

export const updateChooseContact = (id, params) =>
  Contacts.findOneAndUpdate(id, params, { new: true });

export const changeStatus = (id, value) =>
  Contacts.findOneAndUpdate(id, value, { new: true });
