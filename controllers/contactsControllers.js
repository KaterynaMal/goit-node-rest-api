import { json } from "express";
import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const result = await contactsService.listContacts({ owner }, { skip, limit });
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.getOneContact({ _id: id, owner });

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const result = await contactsService.removeOneContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;

  const result = await contactsService.addContact({
    name,
    email,
    phone,
    favorite,
    owner,
  });

  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }
  const result = await contactsService.updateOneContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
});

export const updateContactStatus = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;
  const result = await contactsService.updateOneStatusContact(
    { _id: id, owner },
    { favorite }
  );
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
});
