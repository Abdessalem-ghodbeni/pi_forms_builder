import mongoose from "mongoose";
import Color from "colors";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connexion avec data base successfully ${mongoose.connection.host}`
        .bgMagenta.bgCyan
    );
  } catch (error) {
    console.log(`erreur lors du connexion avec data base ${error}`);
  }
};

export default connectDb;
