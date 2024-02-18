import mongoose from "mongoose";

const formsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "le titre est obligatoire"],
    },
    description: {
      type: String,
      required: [true, "description est obligatoire"],
    },
    link: {
      type: String,
      unique: true,
    },
    style: {
      backgroundColor: {
        type: String,
        default: "#FFFFFF",
      },
      textColor: {
        type: String,
        default: "#000000",
      },
      fontFamily: {
        type: String,
        default: "Arial",
      },
      fontSize: {
        type: Number,
        default: 14,
      },
    },

    formFields: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormFildes",
      },
    ],
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Response",
      },
    ],
  },

  {
    timestamps: true,
  }
);
formsSchema.methods.addResponse = function (responseId) {
  if (!this.responses.includes(responseId)) {
    this.responses.push(responseId);
  }
};

const FormsModel = mongoose.model("Forms", formsSchema);
export default FormsModel;
