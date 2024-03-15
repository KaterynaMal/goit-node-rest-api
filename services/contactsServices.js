import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, query = {}) => Contact.find(filter, "-createdAt -updatedAt", query);

export const addContact = data => Contact.create(data);

export const getContactById = id => Contact.findById(id);

export const getOneContact = filter => Contact.findOne(filter);

export const removeContact = id => Contact.findByIdAndDelete(id);

export const removeOneContact = filter => Contact.findOneAndDelete(filter);

export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data, {new: true, runValidators: true});

export const updateOneContact = (filter, data) => Contact.findOneAndUpdate(filter, data, {new: true, runValidators: true})

export const updateStatusContact = (id, updateData) => Contact.findByIdAndUpdate(id, updateData, { new: true });

export const updateOneStatusContact = (filter, updateData) => Contact.findOneAndUpdate(filter, updateData, { new: true });


