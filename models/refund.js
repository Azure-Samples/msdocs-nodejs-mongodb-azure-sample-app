const mongoose = require("mongoose");
const { model, Schema, Document, ObjectId } = mongoose;

const RefundSchema = new Schema(
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
    upload: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RefundModel = model("Refund", RefundSchema);

module.exports = { RefundModel };
