import { Router } from "express";
import { body } from "express-validator";
import { PaymentModel } from "../models/payment";
import { isAuth } from "../middleware/is-auth";
import { UserModel } from "../models/user";
import sendMail from "../middleware/email";
import { UploadModel } from "../models/upload";
import axios from "axios";
require("dotenv").config();

const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const routes = Router();

routes.post(
  "/",
  isAuth,
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("file").isString().isLength({ min: 2 }),
    body("currency").isString().isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.id).exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const upload = await UploadModel.findById(req.body.file).populate(
        "creator"
      );

      if (!upload) {
        return res.status(404).json({ error: "Upload not found" });
      }

      const uploader = upload.creator;

      const payment = new PaymentModel(req.body);
      payment.user = req.id;

      if (payment.status === "success") {
        await payment.save();

        upload.fileAmount = payment.amount;
        upload.amountReceived += payment.amount;

        user.payments.push(payment);
        await user.save();

        uploader.wallet += payment.amount;
        await uploader.save();

        sendMail(
          user.email,
          "Payment Successful",
          `<h1>Your payment of ${payment.amount} was successful.</h1>`
        );

        sendMail(
          uploader.email,
          "Payment Received",
          `<h1>You received a payment of ${payment.amount} on ${upload.title}, the file ID of ${upload.file}.</h1>`
        );

        return res.json(payment);
      } else {
        return res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Sorry, something went wrong :/",
        message: "Error processing payment",
      });
    }
  }
);

routes.post("/verify", isAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { transactionId } = req.body;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "success") {
      PaymentModel.findOneAndUpdate(
        { paycode: transactionId },
        { status: "success" }
      );

      return res.json(response);
    } else {
      PaymentModel.findOneAndUpdate(
        { paycode: transactionId },
        { status: "failed" }
      );

      return res.status(400).json({ message: "Payment failed", response });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Sorry, something went wrong :/",
      message: "Error processing payment",
    });
  }
});

routes.get("/", isAuth, async (req, res) => {
  try {
    const payments = await PaymentModel.find({ user: req.id })
      .sort({ createdAt: -1 })
      .exec();
    return res.json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Sorry, something went wrong :/",
      message: "Error fetching payments",
    });
  }
});

export default routes;
