import mongoose from "mongoose";

const responseSchema = mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Forms",
      required: true,
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    answers: [
      {
        field: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FormFields",
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
