import { Router } from "express";
import { isAuth } from "../middleware/is-auth";
import { UserModel } from "../models/user";
import { WithdrawalModel } from "../models/withdrawal";
import sendMail from "../middleware/email";
import axios from "axios";
require("dotenv").config();

const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const routes = Router();

routes.post("/verify", isAuth, async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,

      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    if (response.data.status) {
      return res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({
      message: "Invalid account number or bank code",
      error: error.response.data,
      error2: error.message,
    });
  }
});

routes.post("/recipient", isAuth, async (req, res) => {
  try {
    const { type, name, accountNumber, bankCode } = req.body;
    const response = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type,
        name,
        account_number: accountNumber,
        bank_code: bankCode,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

routes.post("/wallet/withdraw", isAuth, async (req, res) => {
  try {
    const { amount, recipient } = req.body;
    // Find the user
    const user = await UserModel.findById(req.id).exec();
    if (!user) return res.status(404).json({ message: "User not found" });

    const withdrawal = new WithdrawalModel({
      user: req.id,
      amount,
      status: "queued",
    });
    // Check if the wallet has sufficient funds
    if (user.wallet < amount)
      return res.status(400).json({ message: "Insufficient funds" });
    // Initiate the transfer
    const transfer = await axios.post(
      "https://api.paystack.co/transfer",
      {
        recipient,
        amount,
        reason: "Withdrawal from wallet",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    // Deduct from the wallet
    user.wallet -= amount;
    await user.save();
    // Create a withdrawal record
    withdrawal.transferCode = transfer.data.data.transfer_code;
    withdrawal.createdAt = transfer.data.data.created_at;

    await withdrawal.save();
    // Send email to the user
    sendMail(
      user.email,
      "Withdrawal Successful",
      `You have successfully withdrawn ${amount} from your wallet.`
    );
    res.json({ message: "Withdrawal successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, error: error.response.data });
  }
});

routes.get("/transfer/:transferCode", isAuth, async (req, res) => {
  try {
    const { transferCode } = req.params;
    const response = await axios.get(
      `https://api.paystack.co/transfer/${transferCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, error: error.response.data });
  }
});

export default routes;
