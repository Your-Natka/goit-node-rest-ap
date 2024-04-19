import { Contact } from "../models/contactModals.js";
import HttpError from "../helpers/HttpError.js";
import catchAsync from "../helpers/catchAsync.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Contact.findById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export const createContact = catchAsync(async (req, res, next) => {
  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export const updateContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const update = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!update) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(update);
  } catch (error) {
    next(error);
  }
});

export const updateStatusContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    const updatedFavorite = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedFavorite) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updatedFavorite);
  } catch (error) {
    next(error);
  }
});
