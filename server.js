import exrpress from "express";
import dotenv from "dotenv";
import Color from "colors";
import morgan from "morgan";
import cors from "cors";
import connectDb from "./config/db.js";
import multer from "multer";
import formsRouter from "./routes/forms.routes.js";
//initialisation d'expreess app
const application = exrpress();
//configuration dotenv
dotenv.config();

application.use(exrpress.json());
application.use(morgan("dev"));
application.use(cors());

const upload = multer({ dest: "images/" }); // Spécifiez le répertoire de destination pour les images
const Port = process.env.PORT || 5080;

//connect data base
connectDb();

application.use("/forms", formsRouter);

application.listen(Port, () => {
  console.log(
    `server runing in port ${process.env.PORT} on ${process.env.MODE_DEV}`
      .bgMagenta.yellow
  );
});
