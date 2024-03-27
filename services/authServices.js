import User from "../models/User.js";

import bcrypt from "bcrypt";

export const findUser = filter => User.findOne(filter);

export const signup = async (data, avatarURL) => {
    const hashPassword = await bcrypt.hash(data.password, 10);
    return User.create({ ...data, avatarURL, password: hashPassword });
};

export const validatePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateOneAvatar = (filter, updateData) => User.findOneAndUpdate(filter, updateData, { new: true });