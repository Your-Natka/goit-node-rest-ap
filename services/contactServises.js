import { Contacts } from '../models/contactsModel.js';
import HttpError from '../helpers/HttpError.js';

export const makeUser = (userData, owner) => Contacts.create({ owner, ...userData });

export const getContacts = id => Contacts.find({ owner: id });

export const deleteChooseContact = async (id, owner) => {
  const contact = await Contacts.findById(id);

  if (!contact.owner || contact.owner.toString() !== owner) throw new HttpError(409, 'Not your contact!');

  const del = await Contacts.findOneAndDelete({ _id: id, owner }, { new: true });

  return del;
};

export const updateChooseContact = async (id, params, owner) => {
  const contact = await Contacts.findById(id);

  if (!contact.owner || contact.owner.toString() !== owner) throw new HttpError(409, 'Not your contact!');

  Contacts.findOneAndUpdate({ _id: id }, { $set: params }, { new: true });
};

export const changeStatus = async (id, value, owner) => {
  const contact = await Contacts.findById(id);

  if (!contact.owner || contact.owner.toString() !== owner) throw new HttpError(409, 'Not your contact!');

  return Contacts.findOneAndUpdate({ _id: id }, { $set: value }, { new: true });
};
