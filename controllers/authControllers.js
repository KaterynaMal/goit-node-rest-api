import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const signup = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

export default { signup, login, getCurrent, logout, updateUserSubscription };
