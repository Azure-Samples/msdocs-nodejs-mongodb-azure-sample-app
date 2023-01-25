import { model, Schema, Document, ObjectId } from "mongoose";

const UploadSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    picked: {
      type: Boolean,
      default: false,
    },
    pickedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amountReceived: {
      type: Number,
      default: 0,
    },
    fileAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const UploadModel = model("Upload", UploadSchema);

export { UploadModel };
