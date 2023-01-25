import { model, Schema, Document, ObjectId } from "mongoose";

const UserSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    matriculationNumber: {
      type: String,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
    uploads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Upload",
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    refunds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Refund",
      },
    ],
    writingTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "WritingTask",
      },
    ],
    wallet: {
      type: Number,
      default: 0,
    },
    withdrawals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Withdrawal",
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date || null,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

export { UserModel };
