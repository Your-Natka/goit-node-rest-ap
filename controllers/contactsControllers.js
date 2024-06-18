import HttpError from '../helpers/HttpError.js';
import { Contact } from '../models/contactModals.js';

export const getAllContacts = async (req, res, next) => {
  const { favorite } = req.query;
  const { id } = req.user;
  const filterContact = { owner: id };

  if (favorite !== undefined) {
    filterContact.favorite = favorite;
  }

  try {
    const contacts = await Contact.find(filterContact);
    res.status(200).json(contacts);
    if (!contacts) {
      throw HttpError(401, 'Bad Request');
    }
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  try {
    const contacts = await Contact.findOne({ _id: id, owner });
    if (!contacts) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  try {
    const contacts = await Contact.findOneAndDelete({ _id: id, owner });
    if (!contacts) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const newContact = await Contact.create({ ...req.body, owner });
    console.log(newContact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const { _id: owner } = req.user;
  try {
    const updatedContact = await Contact.findOneAndUpdate({ _id: id, owner }, { name, email, phone, favorite }, { new: true });
    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const favorite = req.body;
  const { _id: owner } = req.user;
  try {
    const updatedStatusContact = await Contact.findOneAndUpdate({ _id: id, owner }, favorite, {
      new: true,
    });
    if (!updatedStatusContact) {
      throw HttpError(404, 'Not found');
    }
    res.status(200).json(updatedStatusContact);
  } catch (error) {
    next(error);
  }
};
