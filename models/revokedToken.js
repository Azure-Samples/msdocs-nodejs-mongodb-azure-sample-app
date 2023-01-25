import { model, Schema, Document, ObjectId } from "mongoose";

const RevokedTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const RevokedTokenModel = model("RevokedToken", RevokedTokenSchema);

export { RevokedTokenModel };
