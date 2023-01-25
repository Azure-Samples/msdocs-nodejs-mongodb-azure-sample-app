import { UploadModel } from "../models/upload";
import { isAuth } from "../middleware/is-auth";
import { UserModel } from "../models/user";

import sendMail from "../middleware/email";
import { Router } from "express";
import { body } from "express-validator";

const routes = Router();

routes.post(
  "/",
  isAuth,
  [body("id").isString().isLength({ min: 2 })],
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.id).exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const upload = await UploadModel.findById(req.body.id)
        .populate("creator")
        .exec();

      if (!upload) {
        return res.status(404).json({ error: "Upload not found" });
      }
      if (upload.picked) {
        return res.status(400).json({ error: "Upload already picked" });
      }

      const uploader = upload.creator;

      upload.picked = true;
      upload.pickedBy = req.id;
      await upload.save();
      sendMail(
        uploader.email,
        "Upload Picked",
        `<h1>Your upload of ${upload.title} was picked by ${user.firstName}.</h1>`
      );

      sendMail(
        user.email,
        "Upload Picked",
        `<h1>You picked ${upload.title} by ${uploader.firstName}.</h1>`
      );
      return res.status(200).json({ message: "Upload picked successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default routes;
