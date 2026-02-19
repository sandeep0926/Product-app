import { Userrr } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Reg = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Userrr.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "USER ALREADY EXIST..." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new Userrr({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "REGISTER SUCESSFULLY...",
    });
  } catch (error) {
    res.status(500).json({ message: "REGISTER FAILED..." });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Userrr.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "USER NOT EXIST WRONG EMAIL OR PASSWORD..." });
    }

    const Compare = await bcrypt.compare(password, user.password);
    if (!Compare) {
      return res
        .status(400)
        .json({ message: "PASSWORD IS WRONG OR NOT MATCHED...." });
    }
    const JwtTok = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "24h" },
    );
    res.status(201).json({
      message: "LOGIN SUCCESSFULLY...",
      JwtTok,
      email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "ERROR NOT LOGIN..." });
  }
};
