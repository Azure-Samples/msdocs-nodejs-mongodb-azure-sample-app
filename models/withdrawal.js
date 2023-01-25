const mongoose = require("mongoose");
const { model, Schema, Document, ObjectId } = mongoose;

const WithdrawalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transferCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const WithdrawalModel = model("Withdrawal", WithdrawalSchema);

module.exports = { WithdrawalModel };
