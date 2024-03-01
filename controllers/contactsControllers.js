import { json } from "express";
import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { name, email, phone } = req.body;

  const result = await contactsService.addContact(name, email, phone);

  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
});
