const express = require("express");
const { Router } = express;
const { body } = require("express-validator");
const { isAuth } = require("../middleware/is-auth");
const { ProfileModel } = require("../models/profile");
const { UserModel } = require("../models/user");

const routes = Router();

routes.get("/", isAuth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.id,
    }).exec();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Sorry, something went wrong :/" }, error.message);
  }
});

routes.get("/:id", isAuth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.id,
    })
      .populate("user")
      .exec();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Sorry, something went wrong :/" }, error.message);
  }
});

routes.post(
  "/",
  isAuth,
  [
    body("about").trim().isLength({ min: 10 }),
    body("contact").isObject(),
    body("education").isObject(),
    body("skills").isArray(),
  ],

  async (req, res) => {
    try {
      const profile = await ProfileModel.findOne({
        user: req.id,
      }).exec();
      if (profile) {
        return res.status(400).json({ error: "Profile already exists" });
      }
      const newProfile = new ProfileModel({
        user: req.id,
        about: req.body.about,
        contact: {
          email: req.body.contact.email,
          phone: req.body.contact.phone,
        },
        education: {
          school: req.body.education.school,
          dateAttended: req.body.education.dateAttended,
          faculty: req.body.education.faculty,
          department: req.body.education.department,
        },
        skills: req.body.skills,
      });
      await newProfile.save();

      const user = await UserModel.findById(req.id).exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.profile = newProfile;
      await user.save();

      res.json(newProfile);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Sorry, something went wrong :/" }, error.message);
    }
  }
);

routes.patch(
  "/",
  isAuth,
  [body("about").trim().isLength({ min: 10 }), body("skills").isArray()],
  async (req, res) => {
    try {
      const profile = await ProfileModel.findOne({
        user: req.id,
      }).exec();
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      profile.about = req.body.about || profile.about;
      profile.contact = req.body.contact || profile.contact;
      profile.education = req.body.education || profile.education;
      profile.skills = req.body.skills || profile.skills;
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Sorry, something went wrong :/" }, error.message);
    }
  }
);

module.exports = routes;
