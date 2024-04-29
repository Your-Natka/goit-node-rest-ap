import { Contact } from '../models/contactModals.js';
import HttpError from '../helpers/HttpError.js';
import catchAcync from '../helpers/catchAsync.js';

export const addContact = catchAcync(async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });

  res.status(201).json(result);
});

export const getById = catchAcync(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner: req.user._id });
  if (!result) throw HttpError(404, 'Not found');

  res.json(result);
});

export const listContacts = catchAcync(async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.find({ owner: _id });
  res.json(result);
});

export const removeContact = catchAcync(async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;
  const result = await Contact.findOneAndDelete({ _id: contactId, owner }, { name, email, phone, favorite });
  console.log(result);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
});

export const updateContact = catchAcync(async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner });
  if (!result) throw HttpError(404, 'Not found');

  res.status(201).json(result);
});

export const updateFavorite = catchAcync(async (req, res) => {
  const { contactId } = req.params;
  const favorite = req.body;
  if (!req.body) throw HttpError(400, 'missing field favorite');
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: req.body._id }, favorite, {
    new: true,
  });
  if (!result) throw HttpError(404, 'Not found');

  res.status(201).json(result);
});
