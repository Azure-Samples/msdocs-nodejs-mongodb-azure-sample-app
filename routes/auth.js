const { Router } = require("express");
const { body } = require("express-validator");
const { UserModel } = require("../models/user");
const { UploadModel } = require("../models/upload");
const { RevokedTokenModel } = require("../models/revokedToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuth } = require("../middleware/is-auth");
const crypto = require("crypto");
const { sendMail } = require("../middleware/email");
require("dotenv").config();

const routes = Router();

routes.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().exec();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.get("/:userId/uploads", isAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const uploads = await UploadModel.find({
      creator: req.params.userId,
    })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalDocuments = await UploadModel.countDocuments({
      creator: req.params.userId,
    });
    const totalPages = Math.ceil(totalDocuments / pageSize);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    return res.json({
      uploads,
      totalDocuments,
      totalPages,
      nextPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      previousPage,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.post(
  "/signup",
  [
    body("firstName").isString().isLength({ min: 2 }),
    body("lastName").isString().isLength({ min: 2 }),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isString().isLength({ min: 6 }),
    body("institution").isString().isLength({ min: 2 }),
    body("department").isString().isLength({ min: 2 }),
    body("phone").isString().isLength({ min: 11 }),
    body("matriculationNumber").isString().isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const user = req.body;

      const userExists = await UserModel.findOne({
        $or: [
          { phone: user.phone },
          { matriculationNumber: user.matriculationNumber },
        ],
      }).exec();

      if (userExists) {
        return res.status(409).json({
          error:
            "There is already another user with this phone number or MatricNo",
        });
      }

      const newUser = await UserModel.create(user);

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);

      await newUser.save();

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ errors: "Sorry, something went wrong :/", error });
    }
  }
);

routes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isString().isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email }).exec();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const payload = {
        id: user._id.toString(),
        user: user.user,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user: payload });
        }
      );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ errors: "Sorry, something went wrong :/", error });
    }
  }
);

routes.post("/logout", isAuth, async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    const revokedToken = await RevokedTokenModel.create({
      token,
      expires: new Date(),
      user: req.id,
    });
    await revokedToken.save();

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

routes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    sendMail(
      email,
      "Password reset",
      `<p>You are receiving this email because you (or someone else) have requested a password reset for your account. Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>http://localhost:3333/users/reset-password/${token}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    );
    res.json({ message: "Reset password link sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" }, error.message);
  }
});

routes.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    sendMail(
      user.email,
      "Password reset confirmation",
      `<p>This is a confirmation that the password for your account has been successfully reset.</p>
        <p>If you did not request this change, please contact us immediately.</p>`
    );
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" }, error.message);
  }
});

module.exports = routes;
