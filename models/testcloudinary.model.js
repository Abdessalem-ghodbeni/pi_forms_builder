import mongoose from "mongoose";

const testSchema = mongoose.Schema(
  {
    // name: {
    //   type: "string",
    // },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("TestSchema", testSchema);
export default Test;
