import { Contact } from "../models/contactModals.js";
import HttpError from "../helpers/HttpError.js";

export const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

export const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};
export const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const searchParams = {
    owner,
  };

  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (typeof favorite === "undefined") {
    delete searchParams.favorite;
  } else {
    searchParams.favorite = favorite;
  }

  const result = await Contact.find(searchParams, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(result);
};

export const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) throw HttpError(404, "Not found");

  res.json({
    message: "Сontact deleted",
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404, "Not found");

  res.status(201).json(result);
};

export const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) throw HttpError(400, "missing field favorite");
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404, "Not found");

  res.status(201).json(result);
};
