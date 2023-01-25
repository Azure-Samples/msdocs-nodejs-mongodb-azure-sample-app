import { model, Schema, Document, ObjectId } from "mongoose";

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    about: {
      type: String,
      required: true,
      default: "",
    },
    contact: {
      type: {
        email: {
          type: String,
          required: true,
          default: "",
        },
        phone: {
          type: String,
          required: true,
          default: "",
        },
      },
    },
    education: {
      type: {
        school: {
          type: String,
          required: true,
          default: "",
        },
        dateAttended: {
          type: String,
          required: true,
          default: "",
        },
        Faculty: {
          type: String,
          required: true,
          default: "",
        },
        department: {
          type: String,
          required: true,
          default: "",
        },
      },
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const ProfileModel = model("Profile", ProfileSchema);

export { ProfileModel };
