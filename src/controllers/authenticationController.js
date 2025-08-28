import User from "../models/User.js";
import { formatJoiErrors } from "../utils/formatJoiErrors.js";
import {
  loginValidations,
  registerValidations,
} from "../validations/authenticationValidations.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // 1 validation
  const { error } = registerValidations.validate(req.body, {
    abortEarly: false,
  });

  // ini untuk yg error
  if (error) {
    // mapping errornya
    const errors = formatJoiErrors(error);
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  // ini untuk yg berhasil
  try {
    const { name, email, password } = req.body;

    // cek email sudah ada
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exist",
      });
    }

    // buat user baru kalo email belum ada
    const user = new User({ name, email, password });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(201).json({
      message: "User created succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { error } = loginValidations.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = formatJoiErrors(error);
    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  const { email, password } = req.body;

  try {
    // 1. cek email yg sudah ada atau tidak
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email or password is incorrect",
      });
    }

    // 2. cek passwordnya bener atau tidak
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    // 3. buat token untuk user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. buat cookie untuk user
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // 5. redirect ke halaman dashboard
    return res.status(200).json({
      message: "Login succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

export const whoami = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({
      message: "Logout succesfully, please wait you are being redirected to login page"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}
