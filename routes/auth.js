import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const authRoutes = express.Router();

authRoutes.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { error } = validate(req.body);
    if (error) {
      console.log("Validation Error:", error.details[0].message);
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found:", req.body.email);
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      console.log("Invalid password for user:", req.body.email);
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    console.log("Generating token...");
    const token = user.generateAuthToken();

    console.log("Login successful");
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

export default authRoutes;
