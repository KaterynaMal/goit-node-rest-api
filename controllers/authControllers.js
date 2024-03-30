import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import jimp from "jimp";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(email);
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const verificationToken = nanoid();
  const newUser = await authServices.signup({
    ...req.body,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blanc">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL,
  });
});

const verify = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );

  res.json({ message: "Verification successful" });
});

const resendVerify = ctrlWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(404, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blanc">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
});

const updateAvatar = ctrlWrapper(async (req, res) => {
  if (!req.user) {
    throw HttpError(401, "Not authorized");
  }

  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const { _id: owner } = req.user;

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  const image = await jimp.read(oldPath);
  await image.resize(250, 250).writeAsync(oldPath);

  await fs.rename(oldPath, newPath);

  const avatarURL = `/avatars/${filename}`;

  const result = await authServices.updateOneAvatar(
    { _id: owner },
    { avatarURL }
  );
  console.log(result);

  res.status(200).json({ avatarURL });
});

const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const comparePassword = await authServices.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.updateUser({ _id: id }, { token });

  res.json({ token });
});

const getCurrent = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
});

const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const user = await authServices.findUser({ _id });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await authServices.updateUser({ _id }, { token: "" });

  res.json({ message: "Signout success" });
});

export default {
  signup,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendVerify,
};
